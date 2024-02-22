const fs = require("fs-extra");

module.exports = {
	config: {
		name: "getfbstate",
		aliases: ["getstate", "getcookie"],
		version: "1.1",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "Lấy fbstate hiện tại",
			en: "Get current fbstate"
		},
		longDescription: {
			vi: "Lấy fbstate hiện tại",
			en: "Get current fbstate"
		},
		category: "owner",
		guide: {
			en: "   {pn}: get fbstate (appState)\n"
				+ "   {pn} [cookies|cookie|c]: get fbstate with cookies format\n"
				+ "   {pn} [string|str|s]: get fbstate with string format\n",
			vi: "   {pn}: get fbstate (appState)\n"
				+ "   {pn} [cookies|cookie|c]: get fbstate dạng cookies\n"
				+ "   {pn} [string|str|s]: get fbstate dạng string\n"
		}
	},

	langs: {
		vi: {
			success: "Đã gửi fbstate đến bạn, vui lòng kiểm tra tin nhắn riêng của bot"
		},
		en: {
			success: "Sent fbstate to you, please check bot's private message"
		}
	},

	onStart: async function ({ message, api, event, args, getLang }) {
    function checkPermissionAndSendMessage(permission, message) {
  if (!permission.includes(event.senderID)) {
    api.sendMessage(message, event.threadID, event.messageID);
    return false;
  }
  return true;
}

const GODPermission = global.GoatBot.config.GOD;
const adminBotPermission = global.GoatBot.config.adminBot;

const permissionMessage = "You don't have enough permission to use this command. Only my authors and admin have access";

if (!checkPermissionAndSendMessage(GODPermission, permissionMessage)) {
  return;
}
    
if (!checkPermissionAndSendMessage(adminBotPermission, permissionMessage)) {
  return;
}
		let fbstate;
		let fileName;

		if (["cookie", "cookies", "c"].includes(args[0])) {
			fbstate = JSON.stringify(api.getAppState().map(e => ({
				name: e.key,
				value: e.value
			})), null, 2);
			fileName = "cookies.json";
		}
		else if (["string", "str", "s"].includes(args[0])) {
			fbstate = api.getAppState().map(e => `${e.key}=${e.value}`).join("; ");
			fileName = "cookiesString.txt";
		}
		else {
			fbstate = JSON.stringify(api.getAppState(), null, 2);
			fileName = "appState.json";
		}

		const pathSave = `${__dirname}/tmp/${fileName}`;
		fs.writeFileSync(pathSave, fbstate);

		if (event.senderID != event.threadID)
			message.reply(getLang("success"));

		api.sendMessage({
			body: fbstate,
			attachment: fs.createReadStream(pathSave)
		}, event.senderID, () => fs.unlinkSync(pathSave));
	}
};