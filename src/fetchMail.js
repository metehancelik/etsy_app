require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const moment = require("moment");
const { downloadReport } = require("./utils");
const MyImap = require("./imap");
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

async function fetchMail() {
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

  const date = new Date();

  const criteria = [];
  criteria.push(["SINCE", moment().format("MMMM DD, YYYY")]);
  criteria.push(["FROM", "noreply@mail.etsy.com"]);
  criteria.push([
    "SUBJECT",
    `Your CSV for ${date
      .toLocaleString("en-us", { month: "long" })
      .toLocaleString("en-us", {
        month: "long",
      })} ${date.getFullYear()} is ready to be downloaded`,
  ]);

  const emails = await imap.fetchEmails(criteria);

  const regex = /https?:\/\/storage[^\s]+/g;
  const [link] = emails.pop().body.match(regex);

  if (link) await downloadReport(link, "order");

  await imap.end();
}

module.exports = fetchMail;
