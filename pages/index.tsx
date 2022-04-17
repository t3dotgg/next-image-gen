import Head from "next/head";
import { FormEvent, useState } from "react";
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const baseURL =
    process.env.NODE_ENV === "production"
      ? process.env.VERCEL_URL
      : "http://localhost:3000";

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const { data } = await axios.post("/api/image.png", { url });

    setUrl("");
    setScreenshot(data.imageURL);
    setLoading(false);
  };

  return (
    <div>
      <Head>
        <title>Image Gen</title>
      </Head>

      <main className="container w-screen h-screen overflow-hidden p-10 flex items-center justify-center md:p-3 bg-zinc-100">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-full md:w-3/4 lg:w-3/5">
            <form
              className="form-control w-full"
              onSubmit={(e) => handleSubmit(e)}
            >
              <label className="input-group inline-flex">
                <span>URL</span>
                <input
                  type="url"
                  placeholder="https://google.com"
                  className="input input-bordered w-full"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                ></input>
              </label>
              <button
                type="submit"
                className="btn mt-5 md:mt-2"
                disabled={loading}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
          {screenshot && (
            <div className="w-full mx-auto mt-10 md:w-3/4 lg:w-3/5">
              <a href={`${baseURL}${screenshot}`} download>
                <img src={screenshot} className="w-full" />
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
