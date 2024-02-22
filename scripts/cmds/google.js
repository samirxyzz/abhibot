const axios = require('axios');
const google = require('googlethis');
module.exports = {
  config: {
    name: "google",
    aliases: ['ggl'],
    version: "2.0",
    author: "Samir",
    role: 0,
    shortDescription: {
      en: "Searches Google for a given query."
    },
    longDescription: {
      en: "This command searches Google for a given query"
    },
    category: "utility",
    guide: {
      en: "To use this command, type !google <query>."
    }
  },
  onStart: async function ({ api, event, args }) {
    let query = args.join(" ");
  const options = {
    page: 0,
    safe: false,
    additional_params: {
      hl: "en",
    },
  };
  const response = await google.search(query, options);

  let results = "";
  for (let i = 0; i < 5; i++) {
    let title = response.results[i].title;
    let description = response.results[i].description;
    let url = response.results[i].url;
    results += `Result ${i + 1}:\nTitle: ${title}\n\nDescription: ${description}\n\nURL: ${url}\n\n`;
  }

  api.sendMessage(results, event.threadID, event.messageID);
  }
};