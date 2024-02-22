const axios = require('axios');

module.exports = {
	config: {
		name: 'mizuki',
    aliases:['simsimi', 'sim'],
		version: '1.1',
		author: 'Samir',
		countDown: 5,
		role: 0,
		shortDescription: 'Mizuki Yoi',
		longDescription: 'Chat with Yoi',
		category: 'ai',
		guide: {
			body: '   {pn} {{[on | off]}}: enable/disable Mizuki Yoi'
				+ '\n'
				+ '\n   {pn} {{<word>}}: Quick chat with Mizuki Yoi'
				+ '\n   Example: {pn} {{hi}}'
		}
	},

	onStart: async function ({ args, threadsData, message, event }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.yoi");
			return message.reply(`Already ${args[0] == "on" ? "on" : "off"} Yoi in your group`);
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply("Yoi is busy, please try again later");
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.yoi")) {
			try {
				const responseMessage = await getMessage(args.join(" "));
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply("Yoi is busy, please try again later");
			}
		}
	}
};

async function getMessage(yourMessage) {
	const res = await axios.get(`https://api.samir-dev.repl.co/sim/ask?q=${encodeURIComponent(yourMessage)}`);

	if (res.status > 200)
		throw new Error(res.data.answer);

	return res.data.answer;
}