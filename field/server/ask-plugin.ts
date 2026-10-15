import type { Connect, Plugin, ViteDevServer } from "vite";
import { loadEnv } from "vite";
import { buildDossier } from "../src/dossier";
import { inventedNumbers } from "../src/guard";
import { complete } from "./complete";

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res: Connect.ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function serverKey(server: ViteDevServer): { key: string; model?: string; baseUrl?: string } {
  const env = loadEnv(server.config.mode, server.config.root, "");
  const key = env.FIELD_API_KEY || env.ANTHROPIC_API_KEY || env.OPENAI_API_KEY || env.GROQ_API_KEY || env.GEMINI_API_KEY || "";
  return { key, model: env.FIELD_MODEL || undefined, baseUrl: env.FIELD_BASE_URL || undefined };
}

export function fieldAskPlugin(): Plugin {
  return {
    name: "field-ask",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url === "/api/ask/status" && req.method === "GET") {
          send(res, 200, { configured: Boolean(serverKey(server).key) });
          return;
        }
        if (url !== "/api/ask" || req.method !== "POST") {
          next();
          return;
        }
        try {
          const raw = await readBody(req);
          const body = raw ? (JSON.parse(raw) as { question?: string; apiKey?: string }) : {};
          const question = body.question?.trim() ?? "";
          if (!question) {
            send(res, 400, { error: "Ask a question first." });
            return;
          }
          const fromEnv = serverKey(server);
          const key = body.apiKey?.trim() || fromEnv.key;
          if (!key) {
            send(res, 503, { needsKey: true, error: "Add a model key to turn this on." });
            return;
          }
          const dossier = buildDossier();
          const usingEnv = !body.apiKey?.trim();
          const reply = await complete({
            key,
            question,
            dossier,
            modelOverride: usingEnv ? fromEnv.model : undefined,
            baseUrlOverride: usingEnv ? fromEnv.baseUrl : undefined,
          });
          const written = [reply.title, ...reply.paragraphs, ...reply.citations].join("\n");
          const invented = inventedNumbers(written, `${dossier}\n${question}`);
          if (invented.length > 0) {
            send(res, 200, {
              title: "The reply was discarded.",
              paragraphs: [
                "The model wrote a figure that is not in the file, so Field threw the reply away.",
                "Ask for something the file actually holds, or leave the cell blank.",
              ],
              citations: [],
              refused: true,
              model: reply.model,
            });
            return;
          }
          send(res, 200, reply);
        } catch (error) {
          const message = error instanceof Error ? error.message : "The model request failed.";
          send(res, 502, { error: message });
        }
      });
    },
  };
}
