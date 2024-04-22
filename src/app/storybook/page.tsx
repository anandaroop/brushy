import { ArtistCard } from "@/components/ArtistCard";

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
        <ArtistCard name="Trevor Paglen" images={[{}, {}, {}]} />
      </div>

      <div style={{ margin: "2em" }} />

      <div style={{ display: "flex", gap: "1rem" }}>
        <ArtistCard name="Trevor Paglen" images={[{}, {}, {}]} />
        <ArtistCard name="Trevor Paglen" images={[{}, {}, {}]} />
      </div>
    </main>
  );
}
