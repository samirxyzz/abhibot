let axios = require("axios"); 
module.exports = {
  config: {
    name: "imgur",
    aliases: [`imageur`],
    version: "1.0",
    author: "Samir",
    countDown: 0,
    role: 0,
    shortDescription: "upload any images in imgur server..",
    longDescription: "upload any images in imgur server..",
    category: "utility",
    guide: "{pn} reply or add link of image"
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
    let linkanh = event.messageReply.attachments[0].url || args.join(" ");
    if(!linkanh) return api.sendMessage('Please reply or enter the link 1 image!!!', event.threadID, event.messageID)
    let res = await axios.get(`https://API-Web.miraiofficials123.repl.co/imgur?link=${encodeURIComponent(linkanh)}&apikey=18102004`);
    let img = res.data.data;
  return api.sendMessage(`${img}`, event.threadID, event.messageID)
  }
};