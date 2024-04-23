import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import { ArtistCard } from "@/components/ArtistCard";
import { ArtworkCard } from "@/components/ArtworkCard";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
  return <div>Loading...</div>;
}

async function submitUserMessage(userInput: string): Promise<any> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // Update the AI state with the new user message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);

  // The `render()` creates a generated, streamable UI.
  const ui = render({
    model: "gpt-4-0125-preview",
    provider: openai,
    messages: [
      {
        role: "system",
        content: `
      You are a helpful assistant for the fine art marketplace Artsy.

      You can help users find information about artists and artworks.

      When asked about artists you strongly prefer to get the information from Artsy.
      If you cannot find the information on Artsy, you may so say and then
      answer the question based on what you do know.
      `,
      },
      // @ts-ignore
      ...aiState.get(),
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return <p>{content}</p>;
    },
    tools: {
      get_artist_info: {
        description: "Get information for an artist from Artsy, given its ID",
        parameters: z
          .object({
            artistID: z.string().describe("the id of the artist"),
          })
          .required(),
        render: async function* ({ artistID }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />;

          // Fetch the artist information from an external API.
          const artistInfo = await getArtistInfo({ id: artistID });

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_artist_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(artistInfo),
            },
          ]);

          // Return the artist card to the client.
          return <ArtistCard artist={artistInfo} />;
        },
      },
      get_artists: {
        description: `Get a list of artists on Artsy. Artists may be sorted chronologically by creation date, alphabetically by name, or in descending order of a popularity/trending score.`,
        parameters: z
          .object({
            size: z
              .number()
              .describe("the number of artists to return")
              .int()
              .positive()
              .default(5),
            sort: z
              .enum([
                "CREATED_AT_ASC",
                "CREATED_AT_DESC",
                "SORTABLE_ID_ASC",
                "SORTABLE_ID_DESC",
                "TRENDING_DESC",
              ])
              .describe("the sort order in which to return artists")
              .default("SORTABLE_ID_ASC"),
          })
          .required(),
        render: async function* ({ size, sort }) {
          console.log("get_artists", { size, sort });
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />;

          // Fetch the artist information from an external API.
          const artists = await getArtists({ size, sort });

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_artist_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(artists),
            },
          ]);

          // Return the artist cards to the client.
          return (
            <div style={{ display: "flex", gap: "1em" }}>
              {artists.map((a: any) => {
                return <ArtistCard key={a.slug} artist={a} />;
              })}
            </div>
          );
        },
      },
      /*
      {
        type: "function",
          function: {
            name: "get_curated_artists",
            description: `Get a list of curated artists on Artsy. These are artists whose works have been highlighted by Artsy curators, and may change from week to week.`,
            parameters: {
              type: "object",
              properties: {
                size: {
                  type: "integer",
                  description: "The number of artists to return",
                  default: 5,
                  minimum: 1,
                  maximum: 20,
                },
              },
            },
          },
        }
      */
      get_curated_artists: {
        description: `Get a list of curated artists on Artsy. These are artists whose works have been highlighted by Artsy curators, and may change from week to week.`,
        parameters: z
          .object({
            size: z
              .number()
              .describe("the number of artists to return")
              .int()
              .positive()
              .default(5),
          })
          .required(),
        render: async function* ({ size }) {
          console.log("get_curated_artists", { size });
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />;

          // Fetch the artist information from an external API.
          const curatedArtists = await getCuratedArtists({ size });

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_curated_artists",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(curatedArtists),
            },
          ]);

          // Return the artist cards to the client.
          return (
            <div style={{ display: "flex", gap: "1em" }}>
              {curatedArtists.map((a: any) => {
                return <ArtistCard key={a.slug} artist={a} />;
              })}
            </div>
          );
        },
      },
      get_artist_artworks: {
        description: `Get a list of artworks created by a specific artist, given the artist's ID or slug.`,
        parameters: z.object({
          artistID: z.string().describe("the id or slug of the artist"),
        }),
        render: async function* ({ artistID }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner />;

          // Fetch the artist information from an external API.
          const artistInfo = await getArtistInfo({ id: artistID });
          const artworks = artistInfo.artworksConnection.edges.map(
            (edge: any) => edge.node
          );

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_artist_info",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(artworks),
            },
          ]);

          // Return the artist card to the client.
          return (
            <div style={{ display: "flex", gap: "1em" }}>
              {artworks.map((a: any) => {
                return <ArtworkCard key={a.slug} artwork={a} />;
              })}
            </div>
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});

/*
 * Define the get_artists() and get_curated_artists() functions that can be called by the chat completion
 */

async function getArtistInfo(args: { id: string }) {
  const query = `query GetArtist($id: String!) {
    artist(id: $id) {
      slug
      name
      formattedNationalityAndBirthday
      counts {
        forSaleArtworks
      }
      coverArtwork {
        image {
          resized(width: 200, height: 200) {
            src
            width
            height
          }
        }
      },
      artworksConnection(first: 3, sort: CREATED_AT_DESC) {
        edges {
          node {
            title
            slug
            date
            artistNames
            mediumType {name}
            medium
            image {
              resized(width: 300, height: 300) {
                src
                width
                height
              }
            }
          }
        }
      }
    }
  }`;

  const variables = {
    id: args.id,
  };

  const response = await metaphysics({ query, variables });
  console.log(JSON.stringify(response, null, 2));
  return response.data.artist;
}

async function getArtists(args: { size: number; sort: string }) {
  const query = `query GetArtists($size: Int!, $sort: ArtistSorts) {
    artists(size: $size, sort: $sort) {
      slug
      name
      formattedNationalityAndBirthday
      counts {
        forSaleArtworks
      }
      coverArtwork {
        image {
          resized(width: 200, height: 200) {
            src
            width
            height
          }
        }
      }
    }
  }`;

  const variables = {
    size: args.size,
    sort: args.sort,
  };

  const response = await metaphysics({ query, variables });
  return response.data.artists;
}

async function getCuratedArtists(args: { size: number }) {
  const query = `query GetCuratedArtists($size: Int!) {
    curatedTrendingArtists(first: $size) {
      edges {
        node {
          slug
          name
          formattedNationalityAndBirthday
          counts {
            forSaleArtworks
          }
          coverArtwork {
            image {
              resized(width: 200, height: 200) {
                src
                width
                height
              }
            }
          }
        }
      }
    }
  }`;

  const variables = {
    size: args.size ?? 5,
  };

  const response = await metaphysics({ query, variables });
  console.log(JSON.stringify(response, null, 2));
  return response.data.curatedTrendingArtists.edges.map(
    (edge: any) => edge.node
  );
}

/*
 * Define the API helpers the the function calls will make use of
 */

async function metaphysics(args: {
  query: string;
  variables: Record<string, unknown>;
}) {
  const { query, variables } = args;

  const url = "https://metaphysics-production.artsy.net/v2";
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ query, variables });
  const options = { method: "POST", headers, body };

  const response = await fetch(url, options);
  const json = await response.json();
  return json;
}
