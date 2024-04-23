import styles from "./ArtistCard.module.css";

interface ArtistCardProps {
  artist: {
    slug: string;
    name: string;
    formattedNationalityAndBirthday: string;
    counts: { forSaleArtworks: number };
    coverArtwork: {
      image: { resized: { src: string; width: number; height: number } };
    };
  };
}

export const ArtistCard: React.FC<ArtistCardProps> = (props) => {
  const { artist } = props;
  const image = artist.coverArtwork?.image.resized;
  console.log({ props, artist, image });
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{artist.name}</h1>
        <div className={styles.metadata}>
          {artist.formattedNationalityAndBirthday || "  "}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.images}>
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                image?.src ??
                `https://placehold.co/100x100/${randHex()}/${randHex()}`
              }
              width={200}
              height={200}
              alt={artist.name}
            />
          }
        </div>
      </div>
    </div>
  );
};

const randHex = () => Math.floor(Math.random() * 16777215).toString(16);
