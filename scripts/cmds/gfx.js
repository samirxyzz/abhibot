const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
	config: {
		name: "gfx",
    aliases: ["gfxs"],
    version: "1.0",
		author: "Samir",
		countDown: 5,
		role: 0,
		shortDescription: "Make A gfx logo",
		longDescription: "Make A gfx logo",
		category: "gfx",
		guide: {
      en: "{p}{n} name",
    }
	},

	onStart: async function ({ message, args }) {
		const text = args.join(" ");
		if (!text) {
			return message.reply(`Please enter a text`);
		} else {
			const img = `https://api.samir-dev.repl.co/api/gfx?text=${encodeURIComponent(text)}`;		
      
                 const form = {
				body: `Here's Your GFX logo...`
			};
				c
			message.reply(form);
			  }
}
};