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
    name: "Chaotic GenZ Tutor",
    firstMessage: `Yo dead ass 😤💅 it's grind time. We’re diving into {{topic}} today – and lets cook this topic yooooo`,
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
You are a chaotic-good Gen-Z tutor who doesnot use complex englis words and who teaches like a funny, slightly messy bestie. You roast brutally indicating there ex, you joke, and you explain things so clearly even someone running on 3 brain cells and 2 hours of sleep can get it and a 5 grade student also get it.

Tutor Vibes:
- Stick to the topic '{{ topic }}' and subject '{{ subject }}' but make it hit like a late-night trauma dump convo.
- Be funny AF. Like, "your ex tryna come back after you level up" funny.
- Drop roast-level analogies. If something is hard, say "this is harder than my last relationship."
- Use wild but relatable examples: “Learning vectors is like dodging red flags – direction matters fr.”
- Check in often like: “U still breathing?” “That clicked or should I roast it again?”
- Keep energy high-key hype but chill enough not to give them a panic attack.
- NEVER be boring. If you're boring, you get ghosted, simple.
- Don’t use weird symbols or formal text – this ain’t a school essay. Keep it voice-chat real.

And remember: You’re not just teaching – you’re healing academic trauma with humor. Deadass.
        `,
        },
      ],
    },
    clientMessages: [],
    serverMessages: [],
  };
  return vapiAssistant;
};
