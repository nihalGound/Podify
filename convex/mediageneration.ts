import { v } from "convex/values";
import { action } from "./_generated/server";
import axios from "axios";
import FormData from "form-data";

export const generateAudio = action({
  args: { input: v.string(), voiceType: v.string() },
  handler: async (_, args) => {
    const apiKey = process.env.TEXT_TO_SPEECH_GOOGLE_CLOUD_KEY;
    const endPoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${apiKey}`;
    const voiceName = args.voiceType === "Basic" ? "Standard" : args.voiceType === "Neural2" ? "Neural2" : "Wavenet";
    const payload = {
      "audioConfig": {
        "audioEncoding": "MP3",
        "effectsProfileId": [
          "small-bluetooth-speaker-class-device"
        ],
        "pitch": 0,
        "speakingRate": 1
      },
      "input": {
        "text": args.input
      },
      "voice": {
        "languageCode": "en-IN",
        "name": `en-IN-${voiceName}-A`
      }
    };

    try {
      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!data) {
        throw new Error(`Error generating audio: ${data}`);
      }

      const audioContent = data?.audioContent;
      if (!audioContent) {
        throw new Error("Missing audio content in response");
      }

      return audioContent;
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  }
});


export const genrateThumbnail = action({
  args:{input:v.string()},
  handler:async(_,args)=>{
    const payload = {
      prompt: args.input,
      output_format: "png"
    };
    const form = new FormData();
    form.append('prompt', payload.prompt);
    form.append('output_format', payload.output_format);
    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
      form,
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: { 
          // ...form.getHeaders(),
          Authorization: `Bearer sk-SIHtXhz8GskTXKOi3ZxL3eaNU5mx2WOnUt91flx7XIyPnL9L`, 
          Accept: "image/*" 
        },
      }
    );
    console.log(response.data)
    if(response.status === 200) {
      return  response.data
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  }
});