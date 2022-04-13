import chromium from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Start the browser with the AWS Lambda wrapper (chrome-aws-lambda)

  const browser = await puppeteer.launch(
    process.env.AWS_EXECUTION_ENV
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
        }
      : {
          args: [],
          executablePath:
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        }
  );
  // Create a page with the Open Graph image size best practise
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
  });
  // Generate the full URL out of the given path (GET parameter)
  await page.goto("https://google.com", {
    timeout: 15 * 1000,
  });

  // Generate image
  const data = await page.screenshot({
    type: "png",
  });
  await browser.close();
  // Set the s-maxage property which caches the images then on the Vercel edge
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
  res.setHeader("Content-Type", "image/png");
  // write the image to the response with the specified Content-Type
  res.end(data);
};
