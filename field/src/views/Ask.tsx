import { FormEvent, useEffect, useState } from "react";
import { ask, type Answer } from "../ask";

const PROMPTS = [
  "How many GCCs are in India?",
  "Compare Bengaluru and Hyderabad",
  "Best city for a BFSI centre",
  "What incentives does Karnataka actually pay in Bengaluru?",
  "How many people does Goldman Sachs employ in India?",
  "Should the first centre be in Coimbatore?",
];

const KEY_STORAGE = "field-model-key";

interface ModelAnswer extends Answer {
  model?: string;
}

export function Ask() {
  const [query, setQuery] = useState(PROMPTS[4]);
  const [result, setResult] = useState<ModelAnswer | null>(null);
  const [pending, setPending] = useState(false);
  const [key, setKey] = useState("");
  const [serverHasKey, setServerHasKey] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORAGE) ?? "";
    setKey(saved);
    if (!saved) setResult(ask(PROMPTS[4]));
    fetch("/api/ask/status")
      .then(async (response) => {
        if (!response.ok) throw new Error("status");
        return (await response.json()) as { configured?: boolean };
      })
      .then((status) => {
        const configured = Boolean(status.configured);
        setServerHasKey(configured);
        if (configured || saved) void run(PROMPTS[4], saved, configured);
      })
      .catch(() => setResult(ask(PROMPTS[4])));
  }, []);

  async function run(text: string, apiKey = key, configured = serverHasKey) {
    setQuery(text);
    const trimmed = apiKey.trim();
    if (!configured && !trimmed) {
      setResult(ask(text));
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, apiKey: trimmed || undefined }),
      });
      const payload = (await response.json()) as ModelAnswer & { error?: string; needsKey?: boolean };
      if (!response.ok || payload.needsKey) {
        setResult(ask(text));
        return;
      }
      setResult(payload);
    } catch {
      setResult(ask(text));
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void run(query);
  }

  return (
    <div className="sheet">
      <header className="lede">
        <p className="kicker">Ask the file</p>
        <h1>The file answers. A model may only write from it.</h1>
        <p className="dek">
          With no model key, the file answers directly. Headcount stays blank. If a key is configured later, a model may write the reply, and a figure the file does not hold is thrown away.
        </p>
      </header>

      <form className="ask" onSubmit={onSubmit}>
        <label htmlFor="q">Question</label>
        <div className="ask-row">
          <input
            id="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about a city, a count, a policy, a company"
          />
          <button type="submit" className="solid" disabled={pending}>
            {pending ? "Asking" : "Ask"}
          </button>
        </div>
        <div className="prompts">
          {PROMPTS.map((prompt) => (
            <button key={prompt} type="button" className="chip" onClick={() => void run(prompt)} disabled={pending}>
              {prompt}
            </button>
          ))}
        </div>
      </form>

      {result && (
        <article className={result.refused ? "reply refused" : "reply"} aria-live="polite">
          <p className="kicker">{result.refused ? "Declined" : result.model ? "Written by the model" : "From the file"}</p>
          <h2>{result.title}</h2>
          {result.paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph}`}>{paragraph}</p>
          ))}
          {result.citations.length > 0 && (
            <ol className="cites">
              {result.citations.map((citation) => (
                <li key={citation}>{citation}</li>
              ))}
            </ol>
          )}
          {result.model ? (
            <p className="fine">Model: {result.model}. Checked against the file before it was shown.</p>
          ) : (
            <p className="fine">Answered from the file. No model key is configured.</p>
          )}
        </article>
      )}
    </div>
  );
}
