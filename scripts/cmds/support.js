module.exports = {
  config: {
    name: "yuukigc",
    aliases: ['gc', 'supportgc', 'support'],
    version: "1.0",
    author: "Xemon—",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Add user to support group",
    },
    longDescription: {
      en: "This command adds the user to the admin support group.",
    },
    category: "support",
    guide: {
      en: "To use this command, simply type !{pn}.",
    },
  },

  // onStart is a function that will be executed when the command is executed
  onStart: async function ({ api, args, message, event }) {
    const supportGroupId = "6589186031146175"; // ID of the support group

    const threadID = event.threadID;
    const userID = event.senderID;

    // Check if the user is already in the support group
    const threadInfo = await api.getThreadInfo(supportGroupId);
    const participantIDs = threadInfo.participantIDs;
    if (participantIDs.includes(userID)) {
      // User is already in the support group
      api.sendMessage(
        "You are already in the support group. If you didn't find it, please check your message requests or spam box.",
        threadID
      );
    } else {
      // Add user to the support group
      api.addUserToGroup(userID, supportGroupId, (err) => {
        if (err) {
          console.error("Failed to add user to support group:", err);
          api.sendMessage("I can't add you because your id is not allowed message request or your account is private. please add me then try again...", threadID);
        } else {
          api.sendMessage(
            "You have been added to the admin support group. If you didn't find the box in your inbox, please check your message requests or spam box.",
            threadID
          );
        }
      });
    }
  },
};