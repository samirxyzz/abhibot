const axios = require('axios');

module.exports = {
	config: {
		name: "ss",
		aliases: ["screenshot"],
		version: "1.0",
		author: "MILAN",
		countDown: 5,
		role: 2,
		shortDescription: "get screenshot of website",
		longDescription: "get screenshot of website",
		category: "image",
		guide: "{pn} link"
	},

	onStart: async function ({ message, args }) {
		const name = args.join(" ");
		let url = "";
		if (!name) {
			return message.reply(`⚠️ | Please enter an url or search query!`);
		} else {
			try {
				new URL(name);
				url = name;
			} catch (err) {
				url = `https://www.google.com/search?q=${encodeURIComponent(name)}`;
			}
			const BASE_URL = `https://api.samir-dev.repl.co/screenshot?url=${encodeURIComponent(url)}`;
			try {
				const form = {
          body: ``
        };
        form.attachment = []
        form.attachment[0] = await global.utils.getStreamFromURL(BASE_URL);
        message.reply(form); 
			} catch (e) { 
				message.reply(`Error`);
			}
		}
	}
};