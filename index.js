const axios = require("axios");
const cheerio = require("cheerio");

const getURL = (url) => decodeURIComponent(url.split("=").pop());

class ProxyScraper {
  constructor({ baseUrl = "", parseUrl = true }) {
    this.baseUrl = baseUrl;
    this.parseUrl = parseUrl;
  }
  async get(path, alter = false) {
    try {
      let { data } = await axios({
        url: alter
          ? "https://i.nakedmaya.com/index.php"
          : "http://duckproxy.com/indexa.php",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        data: `q=${encodeURIComponent(
          this.baseUrl + path
        )}&hl%5Bshow_images%5D=on`,
        method: "POST",
        mode: "cors",
      });
      if (typeof data === "string") {
        if (this.parseUrl) data = data.replace(/http.*?=.*?"/g, getURL);
        return cheerio.load(data);
      } else return data;
    } catch (error) {
      if (!alter) return await this.get(path, true);
      throw new Error(error);
    }
  }
}

module.exports = ProxyScraper;
