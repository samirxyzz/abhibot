const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "clear",
    aliases: ["Samir B. Thakuri"],
    version: "1.0",
    author: "Samir Thakuri",
    countDown: 5,
    role: 0,
    shortDescription: "Free-UP Space",
    longDescription: "Delete all Unwanted files from the temp and cache folder.",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ args, message, api, event }) {
    const permission = global.GoatBot.config.GOD;
    if (!permission.includes(event.senderID)) {
      api.sendMessage("You don't have enough permission to use this command. Only My Author Has Access.", event.threadID, event.messageID);
      return;
    }

    const directoriesToDelete = ['cache', 'tmp'];

    try {
      // Call the new function to count and report deleted files
      this.countDeletedFiles({ event, api });

      api.sendMessage("Starting deletion process...");
      let numberOfFiles = 0;

      for (const directory of directoriesToDelete) {
        const directoryPath = path.join(__dirname, directory);
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
          const filePath = path.join(directoryPath, file);
          const fileStat = fs.statSync(filePath);

          if (fileStat.isFile()) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
            numberOfFiles++;
          }
        }
      }

      console.log("Deletion process completed successfully!");

      api.sendMessage(`Total ${numberOfFiles} Caches/Temp File(s) Deleted`, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage(`An error occurred while deleting files: ${err.message}`, event.threadID);
    }
  },
countDeletedFiles: function ({ event, api }) {
      const directoriesToDelete = ['cache', 'tmp'];
      let numberOfFiles = 0;

      for (const directory of directoriesToDelete) {
        const directoryPath = path.join(__dirname, directory);
        const files = fs.readdirSync(directoryPath);

        numberOfFiles += files.length;
      }
  }
};
