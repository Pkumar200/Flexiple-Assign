export interface ModelReply {
  title: string;
  paragraphs: string[];
  citations: string[];
  refused: boolean;
  model: string;
}

const SYSTEM = `You are the analyst inside Field, a sourced file on India's Global Capability Centres.
Write the answer in your own words, in plain sentences.
Use only the dossier in the user message. Do not use outside knowledge, memory, or estimates.
If the dossier does not contain the figure, say it is blank and set refused to true. Company headcount is always blank.
Do not borrow a software salary for any other function.
Do not give Bengaluru the incentives that apply only outside Bengaluru.
Do not treat a national rule as a reason to pick a city.
Return JSON only, with this shape: {"title": string, "paragraphs": string[], "citations": string[], "refused": boolean}.
title is one short line. paragraphs is two to four sentences, split into one sentence each. citations are source names that appear in the dossier.`;

export function detectProvider(key: string): { kind: "openai" | "gemini" | "anthropic"; url: string; model: string } {
  if (key.startsWith("AIza") || key.startsWith("AQ.")) {
    return { kind: "gemini", url: "https://generativelanguage.googleapis.com/v1beta/models", model: "gemini-3.8-flash" };
  }
  if (key.startsWith("sk-ant-")) {
    return { kind: "anthropic", url: "https://api.anthropic.com/v1/messages", model: "claude-sonnet-4-5" };
  }
  if (key.startsWith("gsk_")) {
    return { kind: "openai", url: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile" };
  }
  return { kind: "openai", url: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini" };
}

export async function complete(input: {
  key: string;
  question: string;
  dossier: string;
  modelOverride?: string;
  baseUrlOverride?: string;
}): Promise<ModelReply> {
  const detected = detectProvider(input.key);
  const model = input.modelOverride || detected.model;
  const user = `DOSSIER\n${input.dossier}\n\nQUESTION\n${input.question}`;
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await callModel(detected.kind, input.key, input.baseUrlOverride || detected.url, model, user, controller.signal);
      const parsed = parseReply(response);
      return { ...parsed, model };
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : "";
      const retryable = message.includes("(503)") || message.includes("(429)") || message.includes("(529)");
      if (!retryable || attempt === 1) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("The model took too long. Try again.");
        }
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

async function callModel(
  kind: "openai" | "gemini" | "anthropic",
  key: string,
  url: string,
  model: string,
  user: string,
  signal: AbortSignal,
): Promise<string> {
  if (kind === "gemini") return callGemini(key, model, user, signal);
  if (kind === "anthropic") return callAnthropic(key, url, model, user, signal);
  return callOpenAI(key, url, model, user, signal);
}

async function callAnthropic(key: string, url: string, model: string, user: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    signal,
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      temperature: 0.2,
      system: SYSTEM,
      messages: [{ role: "user", content: user }],
    }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(providerError(response.status, body));
  const json = JSON.parse(body) as { content?: { text?: string }[] };
  const content = json.content?.map((part) => part.text ?? "").join("");
  if (!content) throw new Error("The model returned an empty reply.");
  return content;
}

async function callOpenAI(key: string, url: string, model: string, user: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    signal,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
    }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(providerError(response.status, body));
  const json = JSON.parse(body) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("The model returned an empty reply.");
  return content;
}

async function callGemini(key: string, model: string, user: string, signal: AbortSignal): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    signal,
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
    }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(providerError(response.status, body));
  const json = JSON.parse(body) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const content = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("");
  if (!content) throw new Error("The model returned an empty reply.");
  return content;
}

function providerError(status: number, body: string): string {
  if (status === 401 || status === 403) return "That key was rejected. Check it and try again.";
  if (body.includes("credit balance is too low")) return "That Anthropic account has no credit left. Add credit, or use another key.";
  const clipped = body.replace(/\s+/g, " ").slice(0, 180);
  return `The model request failed (${status}). ${clipped}`;
}

function parseReply(raw: string): Omit<ModelReply, "model"> {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("The model did not return JSON.");
  const json = JSON.parse(raw.slice(start, end + 1)) as Partial<ModelReply>;
  const paragraphs = Array.isArray(json.paragraphs) ? json.paragraphs.filter((item) => typeof item === "string" && item.trim()) : [];
  const citations = Array.isArray(json.citations) ? json.citations.filter((item) => typeof item === "string" && item.trim()) : [];
  if (!json.title || paragraphs.length === 0) throw new Error("The model reply was missing an answer.");
  return {
    title: json.title.trim(),
    paragraphs: paragraphs.map((item) => item.trim()),
    citations: citations.map((item) => item.trim()),
    refused: Boolean(json.refused),
  };
}
