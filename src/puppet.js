const puppeteer = require("puppeteer-core");
const { downloadReport } = require("./utils");
async function runPuppet() {
  try {
    const browser = await puppeteer.launch({
      executablePath: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`,
      userDataDir: `./User Data`,
      args: ["--profile-directory=Profile 6"],
      headless: false,
    });

    const page = await browser.newPage();

    // finance report
    await page.goto(
      "https://www.etsy.com/your/account/payments/monthly-statement?ref=seller-platform-mcnav"
    );

    const href = await page.evaluate(() => {
      const anchor = document.querySelector(
        "#recent-activity-paged-heading .wt-btn.wt-btn--primary.wt-btn--small-xs"
      );
      return anchor ? anchor.href : null;
    });

    if (href) await downloadReport(href, "finance");

    // order report
    await page.goto("https://www.etsy.com/your/shops/me/download");

    await page.select("#filter-csv-type", "transaction-level");
    await page.select("#filter-month", String(new Date().getMonth() + 1));
    await page.select("#filter-year", String(new Date().getFullYear()));

    await page.click("#order-csv-form .btn-primary.small ");

    await browser.close();
  } catch (error) {
    console.error("Puppeteer launch error:", error);
  }
}

module.exports = runPuppet;
