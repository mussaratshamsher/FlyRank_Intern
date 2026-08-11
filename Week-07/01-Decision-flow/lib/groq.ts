import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function decide(prompt: string): Promise<"YES" | "NO"> {
  if (!groq) {
    console.warn("GROQ_API_KEY is not configured. Running in Mock Mode.");
    const lower = prompt.toLowerCase();
    if (lower.includes("yes") || lower.includes("true") || lower.includes("allow") || lower.includes("approve") || lower.includes("success")) {
      return "YES";
    }
    if (lower.includes("no") || lower.includes("false") || lower.includes("deny") || lower.includes("block") || lower.includes("fail")) {
      return "NO";
    }
    return Math.random() > 0.5 ? "YES" : "NO";
  }

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a binary decision classifier.\n\nRead the user's decision question.\n\nReturn exactly one word:\n\nYES\n\nor\n\nNO\n\nDo not explain. Do not add punctuation. Do not return any other text.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 5,
    temperature: 0,
  });

  const text = response.choices[0]?.message?.content?.trim().toUpperCase() || "";
  if (text !== "YES" && text !== "NO") {
    throw new Error(`Invalid AI response: ${text}`);
  }
  return text as "YES" | "NO";
}

export { MODEL };
