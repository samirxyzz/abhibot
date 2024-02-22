const { createReadStream, unlinkSync, createWriteStream } = require("fs-extra");
const { resolve } = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "mizuki2",
    aliases: ['sim2', 't2a', 'simsimi2'],
    version: "1.0",
    author: "Samir",
    countDown: 5,
    role: 0,
    shortDescription: "Ask simsimi in voice",
    longDescription: {
      en: "Chat with simsimi in voice"
    },
    category: "ai",
    guide: {
      en: "{pn} <query>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      const query = args.join(' ');
      const response = await axios.get(`https://api.samir-dev.repl.co/sim/ask?q=${encodeURIComponent(query)}`);
      const simsimiResponse = response.data.answer;
      const simsimiMessage = simsimiResponse;
      const path = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}.mp3`);

      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(simsimiMessage)}&tl=en&client=tw-ob`;
      const responseStream = await axios({
        method: "GET",
        url,
        responseType: "stream",
      });

      const writer = responseStream.data.pipe(createWriteStream(path));
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.sendMessage(
        { attachment: createReadStream(path) },
        event.threadID,
        () => unlinkSync(path)
      );
    } catch (error) {
      console.error(error);
      api.sendMessage("System Busy!! My Developer (Abhishek Sahu) Is Fixing It....", event.threadID);
    }
  }
};
