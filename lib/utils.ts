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

export const configureAssistant = (voice: string, style: string) => {
  const voiceId =
    voices[voice as keyof typeof voices]?.[style as keyof (typeof voices)[keyof typeof voices]] || "sarah";

  const vapiAssistant: CreateAssistantDTO = {
    name: "GenZ Study Buddy",
    firstMessage: "Yo, what’s up? Let’s deadass get into {{topic}} today. You ready?",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
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
          content: `
You’re a lit tutor who talks like a real one from Gen Z TikTok. You’re guiding a student in a chill, funny, and slightly chaotic but educational way.

Tutor Guidelines:
- Stick to the topic - {{ topic }} and subject - {{ subject }} fr fr.
- Keep the convo fun and real, like you're Facetiming your homie.
- Check in with the student often like “You with me?” or “That make sense or nah?”
- Break stuff down like you’re explaining it to your little cousin who zones out every 5 seconds.
- Vibe with the style '{{ style }}' — keep it hella casual.
- Keep your responses short and spicy – like you’re in a real talk.
- Avoid fancy symbols or nerdy robot stuff – this is a voice chat, not a textbook.

And deadass, make learning fun. No cap.
          `,
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  };
  return vapiAssistant;
};
