import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export const groqClient = apiKey
  ? new Groq({ apiKey, dangerouslyAllowBrowser: true })
  : undefined;

export const isGroqConfigured = Boolean(apiKey);

const DEFAULT_MODEL_FALLBACKS = [
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isGroqRateLimitError = (error: unknown): boolean => {
  const status = (error as { status?: number })?.status;
  if (status === 429) {
    return true;
  }

  const message = String((error as { message?: string })?.message ?? "");
  return message.includes("429") || /rate.?limit/i.test(message);
};

export const generateGroqText = async (
  prompt: string,
  preferredModels: string[] = []
): Promise<string> => {
  if (!groqClient) {
    throw new Error("Groq client is not configured.");
  }

  const models = [...preferredModels, ...DEFAULT_MODEL_FALLBACKS].filter(
    (model, index, allModels) => allModels.indexOf(model) === index
  );

  let lastError: unknown;

  for (const modelName of models) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const completion = await groqClient.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: "system",
              content: "You are a concise analytics assistant.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 700,
        });

        return completion.choices?.[0]?.message?.content?.trim() || "";
      } catch (error) {
        lastError = error;
        if (isGroqRateLimitError(error) && attempt < 2) {
          await sleep(600 * (attempt + 1));
          continue;
        }
        break;
      }
    }
  }

  throw lastError ?? new Error("Groq generation failed.");
};
