const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function downloadReport(href, type) {
  const response = await axios.get(href, { responseType: "stream" });
  const filePath = path.join(
    __dirname,
    "../../downloaded_files",
    `${type}_report.csv`
  );
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  console.log(`File downloaded successfully: ${filePath}`);
}

module.exports = { downloadReport };
