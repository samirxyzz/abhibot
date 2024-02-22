const fs = require('fs');
const moment = require('moment-timezone');
const request = require("request");

module.exports = {
  config: {
    name: "tagadmin",
    aliases: [],
    author: "hi<@shibaSama/Hafeez Dars", 
    version: "1",
    cooldowns : 5,
    role: 0,
    shortDescription: {
      en: "get info"
    },
    longDescription: {
      en: "tag admin"
    },
    category: "utility",
    guide: { 
      en: "{p} hb"           
    }
  }, 
  langs: {
      en: { replySuccess: "Sent your reply to admin successfully!", 
      reply: "📍 Reply from admin %1:\n─────────────────\n%2\n─────────────────\nReply this message to continue send message to admin"
    } 
    }, 

onStart: async function ({api, event, args}){ 
  const fs = require("fs-extra");
      const dirMaterial = __dirname + `/noprefix/`;
    if (!fs.existsSync(dirMaterial + "noprefix")) fs.mkdirSync(dirMaterial, { recursive: true });
    if (!fs.existsSync(dirMaterial + "bank.gif")) request("https://i.imgur.com/yj7BGDx.gif ").pipe(fs.createWriteStream(dirMaterial + "bank.gif"));

      let path = __dirname + "/cache/tagadmin.json"; 
    if(!fs.existsSync(path)) fs.writeFileSync(path, "{}");

      let data = JSON.parse(fs.readFileSync(path));
    if(!data[event.threadID]) data[event.threadID] = true;

    if(args[0] == "off") data[event.threadID] = false;
    else if(args[0] == "on") data[event.threadID] = true;
    else return api.sendMessage({body: `Please enable tagadmin on or off`, attachment: fs.createReadStream(__dirname + `/noprefix/bank.gif`)}, event.threadID, event.messageID);

    fs.writeFileSync(path, JSON.stringify(data, null, 4));
    return api.sendMessage({body: `Tag Admin has been ${data[event.threadID] ? "on" : "off"}`, attachment: fs.createReadStream(__dirname + `/noprefix/bank.gif`)}, event.threadID, event.messageID);

}, 

onReply: async function ({message, api, event, Reply, usersData, threadsData, args, commandName}) {
let uid = event.senderID;
var msg = [`ljkj`];
    const { type, threadID, messageIDSender } = Reply;
  const { isGroup } = event;
    switch (type) {
        case "tagadmin": {
        let sendByGroup = "";
           const name = (await usersData.get(uid)).name;

                if (isGroup) {
          const { threadName } = await api.getThreadInfo(event.threadID);
          sendByGroup = getLang("sendByGroup", threadName, event.threadID);
        };

            const formMessage = {
                body: `=== [SATISH 𝐅𝐄𝐄𝐃𝐁𝐀𝐂𝐊 ] ===\n━━━━━━━━━━━━━━━━━━\n💌 𝐂𝐨𝐧𝐭𝐚𝐧𝐭: ${body}\n👤 𝗮𝗱𝗺𝗶𝗻: ${name || "facebook users"}\n⏰ 𝗧𝗶𝗺𝗲: ${moment().tz("Asia/Kolkata").format("DD/MM/YYYY-HH:mm:ss")}\n🌐 𝗟𝗶𝗻𝗸 𝗙𝗯: https://www.facebook.com/profile.php?id=${event.senderID}\n💬 𝐂𝐨𝐧𝐭𝐚𝐜𝐭: m.me/${event.senderID}\n━━━━━━━━━━━━━━━━━━\n🌹 𝐑𝐞𝐩𝐥𝐲 𝐓𝐨 𝐌e𝐬𝐬a𝐠𝐞 (𝐅𝐞𝐞𝐝𝐛𝐚𝐜𝐤) 𝐀𝐛𝐨𝐮𝐭 SATISH 💞 `, attachment: await downLoad(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, __dirname+'/cache/12345.jpg')     	
               }; 
               api.sendMessage(formMessage, threadID, (err, info) => {
          if (err)
            return message.err(err);
          message.reply(getLang("replySuccess"));
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
                        type: "reply",
                        messageID: info.messageID,
                        messID: event.messageID,
                        threadID: event.threadID
          });
          }, messID);
          break;
        }       
        case "reply": {
           const name = (await usersData.get(uid)).name; 
            api.sendMessage({body: `=== [ 𝐔𝐒𝐄𝐑 𝐑𝐄𝐏𝐋𝐘 ] ===\n━━━━━━━━━━━━━━━━━━\n𝐂𝐨𝐧𝐭e𝐧𝐭 :${body}\n𝗡𝗮𝗺𝗲 : ${name || "facebook users"}\n𝙗𝙤𝙭 : ${(await threadsData.getInfo(threadID)).threadName || "Unknown"}\n𝗧𝗶𝗺𝗲: ${moment().tz("Asia/Kolkata").format("DD/MM/YYYY-HH:mm:ss")}\n━━━━━━━━━━━━━━━━━━\n 𝐑𝐞𝐩𝐥𝐲 𝐓𝐨 𝐓𝐡𝐞 𝐌e𝐬𝐬a𝐠𝐞 (𝐑𝐞𝐩𝐥𝐲) 𝐁𝐚𝐜𝐤 𝐓𝐨 𝐓𝐡𝐞 𝐓𝐚𝐠𝐠𝐞𝐫`, attachment: await downLoad(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, __dirname+'/cache/12345.jpg')},Reply.threadID, (err, info) => {
                if(err) console.log(err)
                else {
                    global.GoatBot.onReply.push({
                        commandName,
                        type: "tagadmin",
                        messageID: info.messageID,
                        messID: messageID,
                        threadID
                    })
                }
            }, Reply.messID);
            break;
        }
   }
 }, 




 onChat: async ({ api, event, usersData, threadsData, commandName, args }) => {
    const { threadID, messageID, body, mentions, senderID } = event;
   // let mentions = event.mentions;

    let path = __dirname + "/cache/tagadmin.json";
    if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
    let data = JSON.parse(fs.readFileSync(path));
    if (!data[threadID]) data[threadID] = true;

    if (!mentions || !data[threadID]) return;

    let mentionsKey = Object.keys(mentions);
   const { config } = global.GoatBot;
    //let allAdmin = global.config.adminBot;
   const adminID = config.adminBot;

    mentionsKey.forEach(async (each) => {
        if (each == api.getCurrentUserID()) return;
        if (adminID.includes(each)) {

          const userName = (await usersData.get(senderID)).name;

            let tid = threadID;
    const threadData = await threadsData.get(tid);
        const threadName = threadData.threadName;

            api.sendMessage({
                body: `=== [TAG - SATISH ] ===\n━━━━━━━━━━━━━━━━━━\n👤 𝐏𝐞𝐨𝐩𝐥𝐞 𝐓𝐚𝐠: ${userName}\n🎧 𝗕𝗼𝘅: ${threadName || "Unknown"}\n💌 𝐂𝐨𝐧𝐭𝐞𝐧𝐭: ${body}\n⏰ 𝗧𝗶𝗺𝗲: ${moment().tz("Asia/Kolkata").format("DD/MM/YYYY-HH:mm:ss")}\n🌐 𝗟𝗶𝗻𝗸 𝗙𝗯: https://www.facebook.com/profile.php?id=${event.senderID}\n💬 𝐂𝐨𝐧𝐭𝐚𝐜𝐭: m.me/${event.senderID}\n━━━━━━━━━━━━━━━━━━\n𝗥𝗲𝗽𝗹𝘆 𝐌essa𝐠𝐞 (𝐑𝐞𝐩𝐥𝐲) 𝐁𝐚𝐜𝐤 𝐓𝐨 𝐓𝐡𝐞 𝐓𝐚𝐠𝐠𝐞𝐫💞`,
                attachment: await module.exports.downLoad(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, __dirname + '/cache/12345.jpg')
            }, each, (err, info) => {
                if (err) console.log(err)
                else {
                    global.GoatBot.onReply.set({
                        commandName,
                        type: "tagadmin",
                        messageID: info.messageID,
                        messID: messageID,
                        author: each,
                        threadID
                    })
                }
            })
        }
    })

    fs.writeFileSync(path, JSON.stringify(data, null, 4));
},


downLoad: async function(a, b) {
    await (require('image-downloader')).image({
        url: a, dest: b
    });
    return (require('fs-extra')).createReadStream(b);
}
}