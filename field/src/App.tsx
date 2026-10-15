import { useEffect, useState } from "react";
import { Ask } from "./views/Ask";
import { Census } from "./views/Census";
import { Mandate } from "./views/Mandate";

export type View = "mandate" | "census" | "ask";

const NAV: { id: View; label: string; note: string }[] = [
  { id: "mandate", label: "Mandate", note: "A city for this centre" },
  { id: "census", label: "The count", note: "Why the numbers disagree" },
  { id: "ask", label: "Ask the file", note: "Answers, or a blank" },
];

function readView(): View {
  const value = window.location.hash.replace("#", "");
  if (value === "census" || value === "ask" || value === "mandate") return value;
  return "mandate";
}

export function App() {
  const [view, setView] = useState<View>(readView);

  useEffect(() => {
    const onHash = () => setView(readView());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <div className="app">
      <aside className="rail">
        <div className="brand">
          <Mark />
          <div>
            <p className="word">Field</p>
            <p className="tag">A sourced shortlist for an India GCC</p>
          </div>
        </div>
        <nav>
          {NAV.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "nav on" : "nav"}
              onClick={() => {
                setView(item.id);
                window.history.replaceState(null, "", `#${item.id}`);
              }}
              type="button"
            >
              <span>{item.label}</span>
              <small>{item.note}</small>
            </button>
          ))}
        </nav>
        <p className="rail-foot">
          Prototype. Figures are cited. Readings are labeled. Where the file has no number, the cell stays blank.
        </p>
      </aside>
      <main>
        {view === "mandate" && <Mandate onOpenCensus={() => setView("census")} />}
        {view === "census" && <Census />}
        {view === "ask" && <Ask />}
      </main>
    </div>
  );
}

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16 3.5v6.2M16 22.3V28.5M3.5 16h6.2M22.3 16H28.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
