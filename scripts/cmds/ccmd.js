const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "info",
    aliases: ["c"],
    author: "Abhi",
    version: "1.7",
    countDown: 5,
    role: 2,
    category: "owner",
    description: "Creates a new file in the cmds folder and writes the provided text to the file",
    usage: "fs creat <filename> <text>",
    example: "fs create hi.js hhhhhhhhhhhh"
  },

  onStart: async function ({ args, message }) {
    const fileName = args[0];
    const text = args.slice(1).join(" ");


    if (!fileName || !text) {
      return message.reply(" ❏ Hello I Am A Massenger Chat Gpt Bot By Abhiiw xD My Prefix is [  /  ] Hope You All Enjoying);
    }


    const filePath = path.join(__dirname, '..', 'cmds', fileName);


    fs.writeFile(filePath, text, (err) => {
      if (err) throw err;
      message.reply(`✅| created ${fileName} file 📜 restart 🌀 the bot`);
    });
  }
}