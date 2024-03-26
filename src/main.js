const runPuppet = require("./puppet");
const fetchMail = require("./fetchMail");

(async function () {
  await runPuppet();

  setTimeout(async () => {
    await fetchMail();
  }, 60000);
})();
