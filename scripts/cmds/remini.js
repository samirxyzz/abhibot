const axios = require("axios");

module.exports = {
config: {
		name: "remini",
    aliases: ['upscale'],
    version: "1.0",
		author: "Samir X Samuel",
		countDown: 5,
		role: 0,
		shortDescription: "Increase image quality to 4k",
		longDescription: "Increase image quality to 4k",
		category: "ai",
		guide: {
      en: "{pn} Reeply To Image",
    }
	},
  onStart: async function ({ api, event }) {
    function checkPermissionAndSendMessage(permission, message) {
  if (!permission.includes(event.senderID)) {
    api.sendMessage(message, event.threadID, event.messageID);
    return false;
  }
  return true;
}
    const GODPermission = global.GoatBot.config.GOD;
const vipUserPermission = global.GoatBot.config.vipUser;
const adminBotPermission = global.GoatBot.config.adminBot;

const permissionMessage = "You are not VIP user to use this cmd. Use /request to ask  permission for this cmd to authors";

if (!checkPermissionAndSendMessage(GODPermission, permissionMessage)) {
  return;
}

if (!checkPermissionAndSendMessage(vipUserPermission, permissionMessage)) {
  return;
}
if (!checkPermissionAndSendMessage(adminBotPermission, permissionMessage)) {
  return;
}
    let eta = 3;
  const axiosInstance = axios.create();

  let send = msg => api.sendMessage(msg, event.threadID, event.messageID);

  if (event.type !== "message_reply") return send("Please reply to an image!");

  send(`Processing image resolution upgrade for ${event.messageReply.attachments.length} image(s) (${event.messageReply.attachments.length * eta}s)`);

  let stream = [];
  let exec_time = 0;

  for (let i of event.messageReply.attachments) {
    try {
      let res = await axiosInstance.get(encodeURI(`https://nams.live/upscale.png?{"image":"${i.url}","model":"4x-UltraSharp"}`), {
        responseType: "stream"
      });

      exec_time += +res.headers.exec_time;
      eta = res.headers.exec_time / 1000 << 0;
      res.data.path = "tmp.png";
      stream.push(res.data);
    } catch (error) {
      console.error(error);
      // Handle the error here, e.g., send an error message or log the error
    }
  }

  send({
    body: `Success (${exec_time / 1000 << 0}s)`,
    attachment: stream
  });
  }
};