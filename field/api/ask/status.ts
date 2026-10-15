import { keyFromProcess } from "../../server/handle-ask";

type AskRequest = { method?: string };
type AskResponse = {
  status: (code: number) => AskResponse;
  json: (body: unknown) => void;
};

export default function handler(req: AskRequest, res: AskResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }
  res.status(200).json({ configured: Boolean(keyFromProcess().key) });
}
