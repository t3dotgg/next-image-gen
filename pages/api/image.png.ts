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

  let domain = (new URL(req.body.url)).hostname;
  domain = domain.replace(/^www\./, "");
  domain = domain.split(".")[0];

  const currentDate = new Date().toISOString().replace(/:/g, "-");

  const fileName = `${domain}-${currentDate}.png`;

  fs.writeFileSync(`public/images/${fileName}`, data);

  await browser.close();

  res.status(201).json({
    imageURL: `/images/${fileName}`,
  })

  // Set the s-maxage property which caches the images then on the Vercel edge
  // Send the image a json response
  // res.setHeader("Content-Type", "image/png");
  // res.setHeader("Cache-Control", "public, max-age=31536000");
  // res.setHeader("Expires", new Date(Date.now() + 31536000).toUTCString());
  // res.status(200).send(data);


};
