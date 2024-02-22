const axios = require("axios");

module.exports = {
config: {
		name: "imagine",
    version: "1.0",
		author: "Samir Thakuri",
		countDown: 30,
		role: 0,
		shortDescription: "Generate Images.",
		longDescription: "Featuring Image Generator AI From Your Prompt.",
		category: "ai",
		guide: {
      en: "{p}{n} <Prompt>",
    }
	},
  onStart: async function ({ api, event, args, message }) {
    try { 
      const samir = args.join(' ');
      const response = `https://generate.restfulapi.repl.co/generate-image?prompt=${samir},Full Realistics ultra hyper super 4k resolution midjourney de-fusion style`;
      await message.reply('⏳|Generating Image...\nPlease Wait A Moment.');
      const form = {
      body: `✅|Here's Your Image..`
      };
      form.attachment = [];
      form.attachment[0] = await
      global.utils.getStreamFromURL(response);
      message.reply(form);
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while fetching response");
    }
  }
};