const axios = require("axios");
const cheerio = require("cheerio");

const getURL = (url) => decodeURIComponent(url.split("=").pop());

class ProxyScraper {
  proxyUrl = (url) =>
    `http://duckproxy.com/indexa.php?${new URLSearchParams({
      q: url,
      hl: 40,
    })}`;
  constructor({ baseUrl = "", parseUrl = "all" }) {
    this.baseUrl = baseUrl;
    this.parseUrl = parseUrl;
  }
  async get(path, alter = false) {
    try {
      let { data } = await axios.get(
        (alter
          ? "https://i.nakedmaya.com/index.php"
          : "http://duckproxy.com/indexa.php") +
          `?${new URLSearchParams({
            q: this.baseUrl + path,
            hl: 40,
          })}`,
        {
          headers: {
            cookie: "flags=120",
          },
        }
      );
      if (typeof data === "string") {
        switch (this.parseUrl) {
          case "all":
            data = data.replace(/http.*?=.*?"/g, getURL);
            break;

          case "href":
            data = data.replace(
              /href="http.*?=.*?"/g,
              (str) => `href="${getURL(str)}`
            );
            break;

          default:
            break;
        }
        return cheerio.load(data);
      } else return data;
    } catch (error) {
      if (!alter) return await this.get(path, true);
      throw new Error(error);
    }
  }
}

module.exports = ProxyScraper;
