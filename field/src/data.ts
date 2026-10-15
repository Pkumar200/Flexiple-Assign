export type FunctionId =
  | "product_engineering"
  | "data_ai"
  | "bfsi"
  | "finance_gbs"
  | "semiconductor"
  | "industrial"
  | "pharma";

export type CityId =
  | "bengaluru"
  | "hyderabad"
  | "pune"
  | "chennai"
  | "mumbai"
  | "ncr";

export type Headcount = 80 | 150 | 400;

export interface Weights {
  talent: number;
  cost: number;
  speed: number;
  incentives: number;
  room: number;
}

export interface Mandate {
  functionId: FunctionId;
  headcount: Headcount;
  weights: Weights;
}

export interface City {
  id: CityId;
  name: string;
  state: string;
  /** Average office rent, INR per sq ft per month. CREDAI top-7 annual, calendar 2025. */
  rent: number;
  /** Grade-A vacancy, percent. Same CREDAI report. */
  vacancy: number;
  /** Software engineer median, ₹ lakh per year. Flexiple, Aug 2026. Null would mean withheld. */
  engineerMedian: number;
  /** Senior (6+ years) software engineer median, ₹ lakh. Same source. Delhi figure used for NCR. */
  seniorMedian: number;
  seniorMedianNote?: string;
  /** Share of India's GCC professionals. Zinnov, FY26. */
  talentShare: number;
  /** Share of national GCC office leasing, calendar 2025. CREDAI. Null if not broken out. */
  leasingShare: number | null;
  leasingMsf: number | null;
  /** Reading, 0–100: density of lawyers, EOR, setup partners, existing centres. Not a measurement. */
  ecosystem: number;
  /** Reading, 0–100: how hard the hiring fight is for GCC talent generally. */
  competition: number;
  /** Reading, 0–100. High only where a GCC policy was actually read. */
  incentive: number;
  incentiveNote: string;
  watch: string;
  talent: Record<FunctionId, number>;
}

export interface FnMeta {
  id: FunctionId;
  label: string;
  short: string;
  /** Engineering medians may be used as a labeled proxy. Otherwise pay is left blank. */
  pay: "measured" | "proxy" | "none";
  payNote: string;
}

export interface Company {
  name: string;
  cities: CityId[];
  functions: FunctionId[];
  line: string;
}

export interface Preset {
  id: string;
  label: string;
  mandate: Mandate;
}

export const SQFT_PER_PERSON = 100;

export const FUNCTIONS: FnMeta[] = [
  {
    id: "product_engineering",
    label: "Product engineering",
    short: "Engineering",
    pay: "measured",
    payNote:
      "Software engineer median, Flexiple, August 2026, cleared on a 25-record publish gate. This is base-pay median, not CTC, and not your offer band.",
  },
  {
    id: "data_ai",
    label: "Data and AI",
    short: "Data / AI",
    pay: "proxy",
    payNote:
      "No data-scientist survey is in this file. The software engineer median is used as a proxy and labeled as one. Senior AI bands are thinner, and more expensive, than this number.",
  },
  {
    id: "bfsi",
    label: "BFSI operations",
    short: "BFSI",
    pay: "none",
    payNote:
      "No BFSI pay band is in this file. The engineering median is not borrowed. A bank that prices Hyderabad off a software median is using the wrong labour market.",
  },
  {
    id: "finance_gbs",
    label: "Finance shared services",
    short: "Finance GBS",
    pay: "none",
    payNote:
      "No finance-operations pay band is in this file. Cost is left out of the rank rather than filled in.",
  },
  {
    id: "semiconductor",
    label: "Chip design",
    short: "Chips",
    pay: "none",
    payNote:
      "Chip-design bands are not the software median. Pay is blank. A principal silicon engineer is a different market from a product engineer.",
  },
  {
    id: "industrial",
    label: "Industrial engineering",
    short: "Industrial",
    pay: "none",
    payNote:
      "No mechanical or plant-engineering pay band is in this file. Cost is left out.",
  },
  {
    id: "pharma",
    label: "Pharma and life sciences",
    short: "Pharma",
    pay: "none",
    payNote:
      "No pharma R&D pay band is in this file. Cost is left out. Hyderabad's rank here is about the cluster, not a salary table.",
  },
];

export const CITIES: City[] = [
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    rent: 102,
    vacancy: 12,
    engineerMedian: 15.7,
    seniorMedian: 32.5,
    talentShare: 34,
    leasingShare: 38,
    leasingMsf: 12.3,
    ecosystem: 92,
    competition: 88,
    incentive: 46,
    incentiveNote:
      "Karnataka has the clearest GCC policy in the file (2024–29): 500 new GCCs, 1,000 total by 2029, approvals the policy says will move in 45 days. The rental reimbursement, up to ₹2 crore, and the EPF support sit in Beyond Bengaluru — Mysuru, Mangaluru, Hubballi-Dharwad-Belagavi, Tumakuru, Kalaburagi, Shivamogga — not in this city. Scoring Bengaluru Urban on those line items is a category error.",
    watch:
      "Highest talent share in the country, at 34 percent of GCC professionals, which is also why the hiring fight is the worst. Karnataka's generous line items do not apply to the city people mean when they say Bengaluru.",
    talent: {
      product_engineering: 96,
      data_ai: 94,
      bfsi: 74,
      finance_gbs: 72,
      semiconductor: 94,
      industrial: 84,
      pharma: 70,
    },
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    rent: 70,
    vacancy: 26.3,
    engineerMedian: 10.4,
    seniorMedian: 24.2,
    talentShare: 14,
    leasingShare: 14,
    leasingMsf: 4.5,
    ecosystem: 80,
    competition: 62,
    incentive: 64,
    incentiveNote:
      "Telangana courts GCCs hard: TS-iPASS is the single-window claim, and the ICT policy runs 2021–26. Rupee caps are not transcribed in this file, so the incentive reading stays moderate rather than precise. What is sourced: about half of new BFSI GCC units in the past year chose this city.",
    watch:
      "The loosest big office market in the top seven, at 26.3 percent vacancy. Room to take a floor is not the same thing as depth in every function. BFSI and chip design are real clusters here; a generic back office is a different question.",
    talent: {
      product_engineering: 82,
      data_ai: 84,
      bfsi: 92,
      finance_gbs: 82,
      semiconductor: 90,
      industrial: 56,
      pharma: 94,
    },
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    rent: 87,
    vacancy: 11.9,
    engineerMedian: 9.5,
    seniorMedian: 22.3,
    talentShare: 13,
    leasingShare: 15,
    leasingMsf: 4.8,
    ecosystem: 74,
    competition: 58,
    incentive: 42,
    incentiveNote:
      "No Maharashtra GCC tariff is transcribed in this file, so incentives are scored low on purpose. The sourced fact is demand: GCC leasing rose from 3.2 to 4.8 million sq ft in 2025, and the city's share of national GCC leasing went from 11 percent to 15 percent.",
    watch:
      "The right city when the work sits next to plants, auto, or a finance-operations cluster that already exists. It is a poor default for a software centre that chose it because Mumbai felt expensive.",
    talent: {
      product_engineering: 74,
      data_ai: 66,
      bfsi: 86,
      finance_gbs: 84,
      semiconductor: 52,
      industrial: 92,
      pharma: 48,
    },
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    rent: 79,
    vacancy: 8.8,
    engineerMedian: 7.6,
    seniorMedian: 19.1,
    talentShare: 12,
    leasingShare: 13,
    leasingMsf: 4.3,
    ecosystem: 70,
    competition: 52,
    incentive: 44,
    incentiveNote:
      "A dedicated GCC notification is not in this file. Tamil Nadu's industrial and electronics policies are real, and they are not transcribed here as a GCC tariff, so the score stays modest. The office market is the constraint: tightest vacancy of the top seven.",
    watch:
      "Cheapest software median of the six, and the tightest floor. Senior median is ₹19.1 lakh against ₹32.5 lakh in Bengaluru. If the first twenty hires are senior, the median that made Chennai look cheap is the wrong comfort.",
    talent: {
      product_engineering: 64,
      data_ai: 58,
      bfsi: 70,
      finance_gbs: 76,
      semiconductor: 56,
      industrial: 82,
      pharma: 52,
    },
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    rent: 148,
    vacancy: 14.7,
    engineerMedian: 9.7,
    seniorMedian: 22.8,
    talentShare: 11,
    leasingShare: null,
    leasingMsf: null,
    ecosystem: 84,
    competition: 60,
    incentive: 28,
    incentiveNote:
      "No city-specific GCC tariff is in this file. The rent average of ₹148 hides the decision: BKC is ₹360–530 per sq ft a month, Lower Parel ₹200–360, while Thane and Navi Mumbai are ₹60–120. A GCC that does not need the exchanges should not pay BKC prices.",
    watch:
      "The headquarters city. Pick it when the India lead has to sit near the regulator, the exchanges, or the parent’s existing Mumbai office. The city vacancy of 14.7 percent includes markets you will not lease. This file cuts the floor reading by 12 points for that reason, and shows the cut.",
    talent: {
      product_engineering: 46,
      data_ai: 52,
      bfsi: 84,
      finance_gbs: 58,
      semiconductor: 24,
      industrial: 42,
      pharma: 72,
    },
  },
  {
    id: "ncr",
    name: "Delhi NCR",
    state: "Delhi, Haryana, Uttar Pradesh",
    rent: 90,
    vacancy: 21.7,
    engineerMedian: 14.1,
    seniorMedian: 24,
    seniorMedianNote: "Flexiple publishes this as the Delhi median. Gurugram runs hotter than Noida; the city figure blends them.",
    talentShare: 10,
    leasingShare: 14,
    leasingMsf: 4.5,
    ecosystem: 78,
    competition: 64,
    incentive: 34,
    incentiveNote:
      "Three jurisdictions, and none of their notifications is transcribed here. The incentive reading is low until someone reads Haryana, Uttar Pradesh, and Delhi separately. Cyber City rent is ₹130–175; Noida Grade A is ₹65–135. An average of ₹90 is not a site.",
    watch:
      "Treat NCR as a shortlist of micro-markets, not a city. Adobe and a large BFSI presence sit here. The pay figure is a Delhi median and will mislead you in Gurugram.",
    talent: {
      product_engineering: 68,
      data_ai: 64,
      bfsi: 66,
      finance_gbs: 68,
      semiconductor: 72,
      industrial: 54,
      pharma: 44,
    },
  },
];

export const COMPANIES: Company[] = [
  { name: "Goldman Sachs", cities: ["bengaluru", "hyderabad"], functions: ["bfsi", "product_engineering"], line: "Engineering and finance centre" },
  { name: "JPMorgan Chase", cities: ["mumbai", "bengaluru"], functions: ["bfsi", "product_engineering"], line: "Technology and operations" },
  { name: "Wells Fargo", cities: ["bengaluru", "chennai", "hyderabad"], functions: ["bfsi", "finance_gbs"], line: "Technology, operations, corporate functions" },
  { name: "HSBC", cities: ["bengaluru", "chennai", "hyderabad"], functions: ["bfsi", "finance_gbs"], line: "Global service centres" },
  { name: "Standard Chartered", cities: ["bengaluru", "chennai"], functions: ["bfsi"], line: "Global business services" },
  { name: "Deutsche Bank", cities: ["bengaluru", "pune"], functions: ["bfsi", "product_engineering"], line: "Technology centre" },
  { name: "Barclays", cities: ["pune"], functions: ["bfsi", "product_engineering"], line: "Global service centre" },
  { name: "BNY Mellon", cities: ["pune", "chennai"], functions: ["bfsi", "finance_gbs"], line: "Global delivery" },
  { name: "BlackRock", cities: ["mumbai", "ncr"], functions: ["bfsi"], line: "Hubs in Mumbai and Gurugram" },
  { name: "Morgan Stanley", cities: ["mumbai"], functions: ["bfsi"], line: "Markets and technology presence" },
  { name: "American Express", cities: ["bengaluru", "ncr"], functions: ["bfsi", "data_ai"], line: "Centre of excellence" },
  { name: "Fidelity", cities: ["bengaluru"], functions: ["bfsi", "finance_gbs"], line: "Business services" },
  { name: "Microsoft", cities: ["bengaluru", "hyderabad", "ncr"], functions: ["product_engineering", "data_ai"], line: "India development centre" },
  { name: "Amazon", cities: ["bengaluru", "hyderabad", "chennai"], functions: ["product_engineering", "data_ai"], line: "Development centres" },
  { name: "Google", cities: ["bengaluru", "hyderabad"], functions: ["product_engineering", "data_ai"], line: "Engineering and safety" },
  { name: "Walmart Global Tech", cities: ["bengaluru", "chennai", "ncr"], functions: ["product_engineering", "data_ai"], line: "Product and platform engineering" },
  { name: "Target", cities: ["bengaluru"], functions: ["product_engineering"], line: "Technology centre" },
  { name: "Adobe", cities: ["ncr", "bengaluru"], functions: ["product_engineering"], line: "Research and product, Noida and Bengaluru" },
  { name: "Salesforce", cities: ["hyderabad"], functions: ["product_engineering", "data_ai"], line: "Centre of excellence, as compiled" },
  { name: "Atlassian", cities: ["bengaluru"], functions: ["product_engineering"], line: "R&D centre" },
  { name: "Databricks", cities: ["bengaluru"], functions: ["data_ai", "product_engineering"], line: "R&D centre" },
  { name: "Qualcomm", cities: ["hyderabad", "bengaluru", "chennai", "ncr"], functions: ["semiconductor", "product_engineering"], line: "Design centres" },
  { name: "Nvidia", cities: ["hyderabad", "pune", "ncr", "bengaluru"], functions: ["semiconductor", "data_ai"], line: "Development centres" },
  { name: "Intel", cities: ["bengaluru", "hyderabad"], functions: ["semiconductor"], line: "Design and engineering" },
  { name: "Texas Instruments", cities: ["bengaluru", "chennai"], functions: ["semiconductor"], line: "R&D" },
  { name: "AMD", cities: ["bengaluru", "hyderabad"], functions: ["semiconductor"], line: "Named in the FY26 landscape; city detail is thin in this file" },
  { name: "AstraZeneca", cities: ["bengaluru", "chennai"], functions: ["pharma"], line: "Innovation and technology centre" },
  { name: "Novartis", cities: ["mumbai", "hyderabad"], functions: ["pharma"], line: "Corporate centre" },
  { name: "GSK", cities: ["bengaluru", "mumbai", "hyderabad"], functions: ["pharma"], line: "GCC presence across three cities" },
  { name: "Bayer", cities: ["hyderabad", "bengaluru"], functions: ["pharma"], line: "Shared services and a centre of excellence" },
  { name: "Abbott", cities: ["mumbai", "bengaluru"], functions: ["pharma"], line: "Innovation and development" },
  { name: "Viatris", cities: ["hyderabad"], functions: ["pharma"], line: "R&D centres" },
  { name: "Optum", cities: ["ncr", "bengaluru", "chennai", "hyderabad"], functions: ["data_ai", "product_engineering"], line: "UnitedHealth's India centres" },
  { name: "Mercedes-Benz", cities: ["bengaluru", "pune"], functions: ["industrial", "product_engineering"], line: "R&D" },
  { name: "BMW", cities: ["pune", "bengaluru", "chennai"], functions: ["industrial"], line: "TechWorks" },
  { name: "Cummins", cities: ["pune"], functions: ["industrial"], line: "Global competency centre" },
  { name: "John Deere", cities: ["pune"], functions: ["industrial"], line: "Technology centre" },
  { name: "Caterpillar", cities: ["chennai"], functions: ["industrial"], line: "Engineering solutions" },
  { name: "Siemens", cities: ["bengaluru", "chennai", "pune", "ncr"], functions: ["industrial", "product_engineering"], line: "Technology and services" },
  { name: "Bosch", cities: ["hyderabad"], functions: ["industrial", "product_engineering"], line: "Global software technologies. Coimbatore is also named; it is not one of the six cities ranked here" },
  { name: "Schneider Electric", cities: ["bengaluru"], functions: ["industrial"], line: "Innovation hub" },
  { name: "Airbus", cities: ["bengaluru"], functions: ["industrial"], line: "Engineering centre" },
  { name: "Renault Nissan", cities: ["chennai", "hyderabad", "bengaluru"], functions: ["industrial"], line: "Technology and business centre" },
  { name: "Shell", cities: ["bengaluru", "chennai"], functions: ["finance_gbs"], line: "Business operations" },
];

export const NEW_ENTRANTS = [
  "Anthropic",
  "Vanguard",
  "The Hartford",
  "Albertsons",
  "Citizens Financial",
  "State Street",
  "MetLife",
  "Renesas",
  "Lattice Semiconductor",
  "Carlsberg",
];

export const PRESETS: Preset[] = [
  {
    id: "sensible",
    label: "Engineering, a normal weighting",
    mandate: {
      functionId: "product_engineering",
      headcount: 150,
      weights: { talent: 4, cost: 3, speed: 2, incentives: 1, room: 3 },
    },
  },
  {
    id: "bench",
    label: "Pay for the deepest bench",
    mandate: {
      functionId: "product_engineering",
      headcount: 150,
      weights: { talent: 5, cost: 1, speed: 1, incentives: 0, room: 0 },
    },
  },
  {
    id: "cost",
    label: "Engineering, cost first",
    mandate: {
      functionId: "product_engineering",
      headcount: 150,
      weights: { talent: 2, cost: 5, speed: 1, incentives: 1, room: 3 },
    },
  },
  {
    id: "bfsi",
    label: "BFSI operations",
    mandate: {
      functionId: "bfsi",
      headcount: 150,
      weights: { talent: 5, cost: 3, speed: 2, incentives: 2, room: 3 },
    },
  },
  {
    id: "chips",
    label: "Chip design",
    mandate: {
      functionId: "semiconductor",
      headcount: 80,
      weights: { talent: 5, cost: 2, speed: 2, incentives: 1, room: 2 },
    },
  },
  {
    id: "plant",
    label: "Industrial engineering",
    mandate: {
      functionId: "industrial",
      headcount: 150,
      weights: { talent: 5, cost: 2, speed: 2, incentives: 2, room: 2 },
    },
  },
];

export const WEIGHT_META: { key: keyof Weights; label: string; hint: string }[] = [
  { key: "talent", label: "Talent depth", hint: "How deep the published cluster is for this function" },
  { key: "cost", label: "Pay", hint: "Used only when this file has a pay figure for the function" },
  { key: "speed", label: "Speed to a floor", hint: "Setup density, mixed with vacancy" },
  { key: "incentives", label: "Incentives", hint: "High only where a policy was read. Blanks stay low." },
  { key: "room", label: "Room to hire", hint: "Vacancy, and how fought-over the pool already is" },
];

export function fnMeta(id: FunctionId): FnMeta {
  return FUNCTIONS.find((f) => f.id === id)!;
}

export function cityById(id: CityId): City {
  return CITIES.find((c) => c.id === id)!;
}

export function peersFor(city: CityId, fn: FunctionId): Company[] {
  return COMPANIES.filter((c) => c.cities.includes(city) && c.functions.includes(fn));
}
