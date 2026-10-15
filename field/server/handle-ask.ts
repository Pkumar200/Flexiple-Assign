import { buildDossier } from "../src/dossier";
import { inventedNumbers } from "../src/guard";
import { complete } from "./complete";

export interface ServerKey {
  key: string;
  model?: string;
  baseUrl?: string;
}

export function keyFromEnv(env: Record<string, string | undefined>): ServerKey {
  const key =
    env.FIELD_API_KEY ||
    env.ANTHROPIC_API_KEY ||
    env.OPENAI_API_KEY ||
    env.GROQ_API_KEY ||
    env.GEMINI_API_KEY ||
    "";
  return {
    key,
    model: env.FIELD_MODEL || undefined,
    baseUrl: env.FIELD_BASE_URL || undefined,
  };
}

export function keyFromProcess(): ServerKey {
  return keyFromEnv(process.env);
}

const DISCARDED = {
  title: "The reply was discarded.",
  paragraphs: [
    "The model wrote a figure that is not in the file, so Field threw the reply away.",
    "Ask for something the file actually holds, or leave the cell blank.",
  ],
  citations: [] as string[],
  refused: true,
};

export async function answerAsk(input: {
  question: string;
  pastedKey?: string;
  envKey: ServerKey;
}): Promise<{ status: number; body: unknown }> {
  const question = input.question.trim();
  if (!question) return { status: 400, body: { error: "Ask a question first." } };

  const pasted = input.pastedKey?.trim() ?? "";
  const key = pasted || input.envKey.key;
  if (!key) {
    return { status: 503, body: { needsKey: true, error: "Add a model key to turn this on." } };
  }

  try {
    const dossier = buildDossier();
    const reply = await complete({
      key,
      question,
      dossier,
      modelOverride: pasted ? undefined : input.envKey.model,
      baseUrlOverride: pasted ? undefined : input.envKey.baseUrl,
    });
    const written = [reply.title, ...reply.paragraphs, ...reply.citations].join("\n");
    if (inventedNumbers(written, `${dossier}\n${question}`).length > 0) {
      return { status: 200, body: { ...DISCARDED, model: reply.model } };
    }
    return { status: 200, body: reply };
  } catch (error) {
    const message = error instanceof Error ? error.message : "The model request failed.";
    return { status: 502, body: { error: message } };
  }
}
