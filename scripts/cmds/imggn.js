const axios = require('axios');

module.exports = {
  config: {
    name: "imggn",
    version: "1.1",
    author: "Jarif/Walex",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: 'Text to Image'
    },
    longDescription: {
      en: "Text to image"
    },
    category: "AI-IMAGE",
    guide: {
      en: 'Type -imagine or -t2i with your prompts | (number which model do you want)\ere are the Supported models:\. Analog-diffusion-1.0\. Anythingv3_0\. Anything-v4.5\. Anything-V5\. AOM3A3_Orangemix\. Deliberate_v2\. Dreamlike-diffusion-1.0\. Dreamlike-diffusion-2.0\. Dreamshaper_5BakedVae\0. Dreamshaper_6BakedVae\1. Dreamshaper_7\2. Elldreths-vivid-mix\3. Lyriel_v15\4. Lyriel_v16\5. Mechamix_v10\6. Meinamix_meinaV9\7. Openjourney_V4\8. Portrait+1.0\9. PortraitPlus_V1.0\0. Realistic_Vision_V1.4\1. Realistic_Vision_V2.0\2. Realistic_Vision_V4.0\3. RevAnimated_v122\4. Riffusion-Model-V1\5. Sdv1_4\6. V1-5\7. ShoninsBeautiful_v10\8. Theallys-mix-ii\9. Timeless-1.0\0. EimisAnimeDiffusion_V1.0\1. Meinamix_v11'
    }
  },

  onStart: async function ({ message, args }) {
    const text = args.join(" ");
    if (!text) {
      return message.reply("Please provide a prompt.");
    }

    let prompt, model;
    if (text.includes("|")) {
      const [promptText, modelText] = text.split("|").map((str) => str.trim());
      prompt = promptText;
      model = modelText;
    } else {
      prompt = text;
      model = "23";  
    }

    let id; 

    message.reply("✅| Creating your Imagination...").then((info) => {
      id = info.messageID;  
    });

    try {
      const API = `https://api.qhing.repl.co/generate??model=${model}&prompt=${encodeURIComponent(prompt)}&apikey=anniejarif`;
      const imageStream = await global.utils.getStreamFromURL(API);

      return message.reply({
        attachment: imageStream
      });
    } catch (error) {
      console.log(error);
      message.reply("Failed to generate your imagination.").then(() => {
        message.delete(id);
      });
    }
  }
};