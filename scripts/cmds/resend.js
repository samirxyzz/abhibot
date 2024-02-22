const axios = require("axios");

module.exports = {
  config: {
    name: "resend",
    version: "1.0",
    author: "Samir B. Thakuri",
    countDown: 1,
    role: 0,
    shortDescription: "Enable/disable resend",
    longDescription: "",
    category: "boxcontrol",
    guide: "{pn} {{[on | off]}}",
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function ({ message, event, threadsData, api, args }) {
    function checkPermissionAndSendMessage(permission, message) {
      if (!permission.includes(event.senderID)) {
        api.sendMessage(message, event.threadID, event.messageID);
        return false;
      }
      return true;
    }

    const GODPermission = global.GoatBot.config.GOD;
    const vipUserPermission = global.GoatBot.config.vipUser;

    const permissionMessage = "You don't have enough permission to use this command. Only my authors and VIP users have access";

    if (!checkPermissionAndSendMessage(GODPermission, permissionMessage)) {
      return;
    }

    if (!checkPermissionAndSendMessage(vipUserPermission, permissionMessage)) {
      return;
    }

    let resend = await threadsData.get(event.threadID, "settings.reSend");
    
    console.log(resend);
    if (resend === undefined) {
      await threadsData.set(event.threadID, true, "settings.reSend");
    }
    console.log(await threadsData.get(event.threadID, "settings.reSend"));
    if (!["on", "off"].includes(args[0])) {
      return message.reply("on or off");
    }
    await threadsData.set(event.threadID, args[0] === "on", "settings.reSend");
    console.log(await threadsData.get(event.threadID, "settings.reSend"));
    return message.reply(`Is already ${args[0] === "on" ? "turn on" : "Turn off"}`);
  },

  onChat: async function ({ api, threadsData, usersData, event, message }) {
    if (event.type !== "message_unsend") {
      let resend = await threadsData.get(event.threadID, "settings.reSend");
      if (!resend) return;

      if (!global.reSend.hasOwnProperty(event.threadID)) {
        global.reSend[event.threadID] = [];
      }
      global.reSend[event.threadID].push(event);

      if (global.reSend[event.threadID].length > 50) {
        global.reSend[event.threadID].shift();
      }
    }
  }
};