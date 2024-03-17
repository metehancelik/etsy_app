require("dotenv").config();
const argv = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const moment = require("moment");
const MyImap = require("./my-imap");
const logger = require("pino")({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: false,
      colorize: true,
      ignore: "pid,hostname,time",
    },
  },
});

async function run() {
  const config = {
    imap: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      tls: process.env.EMAIL_TLS,
    },
    debug: logger.info.bind(logger),
  };

  const imap = new MyImap(config);
  await imap.connect();
  await imap.openBox();

  const criteria = [];
  criteria.push(["SINCE", moment().format("MMMM DD, YYYY")]);
  criteria.push(["FROM", "noreply@mail.etsy.com"]);
  criteria.push([
    "SUBJECT",
    "Your CSV for March 2024 is ready to be downloaded",
  ]);

  const emails = await imap.fetchEmails(criteria);

  const regex = /https?:\/\/[^\s]+/g;
  const link = emails[0].body.match(regex);
  try {
    const response = await axios.get(link[0], { responseType: "stream" });
    const filePath = path.join(__dirname, "downloaded_files", "file.csv");
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    console.log(`File downloaded successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error fetching link: ${link[0]}, Error: ${error.message}`);
  }
  await imap.end();
}

module.exports = run;

// run()
//   .then(() => {
//     process.exit();
//   })
//   .catch((error) => {
//     logger.error(error);
//     process.exit(1);
//   });
