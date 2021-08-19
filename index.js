const axios = require("axios");
const cheerio = require("cheerio");

async function proxyScrape(path, alter = false) {
  try {
    const { data } = await axios({
      url: alter
        ? "https://i.nakedmaya.com/index.php"
        : "http://duckproxy.com/indexa.php",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: `q=${encodeURIComponent(path)}&hl%5Bshow_images%5D=on`,
      method: "POST",
      mode: "cors",
    });
    return cheerio.load(data);
  } catch (error) {
    if (!alter) return await proxyRequest(path, true);
    throw new Error(error);
  }
}

export default proxyScrape;
