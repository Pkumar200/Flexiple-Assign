import type { Connect, Plugin, ViteDevServer } from "vite";
import { loadEnv } from "vite";
import { answerAsk, keyFromEnv } from "./handle-ask";

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

function serverKey(server: ViteDevServer) {
  return keyFromEnv(loadEnv(server.config.mode, server.config.root, ""));
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
          const result = await answerAsk({
            question: body.question ?? "",
            pastedKey: body.apiKey,
            envKey: serverKey(server),
          });
          send(res, result.status, result.body);
        } catch (error) {
          const message = error instanceof Error ? error.message : "The model request failed.";
          send(res, 502, { error: message });
        }
      });
    },
  };
}
