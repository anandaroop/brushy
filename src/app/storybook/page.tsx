import { ArtistCard } from "@/components/ArtistCard";
import { ArtworkCard } from "@/components/ArtworkCard";

export default function Page() {
  return (
    <main style={{ minHeight: "100vh", padding: "2em" }}>
      <p style={{ margin: "1em 0", lineHeight: 1.5 }}>
        JKJK this is not really a Storybook, but here is a reference and sandbox
        for roughing out some reusable components for the “Generative UI” aspect
        of this prototype:
      </p>

      <div style={{ margin: "2em" }} />

      <h2>ArtistCard</h2>

      <div style={{ margin: "2em" }} />

      <div>
        <ArtistCard artist={artist} />
      </div>

      <div style={{ margin: "2em" }} />

      <div style={{ display: "flex", gap: "1rem" }}>
        <ArtistCard artist={artist} />
        <ArtistCard artist={artist} />
      </div>

      <div style={{ margin: "2em" }} />

      <h2>ArtworkCard</h2>

      <div style={{ margin: "2em" }} />

      <div>
        <ArtworkCard artwork={artwork} />
      </div>
    </main>
  );
}

const artist = {
  slug: "pablo-picasso",
  name: "Pablo Picasso",
  formattedNationalityAndBirthday: "Spanish, 1881–1973",
  counts: {
    forSaleArtworks: 1883,
  },
  coverArtwork: {
    image: {
      resized: {
        src: "https://d7hftxdivxxvm.cloudfront.net?height=138&quality=80&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fi3rCA3IaKE-cLBnc-U5swQ%2Flarge.jpg&width=200",
        width: 200,
        height: 138,
      },
    },
  },
};

const artwork = {
  title: "1981 Ford Station Wagon with Batman Bobblehead",
  slug: "jj-manford-1981-ford-station-wagon-with-batman-bobblehead",
  date: "2023",
  artistNames: "JJ Manford",
  mediumType: {
    name: "Painting",
  },
  medium: "Oil stick, oil pastel, and Flashe on Linen",
  image: {
    resized: {
      src: "https://d7hftxdivxxvm.cloudfront.net?height=239&quality=80&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FUFqOo7EUJTROMWWIxP746g%2Flarge.jpg&width=300",
      width: 300,
      height: 239,
    },
  },
};
