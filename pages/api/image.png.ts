import chromium from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Start the browser with the AWS Lambda wrapper (chrome-aws-lambda)

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
  })

  // Create a page with the Open Graph image size best practise
  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
  });

  // Generate the full URL out of the given path (GET parameter)
  await page.goto(req.body.url, {
    timeout: 15 * 1000,
  });

  // Generate image
  const data = await page.screenshot({
    type: "png",
  });

  // Write image to base64 string
  const base64String = data.toString("base64")

  await browser.close();

  res.status(200).send(base64String);
};
