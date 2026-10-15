import { FormEvent, useEffect, useState } from "react";
import type { Answer } from "../ask";

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
  const [error, setError] = useState("");
  const [needsKey, setNeedsKey] = useState(false);
  const [key, setKey] = useState("");
  const [serverHasKey, setServerHasKey] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(KEY_STORAGE) ?? "";
    setKey(saved);
    fetch("/api/ask/status")
      .then((response) => response.json())
      .then((status: { configured?: boolean }) => {
        const configured = Boolean(status.configured);
        setServerHasKey(configured);
        if (configured || saved) {
          void run(PROMPTS[4], saved, configured);
        } else {
          setNeedsKey(true);
        }
      })
      .catch(() => setNeedsKey(true));
  }, []);

  async function run(text: string, apiKey = key, configured = serverHasKey) {
    setQuery(text);
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, apiKey: apiKey.trim() || undefined }),
      });
      const payload = (await response.json()) as ModelAnswer & { error?: string; needsKey?: boolean };
      if (payload.needsKey || (!configured && !apiKey.trim() && response.status === 503)) {
        setNeedsKey(true);
        setResult(null);
        return;
      }
      if (!response.ok) {
        setError(payload.error || "The model request failed.");
        return;
      }
      setNeedsKey(false);
      setResult(payload);
    } catch {
      setError("The model could not be reached.");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void run(query);
  }

  function saveKey(event: FormEvent) {
    event.preventDefault();
    sessionStorage.setItem(KEY_STORAGE, key.trim());
    void run(query, key.trim(), serverHasKey);
  }

  return (
    <div className="sheet">
      <header className="lede">
        <p className="kicker">Ask the file</p>
        <h1>A model writes the reply. The file sets the limit.</h1>
        <p className="dek">
          The model answers in its own words. It is only allowed to use this file. If you ask for a number the file does not have, the reply is thrown away or declined.
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

      {needsKey && (
        <form className="keybox" onSubmit={saveKey}>
          <p>Paste a model key to turn this on. Anthropic starts with sk-ant-, Gemini with AQ. or AIza, Groq with gsk_, OpenAI with sk-. It stays in this browser tab.</p>
          <div className="ask-row">
            <input
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="Paste the key"
              aria-label="Model key"
              autoComplete="off"
            />
            <button type="submit" className="solid" disabled={pending || key.trim().length < 10}>
              Use key
            </button>
          </div>
        </form>
      )}

      {error && <p className="key-error">{error}</p>}

      {result && (
        <article className={result.refused ? "reply refused" : "reply"} aria-live="polite">
          <p className="kicker">{result.refused ? "Declined" : "Written by the model"}</p>
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
          {result.model && <p className="fine">Model: {result.model}. Checked against the file before it was shown.</p>}
        </article>
      )}
    </div>
  );
}
