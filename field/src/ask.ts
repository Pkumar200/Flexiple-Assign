import { CITIES, COMPANIES, NEW_ENTRANTS, CityId, fnMeta } from "./data";
import { NATIONAL_NOTE, annualPay, annualRent, buildResult, formatInr } from "./engine";
import { PRESETS } from "./data";

export interface Answer {
  title: string;
  paragraphs: string[];
  citations: string[];
  refused: boolean;
}

const CENSUS = [
  "Nasscom–Zinnov, India GCC Landscape, FY2026 (released 2 July 2026): 2,117 GCCs, 3,728 units, $98.4 billion revenue, 2.36 million professionals, as of March 2026.",
  "Times of India, reporting that release: the FY2024 base was revised from “over 1,700” to 1,855.",
  "Nasscom–Zinnov landscape, FY2024: over 1,700 GCCs, $64.6 billion, 1.9 million people, and a 2030 projection of 2,100–2,200 centres.",
  "Grand View Research: India GCC market size $69.85 billion in 2025. A different object from GCC revenue.",
  "Flexiple GCC directory, August 2026: 536 verified companies. City pages count presences, which sum to more than 536 because one company occupies several cities.",
  "CREDAI, India Office Market Annual Update 2025, for rents, vacancy and GCC leasing.",
  "Zinnov, FY2026 city talent shares: Bengaluru 34%, Hyderabad 14%, Pune 13%, Chennai 12%, Mumbai 11%, NCR 10%.",
  "Karnataka GCC Policy 2024–29, and the Khaitan & Co note on the notified text. ICAI’s state-policy summary for the Beyond Bengaluru caps.",
];

function answer(title: string, paragraphs: string[], citations: string[], refused = false): Answer {
  return { title, paragraphs, citations, refused };
}

const ALIASES: { id: CityId; words: string[] }[] = [
  { id: "bengaluru", words: ["bengaluru", "bangalore", "blr"] },
  { id: "hyderabad", words: ["hyderabad", "hyd"] },
  { id: "pune", words: ["pune"] },
  { id: "chennai", words: ["chennai", "madras"] },
  { id: "mumbai", words: ["mumbai", "bombay"] },
  { id: "ncr", words: ["ncr", "delhi", "gurgaon", "gurugram", "noida"] },
];

function citiesIn(q: string): CityId[] {
  const found: CityId[] = [];
  for (const alias of ALIASES) {
    if (alias.words.some((word) => new RegExp(`\\b${word}\\b`, "i").test(q))) found.push(alias.id);
  }
  return found;
}

function city(id: CityId) {
  return CITIES.find((item) => item.id === id)!;
}

export function ask(raw: string): Answer {
  const q = raw.trim().toLowerCase();
  if (!q) {
    return answer("Ask a question the file can carry.", [
      "Try a count, a comparison, a function, or a company. If the figure is not here, the answer is a blank, not a guess.",
    ], []);
  }

  if (/how many (people|employees|staff)|headcount|how many (does|do)|employs|employees does/.test(q)) {
    const company = COMPANIES.find((item) => q.includes(item.name.toLowerCase()));
    const who = company?.name ?? "That company";
    return answer(
      "Headcount is blank.",
      [
        `${who}'s India headcount is not in this file. Lists that publish one are usually unsourced, and Field will not invent it to look complete.`,
        company
          ? `${company.name} is in the sample as: ${company.line}. Cities named in the compilation: ${company.cities.map((id) => city(id).name).join(", ")}.`
          : "If you name a company that is in the sample, Field will still give you cities and withhold the headcount.",
      ],
      ["Dun & Bradstreet and Nasscom–Zinnov compilations, via the India GCC Index, August 2026. No company-level headcount is taken from them."],
      true,
    );
  }

  if (/safe harbour|safe harbor|15\.5|transfer pric/.test(q)) {
    return answer("It does not pick a city.", [NATIONAL_NOTE], [
      "Union Budget measures as summarised by Zinnov and by the India GCC Index, 2026.",
    ]);
  }

  if (/how many|how many gcc|2,?117|census|count of|number of gcc|3,?728/.test(q)) {
    return answer("Three different sentences.", [
      "Nasscom and Zinnov count 2,117 GCCs, operating 3,728 units, employing 2.36 million people, with $98.4 billion of revenue, as of March 2026.",
      "A GCC and a unit are not the same noun. 3,728 divided by 2,117 is about 1.8 units a company. Quoting either figure as “the number of GCCs” is how the press gets a fight going.",
      "The same series said “over 1,700” for FY2024, then revised that base to 1,855 when the FY2026 report came out. Grand View’s $69.85 billion for 2025 is a market-size estimate, not that revenue figure. Flexiple’s public directory verifies 536 companies, and says so.",
      "Field does not reconcile these into a truer census. The decision in front of a new entrant does not require one.",
    ], CENSUS);
  }

  if (/unit|centre or center|company vs|what is a gcc|definition/.test(q) && /differ|vs|versus|mean|what/.test(q)) {
    return answer("A company, a unit, a presence.", [
      "In the FY2026 landscape report, a GCC is the parent’s India centre as an organisation. A unit is a site. One GCC often runs from more than one city, which is why 2,117 and 3,728 can both be true.",
      "A verified directory counts companies it has checked, not every unit in the census. Flexiple’s 536 is that kind of number. Adding its city pages together double-counts multi-city firms.",
      "GCC, GIC and captive are, in practice, the same idea: an offshore centre the parent owns, staffed by its own employees, doing the parent’s work. A vendor who serves many clients is not a GCC. A services firm’s India delivery centre is not one either, even when a directory tags it “services-led” and leaves it in.",
    ], CENSUS.slice(0, 5));
  }

  if (/karnataka|beyond bengaluru|incentive|subsidy|policy/.test(q) && !/telangana|hyderabad|tamil|chennai|gujarat/.test(q)) {
    return answer("The incentive is real. It is often the wrong city.", [
      city("bengaluru").incentiveNote,
      "A prospect who puts “Karnataka GCC incentives” on a Bengaluru business case has moved money that the policy did not offer them.",
    ], [
      "Karnataka GCC Policy 2024–29.",
      "Khaitan & Co, note on the notified policy, November 2024.",
      "ICAI state-policy summary: Beyond Bengaluru rental reimbursement cited up to ₹2 crore, and EPF support of ₹3,000 an employee for two years.",
    ]);
  }

  if (/telangana|ts-ipass|t-pass/.test(q)) {
    return answer("Courted, not fully transcribed.", [
      city("hyderabad").incentiveNote,
      "Until the notification is read line by line, Field will not print a rupee cap.",
    ], ["India GCC Index, August 2026, on the BFSI unit share. Telangana ICT Policy 2021–26, by name only."]);
  }

  if (/how long|timeline|months|ansr|weeks to|set up|setup time/.test(q)) {
    return answer("The same market publishes three clocks.", [
      "A wholly owned captive is generally described as 6 to 12 months to operational, with a first hire often at 16 to 24 weeks. Incorporation itself is the short part. Fit-out, registrations and the first cohort take the rest.",
      "ANSR’s own GCC page says a setup generally takes 6 to 8 months, says its team can do the end-to-end in 4 to 6 weeks, and elsewhere says 60 to 90 days. Zinnov describes a focused setup in 3 to 6 months and a larger one in 6 to 12, and also says “as quickly as 90 days.”",
      "Those sentences are not a contradiction to resolve by averaging. They describe different products: a captive, a build-operate-transfer, an employer-of-record bridge. The file’s job is to stop a board paper from quoting one of them as the time.",
    ], [
      "ANSR, global capability center page, FAQ and product copy.",
      "Zinnov, GCC setup notes.",
      "Setup guides circulating in 2026, used here only for the range, not as a quote of your budget.",
    ]);
  }

  if (/tier-?2|coimbatore|ahmedabad|jaipur|kochi|emerging/.test(q)) {
    return answer("Real, and the wrong place to prove a thesis.", [
      "About 5 percent of GCC units set up over the past year went to emerging cities. About two thirds of new GCCs over two years still chose a Tier-1 city.",
      "The emerging base is not imaginary: Coimbatore is cited above 60 units, Ahmedabad and Kolkata above 45, Vadodara and Kochi above 35. Karnataka’s own policy spends its best incentives outside Bengaluru, which is the tell. The state wants the second centre, or the cost-sensitive one, to move.",
      "A first centre of 150 people should not be the one that tests whether a thin pool can hire principals. Field does not rank those cities, because a rank would look like a recommendation the evidence does not support.",
    ], [
      "Nasscom–Zinnov FY2026, as summarised in the India GCC Index, August 2026.",
      "Karnataka GCC Policy 2024–29, Beyond Bengaluru.",
    ]);
  }

  if (/who is (this|field) for|first user|who (do you|would you) (build|sell)|for whom/.test(q)) {
    return answer("The person who has to sign a city.", [
      "The first user is the operator inside a foreign company who has about a quarter to put a city in a board paper. They do not yet have a GCC. Nasscom’s runway work puts 1,199 large companies still outside India. That person has the least context and the most expensive blank page.",
      "Advisors, state agencies and vendors feel the asymmetry too. They are not the first customer. An advisor is often the current source of truth. A state writes a deck that is not allowed to be comparable. A vendor marketplace has a cold start, and it is the product a talent company is already tempted to build.",
    ], ["Nasscom GCC Runway Monitor: 1,199 Global Titans yet to establish a GCC. The landscape report’s separate figure is 506 of the Forbes Global 2000 already here. Those are different nouns."]);
  }

  if (/rent|vacancy|office/.test(q)) {
    const ids = citiesIn(q);
    if (ids.length === 0) {
      return answer("Rents, one source, one year.", [
        CITIES.map((item) => `${item.name} ₹${item.rent}/sf a month, vacancy ${item.vacancy}%`).join(". ") + ".",
        "These are CREDAI city averages for calendar 2025, not a landlord’s quote, and not a micro-market. Mumbai’s average hides BKC. NCR’s average hides the gap between Cyber City and Noida.",
      ], ["CREDAI, India Office Market Annual Update 2025."]);
    }
    const lines = ids.map((id) => {
      const item = city(id);
      return `${item.name}: ₹${item.rent} per sq ft a month, vacancy ${item.vacancy} percent. ${item.incentiveNote}`;
    });
    return answer("From the 2025 office annual.", lines, ["CREDAI, India Office Market Annual Update 2025."]);
  }

  if (/compare|vs|versus|or /.test(q)) {
    const ids = citiesIn(q);
    if (ids.length >= 2) {
      const [a, b] = [city(ids[0]), city(ids[1])];
      const headcount = 150;
      const pay = annualPay(a.engineerMedian, headcount) - annualPay(b.engineerMedian, headcount);
      const rent = annualRent(a.rent, headcount) - annualRent(b.rent, headcount);
      return answer(`${a.name} and ${b.name}.`, [
        `Software engineer median: ${a.name} ₹${a.engineerMedian} lakh, ${b.name} ₹${b.engineerMedian} lakh. At 150 people that is ${formatInr(Math.abs(pay))} a year ${pay > 0 ? "more" : "less"} in ${a.name}, on median base, not CTC.`,
        `Rent, city average: ₹${a.rent} against ₹${b.rent}. At 100 sq ft a person, 150 people, the rent gap is ${formatInr(Math.abs(rent))} a year. Senior medians: ₹${a.seniorMedian} lakh against ₹${b.seniorMedian} lakh.`,
        `Vacancy: ${a.vacancy}% against ${b.vacancy}%. GCC talent share: ${a.talentShare}% against ${b.talentShare}%.`,
        `${a.name}: ${a.watch} ${b.name}: ${b.watch}`,
      ], [
        "Flexiple GCC statistics, August 2026, for the medians.",
        "CREDAI office annual, 2025, for rent and vacancy.",
        "Zinnov FY2026, for the talent shares.",
      ]);
    }
  }

  if (/best city|where should|which city|rank/.test(q) || /engineering|bfsi|bank|chip|semiconductor|pharma|industrial|finance|data|ai\b/.test(q)) {
    const preset =
      /chip|semiconductor|silicon/.test(q) ? PRESETS.find((item) => item.id === "chips")! :
      /bfsi|bank|insur/.test(q) ? PRESETS.find((item) => item.id === "bfsi")! :
      /pharma|life science/.test(q) ? { ...PRESETS[0], mandate: { ...PRESETS[3].mandate, functionId: "pharma" as const, weights: PRESETS[3].mandate.weights } } :
      /industrial|plant|auto|manufactur/.test(q) ? PRESETS.find((item) => item.id === "plant")! :
      /finance|gbs|shared service/.test(q) ? { id: "gbs", label: "Finance", mandate: { functionId: "finance_gbs" as const, headcount: 150 as const, weights: { talent: 5, cost: 2, speed: 2, incentives: 2, room: 2 } } } :
      /cost|cheap/.test(q) ? PRESETS.find((item) => item.id === "cost")! :
      /deepest|bench|senior/.test(q) ? PRESETS.find((item) => item.id === "bench")! :
      PRESETS[0];
    const result = buildResult(preset.mandate);
    const fn = fnMeta(preset.mandate.functionId);
    return answer(result.headline, [
      result.dek,
      `Order: ${result.ranked.map((row, index) => `${index + 1} ${row.city.name} (${row.fit})`).join(", ")}.`,
      "Change the weights on the mandate. This answer used a preset, not your company.",
    ], [fn.payNote, "Cluster readings are Field’s, and they are labeled as readings inside the mandate."]);
  }

  if (/coming|next|new entrant|anthropic|pipeline/.test(q)) {
    return answer("Names, without cities.", [
      `The FY2026 landscape names newer entrants including ${NEW_ENTRANTS.join(", ")}.`,
      "Cities for that list are not in this file. A city next to a new name would be a guess, and a guess is how a directory becomes a lead list.",
    ], ["Nasscom–Zinnov India GCC Landscape 2026, as compiled in the India GCC Index, August 2026."]);
  }

  const company = COMPANIES.find((item) => q.includes(item.name.toLowerCase()));
  if (company) {
    return answer(company.name, [
      `${company.line}. Cities in this sample: ${company.cities.map((id) => city(id).name).join(", ")}.`,
      "Headcount is blank. The sample is a compilation of named centres, not a proof that these are the only sites.",
    ], ["India GCC Index, August 2026, drawing on Dun & Bradstreet and the Nasscom–Zinnov landscape."], false);
  }

  return answer("That is not in the file.", [
    "Field can answer the census, a city comparison, a function’s shortlist, Karnataka’s incentive cliff, Safe Harbour, setup clocks, tier-2 cities, and where a named company in the sample sits.",
    "It will not estimate a headcount, a sector percentage read off a chart, or a rupee cap it has not transcribed.",
  ], []);
}
