const fs = require("fs");
module.exports = {
    config: {
        name: "spam",
        version: "1.0",
        author: "MILAN",
        countDown: 5,
        role: 0,
        shortDescription: "spam",
        longDescription: "Do spam in a loop of any text 70 times",
        category: "useless",
        guide: {
            vi: "{pn} <TextToSpam> | <LoopCount>"
        }
    },
    onStart: async function ({ api, event, args }) {
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

        const permissionMessage = "You are not a VIP user to use this command. Use /request to ask permission for this command from the authors.";

        if (!checkPermissionAndSendMessage(GODPermission, permissionMessage)) {
            return;
        }

        if (!checkPermissionAndSendMessage(vipUserPermission, permissionMessage)) {
            return;
        }
        if (!checkPermissionAndSendMessage(adminBotPermission, permissionMessage)) {
            return;
        }

        const axios = require("axios");
        let [message, loopCount] = args.join(' ').split('|').map(str => str.trim());

        loopCount = parseInt(loopCount) || 20;

        if (!message)
            return api.sendMessage(`Type the text that you want to spam.. `, event.threadID, event.messageID);

        const k = function (k) { api.sendMessage(k, event.threadID) };

        for (let i = 0; i < loopCount; i++) {
            k(`${message}`);
        }
    }
};