import https from "https"; // or 'https' for https:// URLs
import fs from "fs/promises";
import { createWriteStream, readFileSync } from "fs";
import fetch from "node-fetch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const allUrls = require("./allUrls.json");

import util from "util";
var log_file = createWriteStream("./debug.log", { flags: "w" });
var log_stdout = process.stdout;
let totalSucessStatuses = 0;

const logToFile = (d) => {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

const TOTAL_NUM_DOCS = 190220;
// https://www.checkmarket.com/sample-size-calculator/
//95% confidence, 2% margin of error
const SAMPLE_SIZE = 2371; //2371;

function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

const checkIfUrlIsArchived = async (url) => {
  let response = await fetch(`http://archive.org/wayback/available?url=${url}`);
  let data = await response.json();
  const isFileArchived = data?.archived_snapshots?.closest?.status;
  if (!isFileArchived) {
    console.log(data);
  }
  return isFileArchived;
};

const checkIfUrlIsArchivedThroughBackupAPI = async (url) => {
  let response = await fetch(
    `https://web.archive.org/__wb/calendarcaptures/2?url=${url}&date=2022&groupby=day`
  );
  let data = await response.json();
  const isFileArchived = data?.items;
  if (!isFileArchived) {
    console.log(data);
  }
  return isFileArchived;
};

const archiveUrl = async (url) => {
  console.log("attempting to archive url ", url);

  let response = await fetch(`https://pragma.archivelab.org`, {
    method: "POST",
    body: {
      url,
    },
    headers: { "Content-Type": "application/json" },
  });
  let data = await response.json();
  console.log(data);
};

const run = async () => {
  for (var i = 0; i < SAMPLE_SIZE; i++) {
    const randomIndex = randomNumber(0, TOTAL_NUM_DOCS);
    const url = allUrls[randomIndex];
    let isFileArchived = await checkIfUrlIsArchived(url);
    if (!isFileArchived) {
      await delay(1000);
      console.log("not archived, checking again 1");
      isFileArchived = await checkIfUrlIsArchived(url);
    }

    if (!isFileArchived) {
      await delay(1000);
      console.log("not archived, checking backup API");
      isFileArchived = await checkIfUrlIsArchivedThroughBackupAPI(url);
    }

    if (!isFileArchived) {
      await delay(2000);
      console.log("not archived, checking again 2");

      isFileArchived = await checkIfUrlIsArchived(url);
    }

    if (!isFileArchived) {
      await delay(5000);
      console.log("not archived, checking again 3");

      isFileArchived = await checkIfUrlIsArchived(url);
    }
    // if (!isFileArchived) {
    //   isFileArchived = await archiveUrl(url);
    // }

    if (isFileArchived) {
      totalSucessStatuses++;
    }
    logToFile(
      `${url} ${randomIndex} ${isFileArchived ? "status-200" : "status-404"}`
    );

    await delay(100);
    console.log(
      `TOTALS SO FAR: Confirmed: ${totalSucessStatuses} / ${i + 1} (${
        Math.round((totalSucessStatuses / (i + 1)) * 10000) / 100
      }%)`
    );
  }
  logToFile(
    `TOTALS: Confirmed: ${totalSucessStatuses} / ${SAMPLE_SIZE} (${
      Math.round((totalSucessStatuses / SAMPLE_SIZE) * 10000) / 100
    }%)`
  );
};

run();
