const PptxGenJS = require("pptxgenjs");

const pres = new PptxGenJS();
pres.defineLayout({ name: "FIELD", width: 13.333, height: 7.5 });
pres.layout = "FIELD";
pres.author = "Field";
pres.title = "Field — the working file for an India GCC decision";
pres.subject = "Product assignment for Flexiple";

const INK = "1C1915";
const PAPER = "F7F6F2";
const WHITE = "FFFFFF";
const RUST = "C4491D";
const MUTED = "5F594F";
const GREEN = "1C5C44";
const DIM = "8A8378";
const SOFT = "EFEDE7";

function mark(slide, x, y, color) {
  slide.addShape(pres.shapes.OVAL, {
    x: x + 0.09,
    y: y + 0.09,
    w: 0.18,
    h: 0.18,
    fill: { color: PAPER, transparency: 100 },
    line: { color, width: 1.25 },
  });
  slide.addShape(pres.shapes.LINE, {
    x,
    y: y + 0.17,
    w: 0.36,
    h: 0,
    line: { color, width: 1.25 },
  });
  slide.addShape(pres.shapes.LINE, {
    x: x + 0.18,
    y,
    w: 0,
    h: 0.36,
    line: { color, width: 1.25 },
  });
}

function foot(slide, n, dark) {
  const color = dark ? "8A8378" : DIM;
  slide.addText("Field   ·   Product assignment", {
    x: 0.55,
    y: 7.08,
    w: 8,
    h: 0.24,
    fontFace: "Calibri",
    fontSize: 12,
    color,
    margin: 0,
    isTextBox: true,
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 11.4,
    y: 7.08,
    w: 1.35,
    h: 0.24,
    fontFace: "Calibri",
    fontSize: 12,
    color,
    align: "right",
    margin: 0,
    isTextBox: true,
  });
}

function heading(slide, text) {
  mark(slide, 0.55, 0.36, RUST);
  slide.addText(text, {
    x: 1.08,
    y: 0.32,
    w: 11.6,
    h: 0.58,
    fontFace: "Cambria",
    fontSize: 30,
    color: INK,
    margin: 0,
    isTextBox: true,
  });
}

function card(slide, x, y, w, h) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w,
    h,
    fill: { color: WHITE },
    line: { color: WHITE, width: 0 },
    rectRadius: 0.08,
  });
}

// ---------------------------------------------------------------------------
// 1. Title
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: INK };
  mark(s, 0.6, 0.48, "E7B5A2");
  s.addText("FIELD", {
    x: 1.12,
    y: 0.52,
    w: 3,
    h: 0.28,
    fontFace: "Calibri",
    fontSize: 14,
    bold: true,
    color: "E7B5A2",
    charSpacing: 1.5,
    margin: 0,
    isTextBox: true,
  });
  s.addText("The working file\nfor an India GCC\ndecision.", {
    x: 0.6,
    y: 1.9,
    w: 11.5,
    h: 2.7,
    fontFace: "Cambria",
    fontSize: 48,
    color: "F7F6F2",
    margin: 0,
    isTextBox: true,
  });
  s.addText(
    "A new entrant needs a city they can sign. Every input cited. The gaps left blank.",
    {
      x: 0.6,
      y: 5.0,
      w: 10.2,
      h: 0.7,
      fontFace: "Calibri",
      fontSize: 20,
      color: "D9D3C9",
      margin: 0,
      isTextBox: true,
    },
  );
  s.addText("Product assignment   ·   Flexiple   ·   October 2026", {
    x: 0.6,
    y: 6.55,
    w: 8,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 14,
    color: "8A8378",
    margin: 0,
    isTextBox: true,
  });
  s.addNotes(
    "Open with the job, not the market size. The rest of the deck earns a city recommendation. The census is the evidence of the problem, not the product. Prototype name is Field: a sourced shortlist for one mandate.",
  );
}

// ---------------------------------------------------------------------------
// 2. The noun
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "The fight is about the noun.");
  s.addText(
    "India has several true numbers for its GCCs. They describe different objects. One of them was revised after the market had already quoted it.",
    {
      x: 0.55,
      y: 1.15,
      w: 12.1,
      h: 0.58,
      fontFace: "Calibri",
      fontSize: 16,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    },
  );

  const cols = [
    ["2,117", "Organisations", "Nasscom–Zinnov, March 2026. A GCC: the parent’s India centre as a company. Revenue $98.4bn. People 2.36 million."],
    ["3,728", "Sites", "The same report. Units, not a second census. About 1.8 sites for every organisation. This is why city lists outrun company lists."],
    ["536", "Verified companies", "Flexiple’s directory, August 2026. A list with a method and a publish gate. It is a measured set, and it says so."],
  ];
  cols.forEach((col, i) => {
    const x = 0.55 + i * 4.2;
    s.addText(col[0], {
      x,
      y: 1.95,
      w: 3.9,
      h: 0.72,
      fontFace: "Cambria",
      fontSize: 40,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
    s.addText(col[1], {
      x,
      y: 2.7,
      w: 3.9,
      h: 0.36,
      fontFace: "Calibri",
      fontSize: 18,
      bold: true,
      color: RUST,
      margin: 0,
      isTextBox: true,
    });
    s.addText(col[2], {
      x,
      y: 3.15,
      w: 3.85,
      h: 1.35,
      fontFace: "Calibri",
      fontSize: 15,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    });
  });

  card(s, 0.55, 4.7, 12.2, 2.05);
  s.addText("The revision, and the collisions", {
    x: 0.8,
    y: 4.88,
    w: 11.6,
    h: 0.32,
    fontFace: "Calibri",
    fontSize: 14,
    bold: true,
    color: GREEN,
    margin: 0,
    isTextBox: true,
  });
  s.addText(
    "The 2024 landscape said “over 1,700” and pointed to 2,100–2,200 centres by 2030. The 2026 release counted 2,117 and restated FY2024 to 1,855. Grand View’s $69.85bn for 2025 is a market-size estimate, a different object from $98.4bn of GCC revenue. Karnataka’s policy targets 1,000 GCCs in the state. Zinnov counts 1,080 units in Bengaluru alone. A prospect cannot tell which sentence they are in.",
    {
      x: 0.8,
      y: 5.25,
      w: 11.7,
      h: 1.3,
      fontFace: "Calibri",
      fontSize: 15,
      color: INK,
      margin: 0,
      isTextBox: true,
    },
  );
  foot(s, 2);
  s.addNotes(
    "Sources: Nasscom–Zinnov GCC Landscape FY2026, released 2 July 2026; Times of India on the FY2024 restatement to 1,855; the FY2024 landscape’s 1,700+ and 2030 range; Grand View Research market size; Flexiple GCC directory, August 2026; Karnataka GCC Policy 2024–29; Zinnov on Bengaluru’s 1,080 of 3,728 units. Do not merge these in the room. The point is that a careful person currently has no single sentence.",
  );
}

// ---------------------------------------------------------------------------
// 3. Who is hurt
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "The blank page is the expensive one.");
  s.addText("Everyone in the chain sells a piece of the setup.", {
    x: 0.55,
    y: 1.15,
    w: 5.6,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 16,
    bold: true,
    color: INK,
    margin: 0,
    isTextBox: true,
  });

  const chain = [
    ["Advisor", "Location, and often the census"],
    ["Lawyer", "The entity, and the filing"],
    ["Auditor", "Transfer pricing, after the city"],
    ["Landlord", "A floor, sold as the decision"],
    ["Recruiter", "The first fifty names"],
    ["EOR and payroll", "A bridge, sold as a timeline"],
    ["State", "A roadshow, written to win"],
  ];
  chain.forEach((row, i) => {
    const y = 1.68 + i * 0.7;
    s.addText(row[0], {
      x: 0.55,
      y,
      w: 2.15,
      h: 0.36,
      fontFace: "Calibri",
      fontSize: 15,
      bold: true,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
    s.addText(row[1], {
      x: 2.8,
      y,
      w: 3.3,
      h: 0.36,
      fontFace: "Calibri",
      fontSize: 15,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    });
  });

  card(s, 6.45, 1.15, 6.3, 5.5);
  s.addText("WHO IS HURT FIRST", {
    x: 6.75,
    y: 1.4,
    w: 5.7,
    h: 0.28,
    fontFace: "Calibri",
    fontSize: 12,
    bold: true,
    color: RUST,
    charSpacing: 1.2,
    margin: 0,
    isTextBox: true,
  });
  s.addText("The operator who has a quarter to name a city.", {
    x: 6.75,
    y: 1.8,
    w: 5.7,
    h: 1.15,
    fontFace: "Cambria",
    fontSize: 26,
    color: INK,
    margin: 0,
    isTextBox: true,
  });
  s.addText(
    "They sit inside a foreign company with no GCC yet. Nasscom’s runway work counts 1,199 large companies still outside India. A different cut of the landscape counts 506 of the Forbes Global 2000 already here. Keep them apart.",
    {
      x: 6.75,
      y: 3.15,
      w: 5.7,
      h: 1.35,
      fontFace: "Calibri",
      fontSize: 15,
      color: INK,
      margin: 0,
      isTextBox: true,
    },
  );
  s.addText(
    "Also hurt, and not the first customer: the vendor who delivers and loses to a louder one; the state whose PDF cannot sit next to a rival’s; the GCC head benchmarking pay on a survey that is not about GCCs.",
    {
      x: 6.75,
      y: 4.65,
      w: 5.7,
      h: 1.5,
      fontFace: "Calibri",
      fontSize: 15,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    },
  );
  foot(s, 3);
  s.addNotes(
    "First user is a principal, not an intermediary. Advisors are distribution once a client arrives with a printout. Designing for the advisor first means designing for the incumbent, who is paid to be the source of truth. 1,199 is Nasscom’s GCC Runway Monitor (“Global Titans”). 506 is the landscape report’s Forbes Global 2000 figure. Different nouns.",
  );
}

// ---------------------------------------------------------------------------
// 4. How much
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "The brochures lead with the smaller number.");

  s.addText("₹12.15 crore", {
    x: 0.55,
    y: 1.45,
    w: 7.2,
    h: 0.85,
    fontFace: "Cambria",
    fontSize: 48,
    color: INK,
    margin: 0,
    isTextBox: true,
  });
  s.addText("Median base pay, per year, for 150 software engineers.", {
    x: 0.55,
    y: 2.35,
    w: 7.2,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 18,
    bold: true,
    color: INK,
    margin: 0,
    isTextBox: true,
  });
  s.addText(
    "Bengaluru ₹15.7 lakh. Chennai ₹7.6 lakh. Flexiple, August 2026, past a 25-record publish gate. This is a median, not CTC, and not an offer.",
    {
      x: 0.55,
      y: 2.85,
      w: 6.6,
      h: 0.95,
      fontFace: "Calibri",
      fontSize: 15,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    },
  );

  s.addText("₹41 lakh", {
    x: 0.55,
    y: 4.05,
    w: 7,
    h: 0.6,
    fontFace: "Cambria",
    fontSize: 32,
    color: MUTED,
    margin: 0,
    isTextBox: true,
  });
  s.addText("The rent gap for the same 150 people, same year.", {
    x: 0.55,
    y: 4.7,
    w: 7,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 16,
    color: INK,
    margin: 0,
    isTextBox: true,
  });
  s.addText("Assumed 100 sq ft a person. City averages ₹102 and ₹79 a sq ft a month. CREDAI, calendar 2025.", {
    x: 0.55,
    y: 5.1,
    w: 6.6,
    h: 0.6,
    fontFace: "Calibri",
    fontSize: 15,
    color: MUTED,
    margin: 0,
    isTextBox: true,
  });

  card(s, 8.15, 1.5, 4.55, 5.15);
  s.addText("ABOUT\nTHIRTY\nTIMES", {
    x: 8.45,
    y: 1.85,
    w: 4.05,
    h: 2.15,
    fontFace: "Cambria",
    fontSize: 36,
    color: RUST,
    margin: 0,
    isTextBox: true,
  });
  s.addText(
    "Chennai is not the recommendation. Vacancy there is 8.8%, the tightest of the top seven. The senior median is ₹19.1 lakh against ₹32.5 lakh. The point is the size of the decision, and which half of it the market is selling.",
    {
      x: 8.45,
      y: 4.2,
      w: 3.95,
      h: 2.1,
      fontFace: "Calibri",
      fontSize: 15,
      color: INK,
      margin: 0,
      isTextBox: true,
    },
  );
  foot(s, 4);
  s.addNotes(
    "Math: (15.7 − 7.6) × 150 = ₹12.15 crore of median base. Rent: 150 × 100 sq ft × (₹102 − ₹79) × 12 = ₹41.4 lakh. Ratio about 29×. Against Hyderabad the pay gap is ₹7.95 crore and the rent gap ₹58 lakh, about 14×. Same conclusion, less theatrical number. Senior medians and Chennai vacancy are Flexiple August 2026 and CREDAI 2025. Use this slide to reframe the conversation away from landlords and entity vendors, who lead with the line item they sell.",
  );
}

// ---------------------------------------------------------------------------
// 5. Today
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "Four ways a city gets chosen.");
  const items = [
    ["The annual landscape", "True at the headline. It restates its own history. It is not a mandate, and it arrives once a year."],
    ["The setup advisor", "Deep. Often the same firm that keeps the census. Worth it once a shortlist exists. Slow and scoped as a project until then."],
    ["A referral", "Fast. A board cannot audit it. It points at whoever picked up the phone."],
    ["The guide and the roadshow", "Law-firm essays and state decks, each written to win. Useful as a primary source. Useless as a comparison."],
  ];
  items.forEach((item, i) => {
    const x = 0.55 + (i % 2) * 6.35;
    const y = 1.4 + Math.floor(i / 2) * 2.35;
    card(s, x, y, 6.1, 2.15);
    s.addText(item[0], {
      x: x + 0.28,
      y: y + 0.28,
      w: 5.55,
      h: 0.4,
      fontFace: "Cambria",
      fontSize: 22,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
    s.addText(item[1], {
      x: x + 0.28,
      y: y + 0.85,
      w: 5.55,
      h: 1.05,
      fontFace: "Calibri",
      fontSize: 15,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    });
  });
  foot(s, 5);
  s.addNotes(
    "ANSR’s own GCC page is the cleanest illustration, if asked: one FAQ says a setup generally takes 6–8 months, another passage says 4–6 weeks with their team, and the product copy says 60–90 days. Zinnov says 3–6 months for a focused setup, 6–12 for a larger one, and also “as quickly as 90 days.” Those are different products — captive, BOT, EOR bridge — quoted as if they were one clock. I kept this off the slide so the four paths stay clean. It belongs in the Q&A.",
  );
}

// ---------------------------------------------------------------------------
// 6. Opportunities
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "Six openings. One of them is the company.");
  const rows = [
    ["01", "Mandate shortlist", "A deadline, a crore-scale annual gap, and public figures that can support an honest first version.", "BUILD"],
    ["02", "Provenance on the census", "Show the conflicting counts side by side. Averaging them into a truer number recreates the problem.", "INTO THE FILE"],
    ["03", "Incentive cliffs", "Only where a notification has been read. Bengaluru does not inherit a subsidy that applies in Mysuru.", "INTO THE FILE"],
    ["04", "Who is coming next", "The FY26 report names new entrants. Cities for that list are blank in the prototype, on purpose.", "LATER"],
    ["05", "Role-level pay", "Engineering pay is already measured, behind a publish gate. Use it. A new compensation house is a different company.", "INPUT"],
    ["06", "Vendor marketplace", "A cold start, and the product a talent marketplace is already tempted to build because it knows how.", "NOT THIS YEAR"],
  ];
  rows.forEach((row, i) => {
    const y = 1.22 + i * 0.92;
    s.addText(row[0], {
      x: 0.55,
      y,
      w: 0.6,
      h: 0.32,
      fontFace: "Cambria",
      fontSize: 16,
      italic: true,
      color: RUST,
      margin: 0,
      isTextBox: true,
    });
    s.addText(row[1], {
      x: 1.25,
      y,
      w: 7.4,
      h: 0.32,
      fontFace: "Calibri",
      fontSize: 16,
      bold: true,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
    s.addText(row[3], {
      x: 9.15,
      y,
      w: 3.6,
      h: 0.32,
      fontFace: "Calibri",
      fontSize: 12,
      bold: true,
      color: RUST,
      align: "right",
      margin: 0,
      isTextBox: true,
    });
    s.addText(row[2], {
      x: 1.25,
      y: y + 0.34,
      w: 11.3,
      h: 0.4,
      fontFace: "Calibri",
      fontSize: 14,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    });
  });
  foot(s, 6);
  s.addNotes(
    "Ranking logic: pain with a deadline, willingness to pay, whether public data can support a version that is honest, and whether it compounds. The marketplace fails the last two. Pay fails the third as a standalone company and passes as an input Flexiple already has. Signals (who is next) are valuable to vendors and states, who are not the first user. Build the shortlist, and let provenance and the cliffs be the reason anyone believes it.",
  );
}

// ---------------------------------------------------------------------------
// 7. The job
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "The job is one sentence in a board paper.");
  s.addText("Where should this centre go, for this work and this headcount, and what does the runner-up cost?", {
    x: 0.55,
    y: 1.25,
    w: 12.2,
    h: 1.25,
    fontFace: "Cambria",
    fontSize: 28,
    italic: true,
    color: INK,
    margin: 0,
    isTextBox: true,
  });

  card(s, 0.55, 2.8, 6.05, 3.85);
  card(s, 6.8, 2.8, 5.95, 3.85);
  s.addText("Build for them first", {
    x: 0.85,
    y: 3.05,
    w: 5.5,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 14,
    bold: true,
    color: RUST,
    margin: 0,
    isTextBox: true,
  });
  s.addText("The India lead, the chief of staff, the VP of global operations. No GCC yet. A quarter on the clock. They will circulate a shortlist long before they commission a study, and they will hold the shortlist next to the study when it arrives.", {
    x: 0.85,
    y: 3.55,
    w: 5.45,
    h: 2.7,
    fontFace: "Calibri",
    fontSize: 16,
    color: INK,
    margin: 0,
    isTextBox: true,
  });
  s.addText("They come after", {
    x: 7.1,
    y: 3.05,
    w: 5.4,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 14,
    bold: true,
    color: GREEN,
    margin: 0,
    isTextBox: true,
  });
  s.addText("Advisors, once a client shows up with the note. States, once the comparison is what prospects already trust. Vendors, once a delivery can be named. A second-city GCC head is the same job with more context, and the second release.", {
    x: 7.1,
    y: 3.55,
    w: 5.35,
    h: 2.7,
    fontFace: "Calibri",
    fontSize: 16,
    color: INK,
    margin: 0,
    isTextBox: true,
  });
  foot(s, 7);
  s.addNotes(
    "Why this user and not the state or the advisor: the pain has a date, the cost of a wrong city is the slide before this, and they are the only party whose incentive is the truth of the comparison rather than a win. Zinnov has set up 220+ GCCs over twenty years. Field does not try to replace that engagement. It is the page that exists before the statement of work, and the page that reads the statement of work against public figures.",
  );
}

// ---------------------------------------------------------------------------
// 8. Solution
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "Field ranks a mandate. It does not host a census.");
  const steps = [
    ["1", "State the mandate", "Function, headcount, and five weights. A weight of zero drops that reading out of the average."],
    ["2", "Return the shortlist", "Six cities, the cost of being elsewhere, and the reason the winner can still be wrong."],
    ["3", "Show the work", "Measured figures are cited. Readings are labeled. An empty cell stays empty, including company headcount."],
  ];
  steps.forEach((step, i) => {
    const y = 1.2 + i * 1.15;
    s.addText(step[0], {
      x: 0.55,
      y,
      w: 0.5,
      h: 0.45,
      fontFace: "Cambria",
      fontSize: 26,
      color: RUST,
      margin: 0,
      isTextBox: true,
    });
    s.addText(step[1], {
      x: 1.2,
      y,
      w: 11,
      h: 0.36,
      fontFace: "Calibri",
      fontSize: 18,
      bold: true,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
    s.addText(step[2], {
      x: 1.2,
      y: y + 0.38,
      w: 11.2,
      h: 0.45,
      fontFace: "Calibri",
      fontSize: 16,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    });
  });

  card(s, 0.55, 4.75, 12.2, 1.95);
  s.addText("WHAT THE PROTOTYPE DOES ON THE DEFAULT MANDATE", {
    x: 0.85,
    y: 4.95,
    w: 11.6,
    h: 0.28,
    fontFace: "Calibri",
    fontSize: 12,
    bold: true,
    color: GREEN,
    margin: 0,
    isTextBox: true,
  });
  s.addText("150 product engineers. Talent weighted a little above pay. Hyderabad 72, Pune 63, Chennai 63, Bengaluru 59.", {
    x: 0.85,
    y: 5.35,
    w: 11.6,
    h: 0.4,
    fontFace: "Calibri",
    fontSize: 18,
    color: INK,
    margin: 0,
    isTextBox: true,
  });
  s.addText("Bengaluru’s talent reading is 96, the highest on the page. The pay gap against it is ₹7.95 crore a year. The rent gap is ₹58 lakh. Copying the board note is the feature. The job was always a paragraph.", {
    x: 0.85,
    y: 5.85,
    w: 11.6,
    h: 0.65,
    fontFace: "Calibri",
    fontSize: 15,
    color: MUTED,
    margin: 0,
    isTextBox: true,
  });
  foot(s, 8);
  s.addNotes(
    "Demo path if the prototype is open: leave the first preset, then switch to cost-first and move headcount from 150 to 400 so Chennai flips to Hyderabad. Then open BFSI and show that pay was weighted and then excluded. Then ask how many people Goldman Sachs employs in India. A model writes that reply from the file only. If it invents a headcount, Field discards the reply. The refusal is still the product.",
  );
}

// ---------------------------------------------------------------------------
// 9. The result
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "Reputation is a weight. It is not an answer.");

  const table = [
    ["City", "Fit", "Talent reading"],
    ["Hyderabad", "72", "82"],
    ["Pune", "63", "74"],
    ["Chennai", "63", "64"],
    ["Bengaluru", "59", "96"],
    ["Delhi NCR", "59", "68"],
    ["Mumbai", "52", "46"],
  ];
  table.forEach((row, i) => {
    const y = 1.25 + i * 0.48;
    const bold = i === 0 || i === 4;
    const color = i === 0 ? DIM : INK;
    s.addText(row[0], { x: 0.55, y, w: 2.5, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: bold || i === 1, color, margin: 0, isTextBox: true });
    s.addText(row[1], { x: 3.15, y, w: 1.1, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: i === 0, color, margin: 0, isTextBox: true });
    s.addText(row[2], { x: 4.3, y, w: 2.2, h: 0.4, fontFace: "Calibri", fontSize: 16, bold: i === 0, color, margin: 0, isTextBox: true });
  });

  const calls = [
    ["Pay for the deepest bench", "Bengaluru moves first, 85 to Hyderabad’s 81. Cost and hiring-room weights are near zero. This is the case the reputation assumes is the only case."],
    ["Cost first, 150 people", "Chennai, one point ahead of Hyderabad. The vacancy warning sits on the card. Cheap and tight are allowed to be true together."],
    ["The same weights at 400", "Hyderabad. Chennai loses 8 fit points because its talent reading is under 72. Scale is what the median was hiding."],
  ];
  calls.forEach((item, i) => {
    const y = 1.25 + i * 1.8;
    s.addText(item[0], {
      x: 7.15,
      y,
      w: 5.5,
      h: 0.35,
      fontFace: "Calibri",
      fontSize: 16,
      bold: true,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
    s.addText(item[1], {
      x: 7.15,
      y: y + 0.4,
      w: 5.5,
      h: 1.15,
      fontFace: "Calibri",
      fontSize: 14,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    });
  });
  foot(s, 9);
  s.addNotes(
    "Fit is a weighted reading, 0–100, and the method is on the prototype. Talent readings are judgments of published clusters, not résumé counts. Pay, where it exists, is 100 × the cheapest software median ÷ the city’s median, so the most expensive city is not scored as zero. BFSI, finance, chips, industrial and pharma drop pay entirely. On chip design the prototype ranks Hyderabad and states that Bengaluru’s talent reading is higher, 94 against 90. Industrial ranks Pune. If a reviewer disagrees with a talent reading, that is a feature: the reading is visible and replaceable. A hidden index would be the old product.",
  );
}

// ---------------------------------------------------------------------------
// 10. Discipline
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "It earns trust by leaving cells blank.");
  const rules = [
    ["Company headcount", "Blank. Circulating lists invent one. The sample names a few dozen centres and withholds the size of every one of them."],
    ["Pay, outside software", "Blank for BFSI, finance operations, chips, industrial and pharma. Data and AI may use the software median, and the screen says proxy."],
    ["Bengaluru’s subsidy", "Karnataka’s rental reimbursement, up to ₹2 crore, and the EPF support sit in Beyond Bengaluru. The city does not inherit them."],
    ["A national rule", "Safe Harbour at a single 15.5% margin applies in every city. It is shown on the page and kept out of the rank. NCR’s incentives stay low until three notifications are read."],
  ];
  rules.forEach((rule, i) => {
    const x = 0.55 + (i % 2) * 6.35;
    const y = 1.4 + Math.floor(i / 2) * 2.55;
    card(s, x, y, 6.1, 2.35);
    s.addText(rule[0], {
      x: x + 0.3,
      y: y + 0.28,
      w: 5.5,
      h: 0.45,
      fontFace: "Cambria",
      fontSize: 22,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
    s.addText(rule[1], {
      x: x + 0.3,
      y: y + 0.9,
      w: 5.5,
      h: 1.15,
      fontFace: "Calibri",
      fontSize: 15,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    });
  });
  foot(s, 10);
  s.addNotes(
    "Karnataka GCC Policy 2024–29, notified November 2024. Beyond Bengaluru cities named in the policy and in the Khaitan note: Mysuru, Mangaluru, Hubballi-Dharwad-Belagavi, Tumakuru, Kalaburagi, Shivamogga. ICAI’s summary cites rental reimbursement up to ₹2 crore and EPF of ₹3,000 an employee for two years. I have not re-derived every cap from the gazette in this prototype, and the product says so where the transcription is partial. Telangana is scored as “courted, caps not transcribed.” That humility is the positioning.",
  );
}

// ---------------------------------------------------------------------------
// 11. Positioning
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "Why they would leave what they already use.");
  const people = [
    ["The entrant", "A note they can put in the appendix this week, before they are ready to pay for a custom study."],
    ["The advisor", "A client will forward it. Better to be the person who checks the file than the person the file is checking."],
    ["The state", "A comparison, which a roadshow deck is not allowed to be. Karnataka’s own policy already promises a real-estate portal."],
    ["The GCC on city two", "The same job, with more context. A release, not a second product."],
    ["The vendor who delivers", "Named as a peer in a cluster. A listing fee is the wrong door. Proof of delivery waits until setups can be observed."],
  ];
  people.forEach((row, i) => {
    const y = 1.2 + i * 0.95;
    s.addText(row[0], {
      x: 0.55,
      y,
      w: 3.3,
      h: 0.7,
      fontFace: "Calibri",
      fontSize: 16,
      bold: true,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
    s.addText(row[1], {
      x: 4.0,
      y,
      w: 8.7,
      h: 0.75,
      fontFace: "Calibri",
      fontSize: 16,
      color: MUTED,
      margin: 0,
      isTextBox: true,
    });
  });
  foot(s, 11);
  s.addNotes(
    "Positioning line, if you only get one: the sourced shortlist a board can read. Against Zinnov: cite the census, do not sell the setup. They have twenty years and 220 setups; competing on the count is a loss. Against a directory, including a good one: a list answers who is already there. A mandate answers where you should go and what the alternative costs. Against state portals: governments announce layers. Karnataka’s policy text itself asks for a live real-estate portal. A buyer needs the comparison inside this quarter.",
  );
}

// ---------------------------------------------------------------------------
// 12. Not this / next
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  heading(s, "The first year is a file, not a marketplace.");
  s.addText("Leave these", {
    x: 0.55,
    y: 1.2,
    w: 5.5,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 14,
    bold: true,
    color: RUST,
    margin: 0,
    isTextBox: true,
  });
  const leave = [
    "A rival census, spent arguing with 2,117.",
    "A tier-2 campaign. About 5% of new units went there. A first centre of 150 people is the wrong place to prove it.",
    "A chatbot over policy PDFs. Fluency is how the bad guides already sound.",
    "A directory of lawyers, recruiters and EOR vendors.",
  ];
  leave.forEach((line, i) => {
    s.addText(line, {
      x: 0.55,
      y: 1.7 + i * 0.95,
      w: 6.0,
      h: 0.85,
      fontFace: "Calibri",
      fontSize: 15,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
  });

  card(s, 6.9, 1.2, 5.85, 4.35);
  s.addText("THE NEXT 90 DAYS", {
    x: 7.15,
    y: 1.45,
    w: 5.4,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 13,
    bold: true,
    color: GREEN,
    margin: 0,
    isTextBox: true,
  });
  const next = [
    "Read the remaining state notifications into the same schema. Where that has not happened, keep the blank.",
    "Attach role-level pay only where a publish gate clears. That graph is the advantage. The gate is what makes it usable in a board paper.",
    "Store every mandate. The second user should be able to see what the first one weighted.",
  ];
  next.forEach((line, i) => {
    s.addText(`${i + 1}`, {
      x: 7.15,
      y: 1.95 + i * 1.1,
      w: 0.35,
      h: 0.9,
      fontFace: "Cambria",
      fontSize: 18,
      color: RUST,
      margin: 0,
      isTextBox: true,
    });
    s.addText(line, {
      x: 7.55,
      y: 1.95 + i * 1.1,
      w: 4.9,
      h: 0.95,
      fontFace: "Calibri",
      fontSize: 14,
      color: INK,
      margin: 0,
      isTextBox: true,
    });
  });

  s.addText("Zinnov will not open the census. A state will not print a rival’s incentive beside its own. The file is where those inputs can share a sentence. The record of mandates, and the habit of blanks, is what compounds.", {
    x: 0.55,
    y: 5.75,
    w: 12.2,
    h: 1.0,
    fontFace: "Calibri",
    fontSize: 15,
    color: MUTED,
    margin: 0,
    isTextBox: true,
  });
  foot(s, 12);
  s.addNotes(
    "Tier-2 figure: about 5% of units set up in the past year went to emerging cities; about two thirds of new GCCs over two years chose Tier-1. Coimbatore 60+ units, Ahmedabad and Kolkata 45+, Vadodara and Kochi 35+, per the FY26 landscape as compiled in August 2026. Real, and the wrong first recommendation. The moat is deliberately not “we scraped more.” Anyone can scrape. The hard part is a firm that will leave a cell blank in public, and a history of mandates that shows which weights real buyers used.",
  );
}

// ---------------------------------------------------------------------------
// 13. Close
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: INK };
  mark(s, 0.6, 0.5, "E7B5A2");
  s.addText("A sentence\na cautious person\ncan sign.", {
    x: 0.6,
    y: 1.7,
    w: 12,
    h: 2.8,
    fontFace: "Cambria",
    fontSize: 48,
    color: "F7F6F2",
    margin: 0,
    isTextBox: true,
  });
  s.addText("Field writes it, and shows the work. The prototype is the file. This deck is the argument.", {
    x: 0.6,
    y: 5.0,
    w: 11,
    h: 0.7,
    fontFace: "Calibri",
    fontSize: 20,
    color: "D9D3C9",
    margin: 0,
    isTextBox: true,
  });
  s.addText("Product assignment   ·   Flexiple   ·   October 2026", {
    x: 0.6,
    y: 6.55,
    w: 10,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 14,
    color: "8A8378",
    margin: 0,
    isTextBox: true,
  });
  s.addNotes(
    "Stop here. If asked what success looks like in a year: a board paper that cites Field the way it would cite a filing, and an advisor who opens it before they open their own model. If asked what would change my mind: evidence that buyers will not trust a file that leaves blanks, and will pay instead for a complete-looking number. I don’t think that buyer is the one who should be the customer.",
  );
}

pres
  .writeFile({ fileName: "C:/Users/pkuma/New folder (2)/Field.pptx" })
  .then(() => console.log("wrote Field.pptx"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
