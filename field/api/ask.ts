import { answerAsk, keyFromProcess } from "../server/handle-ask";

export const config = { maxDuration: 60 };

type AskRequest = {
  method?: string;
  body?: { question?: string; apiKey?: string } | string;
};

type AskResponse = {
  status: (code: number) => AskResponse;
  json: (body: unknown) => void;
};

function readBody(body: AskRequest["body"]): { question?: string; apiKey?: string } {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as { question?: string; apiKey?: string };
    } catch {
      return {};
    }
  }
  return body;
}

export default async function handler(req: AskRequest, res: AskResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }
  const body = readBody(req.body);
  const result = await answerAsk({
    question: body.question ?? "",
    pastedKey: body.apiKey,
    envKey: keyFromProcess(),
  });
  res.status(result.status).json(result.body);
}
