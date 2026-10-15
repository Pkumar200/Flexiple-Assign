# Field

A working prototype for the Flexiple product assignment: a sourced shortlist for where to put a GCC in India.

Field does not try to be a census of 2,117 centres. It takes a mandate — function, headcount, and what you refuse to get wrong — and ranks six cities. Every measured figure is cited. Talent, speed, room and incentives are labeled as readings. Where the file has no number, the cell stays blank, including company headcount and any pay band that is not a software-engineer median.

Ask the file sends the question to a model with the file as its only source. A reply that contains a figure the file does not hold is discarded. Put a key in `.env` as `FIELD_API_KEY` (see `.env.example`), or paste an Anthropic, Gemini, Groq, or OpenAI key into the page. A pasted key stays in the browser tab.

## Run it

```bash
cd field
npm install
npm run check
npm run dev
```

Open http://localhost:5173.

`npm run check` asserts the rankings the deck depends on: a normally weighted engineering centre lands on Hyderabad, paying for the deepest bench lands on Bengaluru, a cost-first centre of 150 lands on Chennai and flips at 400 people, BFSI drops pay out of the math, and a question about Goldman Sachs’ India headcount is refused.

The deck is `Field.pptx`, one folder up from this project.

## What a reviewer should click

1. Leave the first preset on. Read the sentence under the city name, then open Bengaluru and look at the talent reading against the fit.
2. Switch to “Engineering, cost first”, then change headcount from 150 to 400. The winner should flip, and the note should say why.
3. Open “BFSI operations”. Pay is weighted, then excluded. The blank is the product.
4. Open “Ask the file” and run the Goldman Sachs question, then the Karnataka incentive question.

The board-note button copies a plain-text shortlist.

## What is measured, and what is a reading

Measured, and cited in the interface: Nasscom–Zinnov FY2026 counts, the FY2024 restatement, Flexiple’s August 2026 software medians, CREDAI’s 2025 city rents, vacancy and GCC leasing, Zinnov’s city talent shares, Karnataka’s GCC policy as notified.

A reading, shown as one: cluster depth by function, setup density, the hiring fight, the incentive score, Mumbai’s 12-point floor adjustment. The method sits on the mandate page.
