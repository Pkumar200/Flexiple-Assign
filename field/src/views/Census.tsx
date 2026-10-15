import { COMPANIES, NEW_ENTRANTS } from "../data";

const ROWS: { object: string; figure: string; asOf: string; source: string; not: string }[] = [
  {
    object: "GCC organisations",
    figure: "2,117",
    asOf: "March 2026",
    source: "Nasscom–Zinnov landscape, released 2 July 2026",
    not: "Not a count of offices",
  },
  {
    object: "Units, meaning sites",
    figure: "3,728",
    asOf: "March 2026",
    source: "Same report",
    not: "Not a second census of companies",
  },
  {
    object: "Revenue booked by those GCCs",
    figure: "$98.4 bn",
    asOf: "FY2026",
    source: "Same report",
    not: "Not a market-size estimate from a research house",
  },
  {
    object: "People employed",
    figure: "2.36 mn",
    asOf: "FY2026",
    source: "Same report",
    not: "Not a talent-pool figure for one city",
  },
  {
    object: "FY2024 organisations, as first published",
    figure: "1,700+",
    asOf: "FY2024 report",
    source: "Nasscom–Zinnov, 2024",
    not: "The same authors later moved this number",
  },
  {
    object: "FY2024 organisations, restated",
    figure: "1,855",
    asOf: "Told in 2026",
    source: "Times of India, reporting the FY2026 release",
    not: "Last year’s truth, revised",
  },
  {
    object: "A commercial market-size estimate",
    figure: "$69.85 bn",
    asOf: "2025",
    source: "Grand View Research",
    not: "Not the $98.4 bn. Different object, often put in the same sentence",
  },
  {
    object: "Companies a public directory has verified",
    figure: "536",
    asOf: "August 2026",
    source: "Flexiple GCC directory",
    not: "Not 2,117, and not trying to be",
  },
];

export function Census() {
  return (
    <div className="sheet">
      <header className="lede">
        <p className="kicker">The count</p>
        <h1>The argument is about the noun.</h1>
        <p className="dek">
          India does not have one number of GCCs. It has several true numbers attached to different objects, plus at least one that was revised after it had already been quoted. A new entrant cannot tell which sentence they are in. They pick a city anyway.
        </p>
      </header>

      <div className="census">
        {ROWS.map((row) => (
          <article key={row.object}>
            <p className="figure">{row.figure}</p>
            <h2>{row.object}</h2>
            <p>{row.not}</p>
            <p className="src">
              {row.source} · {row.asOf}
            </p>
          </article>
        ))}
      </div>

      <section className="prose">
        <h2>What the revision is worth</h2>
        <p>
          The 2024 landscape said India had over 1,700 GCCs and would reach 2,100 to 2,200 by 2030. By FY2026 the count was 2,117, and the old base had been rewritten to 1,855. The destination arrived early because the starting point moved. Anyone who built a plan on the first number was not careless. They used the source of record.
        </p>
        <p>
          Karnataka’s GCC policy targets 1,000 GCCs in the state by 2029, from a base the policy treats as about 500. Zinnov counts 1,080 units in Bengaluru alone. Both can be honest. A unit is not a company, and a company is not a state. A prospect reading the policy against the city ranking cannot tell whether the state is ahead of its target or miles from it.
        </p>
        <h2>The part that is already measured</h2>
        <p>
          Flexiple’s directory is the useful counter-example. It verifies 536 companies, publishes city medians only past a 25-record gate, and refuses city counts it cannot source. That is a list with a method. It still does not answer the question a board asks, which is where this centre should go, and what the runner-up costs.
        </p>
        <h2>Names without cities</h2>
        <p>
          The FY2026 report names newer entrants. Putting a city next to them would make this page look finished. It would also be a guess.
        </p>
        <ul className="names">
          {NEW_ENTRANTS.map((name) => (
            <li key={name}>
              {name}
              <span className="blank">City blank</span>
            </li>
          ))}
        </ul>
        <p className="fine">
          The working sample behind the mandate has {COMPANIES.length} named companies, compiled from Dun & Bradstreet and Nasscom–Zinnov city mappings. It is not the 2,117.
        </p>
      </section>
    </div>
  );
}
