import { useMemo, useState } from "react";
import {
  FUNCTIONS,
  Headcount,
  PRESETS,
  WEIGHT_META,
  Weights,
  fnMeta,
} from "../data";
import { NATIONAL_NOTE, Ranked, buildResult, methodText } from "../engine";

const HEADCOUNTS: { value: Headcount; label: string }[] = [
  { value: 80, label: "Pilot · 80" },
  { value: 150, label: "First centre · 150" },
  { value: 400, label: "Scale · 400" },
];

export function Mandate({ onOpenCensus }: { onOpenCensus: () => void }) {
  const initial = PRESETS[0].mandate;
  const [functionId, setFunctionId] = useState(initial.functionId);
  const [headcount, setHeadcount] = useState<Headcount>(initial.headcount);
  const [weights, setWeights] = useState<Weights>(initial.weights);
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [open, setOpen] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => buildResult({ functionId, headcount, weights }),
    [functionId, headcount, weights],
  );
  const fn = fnMeta(functionId);
  const shown = open ?? result.ranked[0].city.id;

  function applyPreset(id: string) {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setPresetId(id);
    setFunctionId(preset.mandate.functionId);
    setHeadcount(preset.mandate.headcount);
    setWeights(preset.mandate.weights);
    setOpen(null);
  }

  function setWeight(key: keyof Weights, value: number) {
    setPresetId("custom");
    setWeights((current) => ({ ...current, [key]: value }));
  }

  async function copyBoard() {
    await navigator.clipboard.writeText(result.board);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="sheet">
      <header className="lede">
        <p className="kicker">
          The count is not the job.{" "}
          <button type="button" className="text-link" onClick={onOpenCensus}>
            Read why the numbers disagree
          </button>
        </p>
        <h1>{result.headline}</h1>
        <p className="dek">{result.dek}</p>
        <div className="lede-actions">
          <button type="button" className="solid" onClick={copyBoard}>
            {copied ? "Copied" : "Copy the board note"}
          </button>
          <p>A paragraph for the appendix. Every line is from this page.</p>
        </div>
      </header>

      <section className="controls">
        <div className="presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={presetId === preset.id ? "chip on" : "chip"}
              onClick={() => applyPreset(preset.id)}
            >
              {preset.label}
            </button>
          ))}
          {presetId === "custom" && <span className="chip ghost">Custom weights</span>}
        </div>

        <div className="control-grid">
          <label>
            Function
            <select
              value={functionId}
              onChange={(event) => {
                setPresetId("custom");
                setFunctionId(event.target.value as typeof functionId);
              }}
            >
              {FUNCTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="label">Headcount</span>
            <div className="segment">
              {HEADCOUNTS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={headcount === item.value ? "on" : ""}
                  onClick={() => {
                    setPresetId("custom");
                    setHeadcount(item.value);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="weights">
          {WEIGHT_META.map((item) => (
            <label key={item.key} className="weight">
              <span>
                {item.label}
                <strong>{weights[item.key]}</strong>
              </span>
              <small>{item.hint}</small>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={weights[item.key]}
                onChange={(event) => setWeight(item.key, Number(event.target.value))}
                aria-label={item.label}
              />
            </label>
          ))}
        </div>
        <p className="fine">
          {fn.payNote} Rent is scaled at 100 sq ft a person so the pay gap and the rent gap can sit in one sentence. It is not a space plan.
          {result.costDropped ? " Pay is weighted above, and excluded from the math." : ""}
        </p>
      </section>

      <ol className="ranks">
        {result.ranked.map((row, index) => (
          <RankRow
            key={row.city.id}
            row={row}
            index={index}
            open={shown === row.city.id}
            payMode={fn.pay}
            onToggle={() => setOpen(shown === row.city.id ? "" : row.city.id)}
          />
        ))}
      </ol>

      <p className="national">{NATIONAL_NOTE}</p>

      <details className="method">
        <summary>How a fit number is allowed to work</summary>
        <p>{methodText()}</p>
      </details>
    </div>
  );
}

function RankRow({
  row,
  index,
  open,
  payMode,
  onToggle,
}: {
  row: Ranked;
  index: number;
  open: boolean;
  payMode: "measured" | "proxy" | "none";
  onToggle: () => void;
}) {
  const city = row.city;
  return (
    <li className={open ? "rank open" : "rank"}>
      <button type="button" className="rank-hit" onClick={onToggle} aria-expanded={open}>
        <span className="ord">{String(index + 1).padStart(2, "0")}</span>
        <span className="city-name">
          {city.name}
          <small>{city.state}</small>
        </span>
        <span className="fit">
          <strong>{row.fit}</strong>
          <small>fit{row.penalty ? ` · −${row.penalty}` : ""}</small>
        </span>
      </button>
      {open && (
        <div className="rank-body">
          <p className="watch">{city.watch}</p>
          <dl className="facts">
            <div>
              <dt>Talent reading</dt>
              <dd>{row.talent}</dd>
            </div>
            <div>
              <dt>{payMode === "none" ? "Pay" : payMode === "proxy" ? "Pay, as proxy" : "Software median"}</dt>
              <dd>{payMode === "none" ? <span className="blank">Blank</span> : `₹${city.engineerMedian}L`}</dd>
            </div>
            <div>
              <dt>Senior median</dt>
              <dd>{payMode === "none" ? <span className="blank">Blank</span> : `₹${city.seniorMedian}L`}</dd>
            </div>
            <div>
              <dt>Rent, 2025 avg</dt>
              <dd>₹{city.rent}/sf</dd>
            </div>
            <div>
              <dt>Vacancy</dt>
              <dd>{city.vacancy}%</dd>
            </div>
            <div>
              <dt>Share of GCC talent</dt>
              <dd>{city.talentShare}%</dd>
            </div>
            <div>
              <dt>GCC leasing, 2025</dt>
              <dd>{city.leasingShare === null ? <span className="blank">Not broken out</span> : `${city.leasingShare}% · ${city.leasingMsf} msf`}</dd>
            </div>
          </dl>
          {city.seniorMedianNote && payMode !== "none" && <p className="fine">{city.seniorMedianNote}</p>}
          <p className="incentive">{city.incentiveNote}</p>
          <p className="fine">{row.spaceNote}</p>
          <div className="peers">
            <span>Named peers in the sample</span>
            {row.peers.length === 0 ? (
              <p className="fine">None for this function. The sample is a few dozen names, not the census.</p>
            ) : (
              <ul>
                {row.peers.slice(0, 6).map((peer) => (
                  <li key={peer.name}>
                    <strong>{peer.name}</strong>
                    <span>{peer.line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="parts">
            {row.parts.map((part) => (
              <div key={part.key} className="part">
                <div className="part-top">
                  <span>
                    {part.label} · weight {part.weight}
                  </span>
                  <span>{part.value}</span>
                </div>
                <div className="track">
                  <div style={{ width: `${part.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
