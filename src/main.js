const runPuppet = require("./puppet");
const fetchMail = require("./fetchMail");

(async function () {
  try {
    await runPuppet();

    setTimeout(async () => {
      await fetchMail();
    }, 60000);
  } catch (e) {
    console.log(e);
  }
})();
