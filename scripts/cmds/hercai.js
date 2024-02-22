const fs = require('fs-extra');
const axios = require("axios");
const stringSimilarity = require('string-similarity');
const { Hercai } = require('hercai');
const getFBInfo = require("@xaviabot/fb-downloader");
const ytdl = require("ytdl-core");
const request = require("request");
const yts = require("yt-search");
const FormData = require('form-data');
const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;

const herc = new Hercai();
const Prefixes = [
  'ai',
];

const models = {
    1: "v1",
    2: "v2",
    3: "v2-beta",
    4: "v3", // DALL-E
    5: "lexica",
    6: "prodia"
};

const qa = {
  "Who makes you?": ["I was created by Samir Thakuri using nodejs. He is currently learning about programming. If you need any help you can contact him through his Facebook ID"],
  // Add more predefined questions and answers as needed
};

const newQa = {};

module.exports = {
  config: {
    name: 'hercai',
    aliases: ["herc"],
    version: '2.6',
    author: 'Samir Thakuri',
    category: "AI",
    cooldown: 0,
    role: 0,
    shortDescription: "AI ChatBot by HercAI",
    longDescription: "A powerful interacting AI ChatBot with multiple functionings. ",
    guide: {
      en: "{pn} <question> -Chat with ai. \n{pn} draw <prompt> | <model>\n{pn} fbvideo <videoUrl> -Get Facebook Video\n{pn} sing <song> -Play songs from YouTube\n{pn} animeconvert -Animefy image\nAvailable Draw Model's: \n[1]. V1\n[2]. V2\n[3]. V2-Beta\n[4]. V3 (DALLE)\n[5]. Lexica \n[6]. Prodia\n"
    }
  },

  langs: {
    en: {
      noAnswerFound: "Sorry, I don't know the answer to that question [AIP not responding]",
      needAdmin: "Please add admin for bot before using this feature"
    },
  },

  onStart: async function () {},
  onChat: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {
    try {
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));

      // Check if the prefix is valid
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const userID = event.senderID;
      const username = await usersData.getName(event.senderID);
      const content = args.join(" ");

      // ... (previous code)

      const selectedModel = models[2]; // Default model: "v2-beta"

      if (content.includes("draw")) {
        const drawCommand = content.split("|");
        const model = drawCommand[1] ? drawCommand[1].trim() : selectedModel;
        const prompt = drawCommand[0].replace(/draw/i, '').trim();

        try {
          const drawResponse = await herc.drawImage({ model: models[model], prompt });
          const imageStream = await global.utils.getStreamFromURL(drawResponse.url);

          return api.sendMessage({
            attachment: imageStream
          }, event.threadID, event.messageID);
        } catch (err) {
          console.error(err);
          message.reply(`Error while processing draw command. Please try again later.`);
        }
      }

      // ... (facebook downloader)
      const fbaliases = ["videofb", "fbvideo", "downloadfb", "download this fb video", "download this facebook video", "download video fb", "download video facebook", "download facebook video"];

      if (fbaliases.some(fbalias => content.startsWith(`${fbalias}`))) {
        // Extract the URL from the message
        const url = content.replace(/^(videofb|fbvideo|downloadfb|download this fb video|download this facebook video|download video facebook|download facebook video)/, "").trim();

        if (!url) {
          return message.reply(`Missing URL Data To Download`);
        } else {
          const cookies = "sb=Z_ggZdL-hdbBEhRBBItiOB8T; datr=y9BUZSBT4zCiuHO89yQaHSaT; wd=1366x619; c_user=100008578069233; xs=13%3A0Xp81fAQkkB4Hg%3A2%3A1701963542%3A-1%3A3595%3A%3AAcVo37yDIeBz0MW3jHr2CHANcEgBrkXZn0QrSRqscQ; fr=1yVm3skUNLuTJIp21.AWV8D5MDGGKxHNSQxOIFglqhDVg.BlfAQY.mc.AAA.0.0.BlfAQY.AWVPmWHHMV4";
          const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36";

          console.log("URL:", url);
          console.log("Cookies:", cookies);
          console.log("User Agent:", userAgent);

          await message.reply("⬇|Downloading video for you...");

          try {
            const result = await getFBInfo(url, cookies, userAgent);

            console.log("Result:", result);

            // Extracting video details from the result
            const videoUrl = result.hd; // You can choose sd or hd based on your preference
            const videoTitle = result.title;

            console.log("Video URL:", videoUrl);
            console.log("Video Title:", videoTitle);

            // Download the video stream
            if (videoUrl) {
              const videoStream = await global.utils.getStreamFromURL(videoUrl);

              // Send the video and title as output
              message.reply({
                body: `Here's Your Video Request 😉.`,
                attachment: videoStream,
              });
            } else {
              message.reply(`Video URL not found in the response.`);
            }
          } catch (error) {
            console.error("Error:", error);
            message.reply(`An error occurred while fetching video.`);
          }
        }
        return;
      }

      // ... (youtube audio play)
      const singAliases = ["sing", "music", "play"];

      if (singAliases.some(singAlias => content.toLowerCase().startsWith(`${singAlias}`))) {
        const musicName = content.toLowerCase().replace(/^(sing|music|play)/, "").trim();

        if (musicName.length < 2) {
          return api.sendMessage("Please specify a music name.", event.threadID);
        }

        try {
          const searchMessage = await api.sendMessage(`✅ | Searching music for "${musicName}".\⏳ | Please wait...`, event.threadID, event.messageID);

          const searchResults = await yts(musicName);
          if (!searchResults.videos.length) {
            api.unsendMessage(searchMessage.messageID); // Unsend the searching message
            return api.sendMessage("No music found.", event.threadID, event.messageID);
          }

          const music = searchResults.videos[0];
          const musicUrl = music.url;

          const stream = ytdl(musicUrl, { filter: "audioonly" });

          const fileName = `${event.senderID}.mp3`;
          const filePath = __dirname + `/cache/${fileName}`;

          stream.pipe(fs.createWriteStream(filePath));

          stream.on('response', () => {
            console.info('[DOWNLOADER]', 'Starting download now!');
          });

          stream.on('info', (info) => {
            console.info('[DOWNLOADER]', `Downloading music: ${info.videoDetails.title}`);
          });

          stream.on('end', () => {
            console.info('[DOWNLOADER] Downloaded');

            if (fs.statSync(filePath).size > 104857600) {
              fs.unlinkSync(filePath);
              return api.sendMessage('❌ | The audio could not be sent because it is larger than 100MB.', event.threadID, event.messageID);
            }

            const message = {
              body: `💁‍♀️ | Here's your music\n\n🔮 | Title: ${music.title}\n⏰ | Duration: ${music.duration.timestamp}`,
              attachment: fs.createReadStream(filePath)
            };

            api.sendMessage(message, event.threadID, event.messageID, () => {
              fs.unlinkSync(filePath);
              api.unsendMessage(searchMessage.messageID); // Unsend the searching message
            });
          });
        } catch (error) {
          console.error('[ERROR]', error);
          api.sendMessage('🥺 | An error occurred while processing the the video.', event.threadID, event.messageID);
        }
        return;
      }

      // ... (Animefy code)
      const animefyaliases = ["animefy this", "animefy", "art", "p2a", "animeconvert", "convert to anime"];

      if (animefyaliases.some(animefyalias => content.toLowerCase().startsWith(`${animefyalias}`))) {
        const imageUrl = event.messageReply && event.messageReply.attachments[0].url ? event.messageReply.attachments[0].url : url;

        try {
          const searchMessage = await api.sendMessage(`✅ | Animefying image to anime.\⏳ | Please wait...`, event.threadID);
          const response = await axios.get(`https://animeify.shinoyama.repl.co/convert-to-anime?imageUrl=${encodeURIComponent(imageUrl)}`);
          const image = response.data.urls[1];

          const imgResponse = await axios.get(`https://www.drawever.com${image}`, { responseType: "arraybuffer" });
          const img = Buffer.from(imgResponse.data, 'binary');

          const pathie = __dirname + `/cache/animefy.jpg`;
            fs.writeFileSync(pathie, img);
          api.unsendMessage(searchMessage.messageID);

            api.sendMessage({
              body: "Here's your animefied image:",
              attachment: fs.createReadStream(pathie)
            }, event.threadID, event.messageID, () => fs.unlinkSync(pathie), event.messageID);
          } catch (error) {
          console.error('[ERROR]', error);
          api.sendMessage('Error occurred while animefying image. Please try again later.', event.threadID, event.messageID);
        }
        return;
      }

      // .... (Restart Plugin)

      // .... (Restart Plugin)

      const rebootaliases = ["restart", "restart the bot", "restart system", "reboot", "restart the system", "reboot the system"];

      if (rebootaliases.some(rebootalias => content.toLowerCase().startsWith(`${rebootalias}`))) {
        const permission = global.GoatBot.config.adminBot;
        console.log('Permission:', permission); // Debugging statement

        if (!permission.includes(event.senderID)) {
          api.sendMessage("You don't have enough permission to restart the system.", event.threadID, event.messageID);
          return;
        }

        try {
          const pathFile = `${__dirname}/tmp/restart.txt`;
          console.log('Path to file:', pathFile); // Debugging statement

          if (fs.existsSync(pathFile)) {
            const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
            console.log('File content:', tid, time); // Debugging statement
            api.sendMessage(`✅ | Bot restarted\n⏰ | Time: ${(Date.now() - time) / 1000}s`, tid);
            fs.unlinkSync(pathFile);
          }

          fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
          console.log('Restart file created:', event.threadID, Date.now()); // Debugging statement

          await message.reply(`🔄 | Restarting system...`);
          console.log('About to exit the process'); // Debugging statement
          process.exit(2);
        } catch (error) {
          console.error('[ERROR]', error);
          api.sendMessage('Error occurred while restarting the bot. Please try again later.', event.threadID);
        }
        return;
      }


      // ... (TID code)
      const tidaliases = ["tid", "threadid", "thread id", "show thread id", "show tid", "show tid of this group"];

      if (tidaliases.some(tidalias => content.toLowerCase().startsWith(`${tidalias}`))) {
        message.reply(`Here's ThreadID of this group: \n${event.threadID.toString()}`);
      }

      // ... (UID code)
      const uidaliases = ["uid", "user id", "show uid", "userid", "give my uid", "what's my uid", "show my user id", "show my uid"];

      if (uidaliases.some(uidalias => content.toLowerCase().startsWith(`${uidalias}`))) {
        try {
          // Check for message reply
          if (event.messageReply) {
            const replyUsername = await usersData.getName(event.messageReply.senderID);
            const repliedUserId = event.messageReply.senderID;
            return message.reply(`Here's ${replyUsername}'s UID: ${repliedUserId}`);
          }

          // Check for mentions
          if (event.mentions && Object.keys(event.mentions).length > 0) {
            let msg = "";
            for (const id in event.mentions) {
              msg += `${event.mentions[id].replace("@", "")}: ${id}\n`;
            }
            return message.reply(msg || getLang("syntaxError"));
          }

          // Check for provided URL(s) to find UIDs
          if (args && args[0] && args[0].match(regExCheckURL)) {
            let msg = '';
            for (const link of args) {
              try {
                const uid = await findUid(link);
                msg += `${link} => ${uid}\n`;
              } catch (e) {
                msg += `${link} (ERROR) => ${e.message}\n`;
              }
            }
            return message.reply(msg || getLang("syntaxError"));
          }

          // If none of the above conditions are met, return the UID of the sender
          return message.reply(`Your User ID: ${event.senderID}`);
        } catch (error) {
          console.error('[ERROR]', error);
          return message.reply('An error occurred. Please try again later.');
        }
      }

      // ... (Kick function)
      const kickaliases = ["kick", "remove"];

      if (kickaliases.some(kickalias => content.toLowerCase().startsWith(`${kickalias}`))) {
        const mentionedUsers = event.mentions;

        if (Object.keys(mentionedUsers).length === 0) {
          return message.reply(`Please mention the user(s) you want to kick.`);
        }

        const adminIDs = await threadsData.get(event.threadID, "adminIDs");

        if (!adminIDs.includes(api.getCurrentUserID())) {
          return message.reply(getLang("needAdmin"));
        }

        if (!adminIDs.includes(event.senderID)) {
          return message.reply(`You don't have permission to kick others.`);
        }


        const kickAndCheckError = async (uid) => {
          try {
            await api.removeUserFromGroup(uid, event.threadID);
          } catch (e) {
            console.error(e);
            message.reply(getLang("kickError"));
          }
        };

        for (const uid in mentionedUsers) {
          await kickAndCheckError(uid);
        }
      }

      // ... (pickup line code)
      const pickuplinesaliases = ["pickup line", "pickupline", "pickup lines", "tell pickup lines", "tell pickupline", "send pickupline"];
      if (pickuplinesaliases.some(pickuplinesalias => content.toLowerCase().startsWith(`${pickuplinesalias}`))) {
        const res = await axios.get(`https://api.popcat.xyz/pickuplines`);
        return api.sendMessage(`${res.data.pickupline}`, event.threadID, event.messageID)
      }

      // ... (ping code)
      const pingaliases = ["ping", "check ping", "check system ping", "what's current ping", "show current ping", "show system ping"];

      if (pingaliases.some(pingalias => content.toLowerCase().startsWith(`${pingalias}`))) {
         const timeStart = Date.now();
         await api.sendMessage("checking system ping ♻", event.threadID);
         const ping = Date.now() - timeStart;
         api.sendMessage(`Current system ping🌀: ${ping}ms.`, event.threadID);
      }

      // ... (group info code)
      const threadinfoaliases = ["group info", "thread info", "thread id", "show thread info", "show group info", "show info of this group"];

      if (threadinfoaliases.some(threadinfoalias => content.toLowerCase().startsWith(`${threadinfoalias}`))) {

            var threadInfo = await api.getThreadInfo(event.threadID);
            let threadMem = threadInfo.participantIDs.length;
          var gendernam = [];
          var gendernu = [];
          var nope = [];
          for (let z in threadInfo.userInfo) {
            var gioitinhone = threadInfo.userInfo[z].gender;

            var nName = threadInfo.userInfo[z].name;

            if (gioitinhone == 'MALE') {
              gendernam.push(z + gioitinhone);
            } else if (gioitinhone == 'FEMALE') {
              gendernu.push(gioitinhone);
            } else {
              nope.push(nName);
            }
          }
          var nam = gendernam.length;
          var nu = gendernu.length;
          let qtv = threadInfo.adminIDs.length;
          let sl = threadInfo.messageCount;
          let icon = threadInfo.emoji;
          let threadName = threadInfo.threadName;
          let id = threadInfo.threadID;
          var listad = '';
          var qtv2 = threadInfo.adminIDs;
          for (let i = 0; i < qtv2.length; i++) {
        const infu = (await api.getUserInfo(qtv2[i].id));
        const name = infu[qtv2[i].id].name;
            listad += '•' + name + '\n';
          }
          let sex = threadInfo.approvalMode;
          var pd = sex == false ? 'Turn off' : sex == true ? 'Turn on' : 'Kh';
          var pdd = sex == false ? '❎' : sex == true ? '✅' : '⭕';
           var callback = () =>
                api.sendMessage(
                  {
                    body: `GC Name: ${threadName}\nGC ID: ${id}\n${pdd} Approve: ${pd}\nEmoji: ${icon}\n-Information:\nTotal ${threadMem} members\nMale ${nam} members \nFemale: ${nu} members\n\nWith ${qtv} Administrators include:\n${listad}\nTotal number of messages: ${sl} msgs.`,
                    attachment: fs.createReadStream(__dirname + '/cache/1.png')
                  },
                  event.threadID,
                  () => fs.unlinkSync(__dirname + '/cache/1.png'),
                  event.messageID
                );
              return request(encodeURI(`${threadInfo.imageSrc}`))
                .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
                .on('close', () => callback());
      }

      // ... (group name code)
      const gcnamealiases = ["set group name to", "set thread name to", "change group name to", "change thread name to", "change gc name to", "set group name to"];

      if (gcnamealiases.some(gcnamealias => content.toLowerCase().startsWith(`${gcnamealias}`))) {
        var gcname = content.toLowerCase().replace(/^(set group name to|v|change group name to|change thread name to|change gc name to|set group name to)/, "").trim();
        var c = gcname.slice(4, 99) || event.messageReply.body;
        api.setTitle(`${c } `, event.threadID);
      }

      // ... (group emoji code)
      const gcemojialiases = ["set thread emoji to", "change gc emoji to", "set group emoji to", "change emoji to", "set emoji to"];

      if (gcemojialiases.some(gcemojialias => content.toLowerCase().startsWith(`${gcemojialias}`))) {
        var gcemoji = content.toLowerCase().replace(/^(set thread emoji to|change gc emoji to|change gc emoji to|set group emoji to|set emoji to)/, "").trim();
        api.changeThreadEmoji(gcemoji, event.threadID)
      }

      // ... (nickname code)
      const nicknamealiases = ["set nickname to", "change nickname to", "set nick name to", "change nick name to", "set name to", "setname", "set name", "setname to"];

      if (nicknamealiases.some(alias => content.toLowerCase().startsWith(`${alias}`))) {
        var name = content.replace(/^(set nickname to|change nickname to|set nick name to|change nick name to|set name to|setname|set name|setname to)/, "").trim();
        const mention = Object.keys(event.mentions)[0];
        if (!mention) return api.changeNickname(`${name}`, event.threadID, event.senderID);
        if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
      }

      // ... (group image code)
      const setGroupImageAliases = ["set group image", "change group image", "group image", "setgroupimg", "set gc image", "change gc image"];
      if (setGroupImageAliases.some(setGroupImagealias => content.startsWith(`${setGroupImagealias}`))) {

        if (event.type !== "message_reply") {
          return api.sendMessage("❌ You must reply to a certain audio, video, or photo", event.threadID, event.messageID);
        }

        if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) {
          return api.sendMessage("❌ You must reply to a certain audio, video, or photo", event.threadID, event.messageID);
        }

        if (event.messageReply.attachments.length > 1) {
          return api.sendMessage("Please reply only one audio, video, photo!", event.threadID, event.messageID);
        }

        const callback = () => {
          api.changeGroupImage(fs.createReadStream(__dirname + "/cache/1.png"), event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
        };

        return request(encodeURI(event.messageReply.attachments[0].url))
          .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
          .on('close', () => callback());
      }

      // ... (group admin code)
      const adminAliases = ["set admin", "give admin to", "make admin", "set admin to", "give administration to", "make admin to"];
      // Check if the command is one of the admin aliases
      if (adminAliases.some(alias => content.startsWith(`${alias}`))) {if (args.join().indexOf('@') !== -1) {
          namee = Object.keys(event.mentions);
        } else {
          namee = args[1];
        }

        if (event.messageReply) {
          namee = event.messageReply.senderID;
        }

        const threadInfo = await api.getThreadInfo(event.threadID);
        const findd = threadInfo.adminIDs.find(el => el.id == namee);
        const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
        const finddd = threadInfo.adminIDs.find(el => el.id == event.senderID);

        if (!finddd) {
          return api.sendMessage("You are not a box admin?", event.threadID, event.messageID);
        }

        if (!find) {
          api.sendMessage("Don't throw the admin using the cock?", event.threadID, event.messageID);
        }

        if (!findd) {
          api.changeAdminStatus(event.threadID, namee, true);
        } else {
          api.changeAdminStatus(event.threadID, namee, false);
        }
      }

      // ... (group out code)
      const leavegcaliases = ["leave this group", "leave this gc", "get out", "out from here"];

      if (leavegcaliases.some(alias => content.startsWith(`${alias}`))) {
        const permission = global.GoatBot.config.adminBot;
        console.log('Permission:', permission); // Debugging statement

        if (!permission.includes(event.senderID)) {
          api.sendMessage("Sorry! but you are not my master to let me leave this group.", event.threadID, event.messageID);
          return;
        }
            const groupId = args[0];
            if (isNaN(groupId)) {
              api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
              return;
            }
            const messageToSend = "Okey Master!\nGoodbye! I will be leaving this group.";
            message.reply(`${messageToSend}`);
            api.removeUserFromGroup(api.getCurrentUserID(), groupId);
      }

      // .... (IMGBB code)
      const imgbbaliases = ["upload this to imgbb", "upload image", "imgbb", "imgbb upload", "upload this"];
      const imgbbApiKey = "e6a573af64fc40a0b618acccd6677b74"; // Replace "YOUR_API_KEY_HERE" with your actual API key

      if (imgbbaliases.some(alias => content.startsWith(`${alias}`))) {
        const imgbbuploading = event.messageReply?.attachments[0]?.url;
        if (!imgbbuploading) {
          return api.sendMessage('Please reply to an image.', event.threadID, event.messageID);
        }

        try {
          const response = await axios.get(imgbbuploading, { responseType: 'arraybuffer' });
          const formData = new FormData();
          formData.append('image', Buffer.from(response.data, 'binary'), { filename: 'image.png' });
          const res = await axios.post('https://api.imgbb.com/1/upload', formData, {
            headers: formData.getHeaders(),
            params: {
              key: imgbbApiKey
            }
          });
          const imageLink = res.data.data.url;
          return api.sendMessage(imageLink, event.threadID, event.messageID);
        } catch (error) {
          console.log(error);
          return api.sendMessage('Failed to upload image to imgbb.', event.threadID, event.messageID);
        }
      }

      const { getPrefix } = global.utils;
      const p = getPrefix(event.threadID);
      const userQuestion = args.join(' ');
      if (!userQuestion) {
        message.reply(`Please provide some text then I will answer your text 💁\n\nHere's Guide to use HercAI:\n━━━━━━━━━━━━━\n${p}hercai <question> -Chat with ai.\n━━━━━━━━━━━━━\n${p}hercai draw <prompt> | <model>\n━━━━━━━━━━━━━\n${p}hercai fbvideo <videoUrl> -Get Facebook Video\n━━━━━━━━━━━━━\n${p}hercai sing <song> -Play songs from YouTube\n━━━━━━━━━━━━━\n${p}hercai animeconvert -Animefy image\n━━━━━━━━━━━━━\nAvailable Draw Model's: \n[1]. V1\n[2]. V2\n[3]. V2-Beta\n[4]. V3 (DALLE)\n[5]. Lexica \n[6]. Prodia\n`);
        return;
      }

      let botAnswer = null;
      let matchedQuestion = null;
      let maxSimilarity = -1;
      for (const [question, answers] of Object.entries(qa)) {
        const similarity = stringSimilarity.compareTwoStrings(userQuestion.toLowerCase(), question.toLowerCase());
        if (similarity > maxSimilarity && similarity >= 0.7) {
          maxSimilarity = similarity;
          matchedQuestion = question;
          botAnswer = answers[Math.floor(Math.random() * answers.length)];
        }
      }

      if (!botAnswer) {
        for (const [question, answers] of Object.entries(newQa)) {
          const similarity = stringSimilarity.compareTwoStrings(userQuestion.toLowerCase(), question.toLowerCase());
          if (similarity > maxSimilarity && similarity >= 0.8) {
            maxSimilarity = similarity;
            matchedQuestion = question;
            botAnswer = answers[Math.floor(Math.random() * answers.length)];
          }
        }
      }

      if (!botAnswer) {
        try {
          const response = await herc.question({ model: "v3-beta", content: `My name is ${username} and my question is: ${userQuestion}` });
          botAnswer = response.reply;
          message.reply(
            {
              body: `${botAnswer}`,
            },
            (err, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName,
                messageID: info.messageID,
                author: event.senderID,
              });
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
      if (matchedQuestion !== userQuestion && !newQa[userQuestion]) {
        newQa[userQuestion] = qa[matchedQuestion];
      }
    } catch (error) {
      console.error(error);
    }
  },


  onReply: async function ({ message, event, Reply, args, usersData }) {
    let { author, commandName, messageID } = Reply;
    const userQuestion = args.join(' ');
    if (event.senderID !== author) return;
    if (!userQuestion) {
      message.reply(`Please provide some text then I will answer your text 💁`);
      return;
    }
    const userID = event.senderID;
    const username = await usersData.getName(event.senderID);
    const content = args.join(" ");

    let botAnswer = null;
    let matchedQuestion = null;
    let maxSimilarity = -1;
    for (const [question, answers] of Object.entries(qa)) {
      const similarity = stringSimilarity.compareTwoStrings(userQuestion.toLowerCase(), question.toLowerCase());
      if (similarity > maxSimilarity && similarity >= 0.7) {
        maxSimilarity = similarity;
        matchedQuestion = question;
        botAnswer = answers[Math.floor(Math.random() * answers.length)];
      }
    }

    if (!botAnswer) {
      for (const [question, answers] of Object.entries(newQa)) {
        const similarity = stringSimilarity.compareTwoStrings(userQuestion.toLowerCase(), question.toLowerCase());
        if (similarity > maxSimilarity && similarity >= 0.8) {
          maxSimilarity = similarity;
          matchedQuestion = question;
          botAnswer = answers[Math.floor(Math.random() * answers.length)];
        }
      }
    }

    if (!botAnswer) {
      try {
        const response = await herc.question({ model: "v3-beta", content: `My name is ${username} and my question is: ${userQuestion}` });
        botAnswer = response.reply;
        message.reply(
          {
            body: `${botAnswer}`,
          },
          (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID,
            });
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
    if (matchedQuestion !== userQuestion && !newQa[userQuestion]) {
      newQa[userQuestion] = qa[matchedQuestion];
    }
  },
};
