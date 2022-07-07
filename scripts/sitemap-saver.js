import https from "https"; // or 'https' for https:// URLs
import fs from "fs/promises";
import { writeFileSync } from "fs";
import { Buffer } from "buffer";

import { XMLParser } from "fast-xml-parser";

const allUrls = [];

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

const SITEMAP_DIRECTORY = "./sitemaps";
const saveFile = async (url, isRoot) => {
  const fileName = url.substring(
    url.lastIndexOf("/") + 1,
    url.lastIndexOf(".")
  );
  console.log("filename", fileName);

  const response = await new Promise((resolve, reject) => {
    var req = https
      .get(url, (res) => {
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);
        let totalBuffer;
        res.on("data", (buffer) => {
          totalBuffer += buffer.toString("utf8");
        });

        res.on("end", () => resolve(totalBuffer));
      })
      .on("error", (e) => {
        console.log(e);
        reject(e);
      });
  });

  let rootSiteMapObj;
  try {
    //   const data = new Uint8Array(Buffer.from(response));

    const parser = new XMLParser();
    console.log(parser.parse(response));
    const parsedResponse =
      parser.parse(response)[[isRoot ? "sitemapindex" : "urlset"]]?.[
        isRoot ? "sitemap" : "url"
      ];

    if (parsedResponse?.length) {
      rootSiteMapObj = parsedResponse.map((item) => {
        if (!isRoot) {
          allUrls.push(item.loc);
        }
        return item.loc;
      });
    } else if (parsedResponse) {
      if (!isRoot) {
        allUrls.push(parsedResponse.loc);
      }
      rootSiteMapObj = [parsedResponse.loc];
    } else {
      console.log("found empty sitemap, skipping");
      return [];
    }
    // console.log("response", response);

    writeFileSync(
      `${SITEMAP_DIRECTORY}/${fileName}.json`,
      JSON.stringify(rootSiteMapObj)
    );

    writeFileSync(`${SITEMAP_DIRECTORY}/${fileName}.xml`, response);
  } catch (err) {
    console.log("error saving file", err);
    process.exit();
  }

  return rootSiteMapObj;
};
const run = async () => {
  const ROOT_MAP_URL = "https://archive.epa.gov/sitemaps/sitemapindex.xml";

  const urls = await saveFile(ROOT_MAP_URL, true);
  console.log("urls", urls);

  for (var i = 0; i < urls.length; i++) {
    const url = urls[i];
    await delay(100);
    console.log("url", url);
    await saveFile(url);
  }

  writeFileSync(`allUrls.json`, JSON.stringify(allUrls));
};

run();
