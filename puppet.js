const puppeteer = require("puppeteer-core");
const fetchMail = require("./app");

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`,
      userDataDir: `./User Data`,
      args: ["--profile-directory=Profile 6"],
      headless: false,
    });

    const page = await browser.newPage();

    await page.goto("https://www.etsy.com/your/shops/me/download");

    await page.select("#filter-csv-type", "transaction-level");
    await page.select("#filter-month", String(new Date().getMonth() + 1));
    await page.select("#filter-year", String(new Date().getFullYear()));

    await page.click("#order-csv-form .btn-primary.small ");

    await browser.close();
  } catch (error) {
    console.error("Puppeteer launch error:", error);
  }
})();

setTimeout(async () => {
  await fetchMail();
}, 60000);
