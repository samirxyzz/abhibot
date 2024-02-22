const axios = require('axios');
const getFBInfo = require("@xaviabot/fb-downloader");

module.exports = {
    config: {
        name: "videofb",
        aliases: ['fbdownload'],
        version: "1.0",
        author: "Samir",
        countDown: 30,
        role: 0,
        shortDescription: "Downloader",
        longDescription: "Download Facebook Video By Your URL",
        category: "utility",
        guide: "{pn}",
    },

  onStart: async function ({ message, args }) {
      const url = args.join(" ");
      if (!url) {
          return message.reply(`Missing URL Data To Download`);
      } else {
          const cookies = "sb=Z_ggZdL-hdbBEhRBBItiOB8T; datr=y9BUZSBT4zCiuHO89yQaHSaT; wd=1366x619; c_user=100008578069233; xs=13%3A0Xp81fAQkkB4Hg%3A2%3A1701963542%3A-1%3A3595%3A%3AAcVo37yDIeBz0MW3jHr2CHANcEgBrkXZn0QrSRqscQ; fr=1yVm3skUNLuTJIp21.AWV8D5MDGGKxHNSQxOIFglqhDVg.BlfAQY.mc.AAA.0.0.BlfAQY.AWVPmWHHMV4";
          const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36";

          await message.reply("Please Wait A Bit. 🥰");

          try {
              const result = await getFBInfo(url, cookies, userAgent);

              // Extracting video details from the result
              const videoUrl = result.hd; // You can choose sd or hd based on your preference
              const videoTitle = result.title;

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
              message.reply(`An error occurred while fetching video.`);
              console.log(error);
          }
      }
  }

};