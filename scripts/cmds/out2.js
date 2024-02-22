const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "out2",
    aliases: ["0ii"],
    version: "1.0",
    author: "WALEX",
    countDown: 5,
    role: 2,
    shortDescription: "bot will leave gc",
    longDescription: "",
    category: "admin",
    guide: {
      vi: "{pn} [tid,blank]",
      en: "{pn} [tid,blank]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    var id;
    if (!args.join(" ")) {
      id = event.threadID;
    } else {
      id = parseInt(args.join(" "));
    }
    
    api.sendMessage('goodbye guys, I wish to stay but have to obey his order...🙏💕', id, () => {
      api.removeUserFromGroup(api.getCurrentUserID(), id);
      console.log('out of thread successfully | ✅');
    });
  }
};