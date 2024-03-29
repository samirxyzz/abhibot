const axios = require('axios');

module.exports = {
  config: {
    name: "pubgguess",
    aliases: ['pubg'],
    version: "1.0",
    author: "Samir B. Thakuri",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "PUBG guess item game."
    },
    longDescription: {
      en: "Guess the item from PUBG."
    },
    category: "game",
    guide: {
      en: "{pn}"
    },
  },

  onReply: async function ({ args, event, api, Reply, commandName }) {
    let { dataGame, answer, nameUser } = Reply;
    if (event.senderID != Reply.author) return;

    switch (Reply.type) {
      case "reply": {
        const userReply = event.body.toLowerCase();

        if (userReply === answer.toLowerCase()) {
          api.unsendMessage(Reply.messageID);
          const msg = {
            body: `✅ ${nameUser}, You’ve answered correctly!\n\nAnswer: ${answer}`
          };
          return api.sendMessage(msg, event.threadID, event.messageID);
        } else {
          api.unsendMessage(Reply.messageID);
          const msg = `${nameUser}, The answer is wrong!!\nCorrect answer is: ${answer}`;
          return api.sendMessage(msg, event.threadID);
        }
      }
    }
  },

  onStart: async function ({ api, event, usersData, commandName }) {
    const { threadID, messageID } = event;
    const timeout = 60;

    try {
      const response = await axios.get('https://quiz.samirthakuri.repl.co/api/pubg');
      const quizData = response.data;
      const { img: link, question, A, B, C, D, answer } = quizData;
      const namePlayerReact = await usersData.getName(event.senderID);

      const msg = {
        body: `${body}\n\nOptions:\nA. ${A}\nB. ${B}\nC. ${C}\nD. ${D}\n\nReply with the appropriate letter (A, B, C, or D)`,
        attachment: await global.utils.getStreamFromURL(link)
      };

      api.sendMessage(msg, threadID, async (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "reply",
          commandName,
          author: event.senderID,
          messageID: info.messageID,
          dataGame: quizData,
          answer,
          nameUser: namePlayerReact
        });

        setTimeout(function () {
          api.unsendMessage(info.messageID);
        }, timeout * 1000);
      });
    } catch (error) {
      console.error("Please Contact Samir Thakuri, Here's An Error Occurred:", error);
    }
  }
};