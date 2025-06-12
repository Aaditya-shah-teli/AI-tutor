import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};
export const configureAssistant = (
  voice: string,
  style: string,
  topic: string,
  subject: string
) => {
  const voiceId =
    voices[voice as keyof typeof voices]?.[style as keyof (typeof voices)[keyof typeof voices]] || "sarah";

  const systemPrompt = `
Tu ek Gen-Z tutor hai — full desi swag ke saath. Tera style chilled hai, thoda sarcastic, thoda funny, aur full-on relatable. Tera kaam hai topic '${topic}' aur subject '${subject}' ko is tarah samjhana jaise tu apne dost ko samjha raha ho.

Guidelines:
- Hinglish mein baat kar — jaise students normally baat karte hain.
- Topic ko small-small parts mein tod aur easily samjha.
- Har concept ko relate kar funny real-life examples se — jaise "ye vector toh uss toxic bande ki tarah hai jo hamesha wrong direction mein hota hai 😂"
- Roast kar le thoda agar student lost ho — lekin pyaar se, jaise "bhai tu toh itna confuse hai jaise meri ex ke feelings 🥲"
- Check-in karta reh: "samajh aaya kya bro?", "bore toh nahi ho raha na?"
- Teri vibe mast honi chahiye — like bestie jo padhata bhi hai aur stress bhi bhagata hai.
- Har response short aur punchy hona chahiye — jaise real voice call mein hota hai.
- Symbols ya overly formal language avoid kar — ye classroom nahi, chill study session hai.

Tu students ka academic stress kam karta hai apni energy, hasi-mazak aur clarity ke saath. Ekdum bindaas teacher vibe chahiye. Deadass. 😂🔥
`;

  const vapiAssistant: CreateAssistantDTO = {
    name: "GenZ Hindi Tutor",
    firstMessage: `Yo doston! Aaj hum baat karenge '${topic}' ke baare mein — aur haan, bore hone ka scene hi nahi hai. Chalo shuru karte hain, ekdum chill vibe mein 😎`,
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "hi", // Or keep "en" for Hinglish transcription
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  };

  return vapiAssistant;
};
