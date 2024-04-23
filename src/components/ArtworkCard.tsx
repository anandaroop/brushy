import styles from "./ArtworkCard.module.css";

interface ArtworkCardProps {
  // {
  //   slug: "peter-doig-boathouse-from-black-palms-17",
  //   date: "2004",
  //   mediumType: {
  //     name: "Print",
  //   },
  //   title: "Boathouse (from Black Palms)",
  //   image: {
  //     resized: {
  //       src: "https://d7hftxdivxxvm.cloudfront.net?height=200&quality=80&resize_to=fit&src=https%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2Fe8Dv3Diko4rpcILC757usw%2Flarge.jpg&width=200",
  //       width: 200,
  //       height: 200,
  //     },
  //   },
  // };
  artwork: {
    slug: string;
    date: string;
    mediumType: {
      name: string;
    };
    artistNames: string;
    medium: string;
    title: string;
    image: {
      resized: {
        src: string;
        width: number;
        height: number;
      };
    };
  };
}

export const ArtworkCard: React.FC<ArtworkCardProps> = (props) => {
  console.log({ props });
  const { artwork } = props;
  const image = artwork.image.resized;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{artwork.title}</h1>
      </div>
      <div className={styles.content}>
        {artwork.artistNames}, {artwork.date}
      </div>
      <div className={styles.metadata}>
        <div>{artwork.mediumType.name}</div>
        <div>{artwork.medium}</div>
      </div>
      {
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={
            image?.src ??
            `https://placehold.co/100x100/${randHex()}/${randHex()}`
          }
          width={300}
          height={300}
          alt={artwork.title}
        />
      }
    </div>
  );
};

const randHex = () => Math.floor(Math.random() * 16777215).toString(16);
