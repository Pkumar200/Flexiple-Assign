# Flexiple-Assign

A working prototype for the Flexiple product assignment: a sourced shortlist for where to put a GCC in India.

Field does not try to be a census of 2,117 centres. It takes a mandate — function, headcount, and what you refuse to get wrong — and ranks six cities. Every measured figure is cited. Talent, speed, room and incentives are labeled as readings. Where the file has no number, the cell stays blank, including company headcount and any pay band that is not a software-engineer median.

Ask the file answers from the file when no model key is configured. Company headcount stays blank. A key is optional. If `.env` sets `FIELD_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, or `OPENAI_API_KEY` (see `field/.env.example`), a model may write the reply, and a figure the file does not hold is discarded. The review demo does not need a key.

## Run it

```bash
cd field
npm install
npm run check
npm run dev
```

Open http://localhost:5173.

`npm run check` asserts the rankings the deck depends on: a normally weighted engineering centre lands on Hyderabad, paying for the deepest bench lands on Bengaluru, a cost-first centre of 150 lands on Chennai and flips at 400 people, BFSI drops pay out of the math, and a question about Goldman Sachs’ India headcount is refused.

The deployed prototype is https://field-virid.vercel.app/. The deck submitted with it is `Field.pptx`.

## What a reviewer should click

1. Leave the first preset on. Read the sentence under the city name, then open Bengaluru and look at the talent reading against the fit.
2. Switch to “Engineering, cost first”, then change headcount from 150 to 400. The winner should flip, and the note should say why.
3. Open “BFSI operations”. Pay is weighted, then excluded. The blank is the product.
4. Open “Ask the file” and run the Goldman Sachs question, then the Karnataka incentive question.

The board-note button copies a plain-text shortlist.

## What is measured, and what is a reading

Measured, and cited in the interface: Nasscom–Zinnov FY2026 counts, the FY2024 restatement, Flexiple’s August 2026 software medians, CREDAI’s 2025 city rents, vacancy and GCC leasing, Zinnov’s city talent shares, Karnataka’s GCC policy as notified.

A reading, shown as one: cluster depth by function, setup density, the hiring fight, the incentive score, Mumbai’s 12-point floor adjustment. The method sits on the mandate page.
