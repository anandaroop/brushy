import styles from "./ArtistCard.module.css";

interface ArtistCardProps {
  name: string;
  images: { url?: string; alt?: string }[];
}

export const ArtistCard: React.FC<ArtistCardProps> = (props: any) => {
  const { name, images } = props;
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{name}</h1>
      <div className={styles.content}>
        <div className={styles.images}>
          {images.map((i: any, index: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={
                i.url ??
                `https://placehold.co/100x100/${randHex()}/${randHex()}`
              }
              width={100}
              height={100}
              alt={i.alt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const randHex = () => Math.floor(Math.random() * 16777215).toString(16);
