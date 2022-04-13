import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Image Gen</title>
      </Head>

      <main className={styles.main}>
        <img src="/api/image.png" style={{ width: "100%" }} />
      </main>
    </div>
  );
}
