import Head from "next/head";
import { FormEvent, useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { data } = await axios.post("/api/image.png", { url });

    setScreenshot(data.imageURL);

    alert("Completed");
  };
  return (
    <div>
      <Head>
        <title>Image Gen</title>
      </Head>

      <main>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="url"
            name="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit">Get Screenshot</button>
        </form>
        {screenshot && <img src={screenshot} style={{ width: "100%" }} />}
      </main>
    </div>
  );
}
