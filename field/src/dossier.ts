import {
  CITIES,
  COMPANIES,
  FUNCTIONS,
  NEW_ENTRANTS,
  PRESETS,
  fnMeta,
} from "./data";
import { NATIONAL_NOTE, buildResult, methodText } from "./engine";

/** The only text the model is allowed to use. */
export function buildDossier(): string {
  const lines: string[] = [];
  lines.push("FIELD FILE. Answer only from this text. If a figure is not written here, it is blank.");
  lines.push("");
  lines.push("BLANKS, ON PURPOSE");
  lines.push("Company headcount is not in this file. Do not estimate how many people a company employs in India.");
  lines.push("There is no pay band for BFSI, finance shared services, chip design, industrial engineering, or pharma. Do not reuse the software engineer median for those functions.");
  lines.push("Data and AI may use the software engineer median only as a labeled proxy.");
  lines.push("Cities for newer entrants are blank. Do not assign them a city.");
  lines.push("NCR incentive rupee caps are blank. Telangana rupee caps are blank. Tamil Nadu and Maharashtra GCC tariffs are not transcribed.");
  lines.push("");
  lines.push("CENSUS");
  lines.push("Nasscom–Zinnov, India GCC Landscape, FY2026, released 2 July 2026, as of March 2026: 2,117 GCC organisations, 3,728 units (sites), $98.4 billion revenue, 2.36 million professionals. About 1.8 sites per organisation. 32% growth in the organisation count since FY2021. 506 of the Forbes Global 2000 operate a GCC in India.");
  lines.push("The FY2024 landscape first said over 1,700 GCCs, $64.6 billion, 1.9 million people, and a 2030 projection of 2,100 to 2,200 centres. Times of India, reporting the FY2026 release, said the FY2024 base was restated to 1,855.");
  lines.push("Grand View Research: India GCC market size $69.85 billion in 2025. That is a market-size estimate, not the $98.4 billion revenue figure.");
  lines.push("Flexiple GCC directory, August 2026: 536 verified companies. City pages count presences and sum to more than 536 because one company can occupy several cities. Software engineer medians clear a 25-record publish gate.");
  lines.push("Nasscom GCC Runway Monitor: 1,199 large companies still have no GCC in India. That is a different noun from the 506 Forbes Global 2000 figure. Do not add them together.");
  lines.push("Zinnov talent share of India's 2.36 million GCC professionals: Bengaluru 34%, Hyderabad 14%, Pune 13%, Chennai 12%, Mumbai 11%, Delhi NCR 10%, emerging cities 6%.");
  lines.push("About 5% of GCC units set up in the past year went to emerging cities. About two thirds of new GCCs over two years chose a Tier-1 city. Coimbatore is cited above 60 units, Ahmedabad and Kolkata above 45, Vadodara and Kochi above 35. Field does not rank those cities for a first centre of 150 people.");
  lines.push("");
  lines.push("NATIONAL RULE");
  lines.push(NATIONAL_NOTE);
  lines.push("");
  lines.push("SETUP CLOCKS, AS PUBLISHED, NOT AVERAGED");
  lines.push("A wholly owned captive is generally described as 6 to 12 months to operational, with a first hire often at 16 to 24 weeks.");
  lines.push("ANSR's GCC page says a setup generally takes 6 to 8 months, says its team can do the end-to-end in 4 to 6 weeks, and elsewhere says 60 to 90 days.");
  lines.push("Zinnov describes a focused setup in 3 to 6 months, a larger one in 6 to 12 months, and also as quickly as 90 days.");
  lines.push("");
  lines.push("HOW FIT IS COMPUTED");
  lines.push(methodText());
  lines.push("Rent comparisons assume 100 sq ft a person, for scale only.");
  lines.push("");
  lines.push("CITIES");
  for (const city of CITIES) {
    lines.push(
      `${city.name} (${city.state}). Rent ₹${city.rent} per sq ft per month, CREDAI calendar 2025 city average. Vacancy ${city.vacancy}%. Share of GCC talent ${city.talentShare}%. GCC leasing share ${city.leasingShare === null ? "not broken out" : `${city.leasingShare}% and ${city.leasingMsf} million sq ft`}. Software engineer median ₹${city.engineerMedian} lakh. Senior software median ₹${city.seniorMedian} lakh. ${city.seniorMedianNote ?? ""} Incentive reading ${city.incentive}. ${city.incentiveNote} ${city.watch}`,
    );
    const talents = FUNCTIONS.map((fn) => `${fn.short} ${city.talent[fn.id]}`).join(", ");
    lines.push(`Talent readings for ${city.name}, which are judgments of the published cluster, not headcounts: ${talents}.`);
  }
  lines.push("");
  lines.push("PAY NOTES");
  for (const fn of FUNCTIONS) lines.push(`${fn.label}: ${fn.payNote}`);
  lines.push("");
  lines.push("SAMPLE COMPANIES. Not a census. Headcount blank for every one.");
  for (const company of COMPANIES) {
    const places = company.cities
      .map((id) => CITIES.find((city) => city.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    lines.push(`${company.name}. ${company.line}. Cities named in the compilation: ${places}. Functions: ${company.functions.map((id) => fnMeta(id).short).join(", ")}.`);
  }
  lines.push("");
  lines.push(`Newer entrants named in the FY2026 landscape, cities blank: ${NEW_ENTRANTS.join(", ")}.`);
  lines.push("");
  lines.push("RANKINGS ALREADY COMPUTED FROM THIS FILE");
  for (const preset of PRESETS) {
    const result = buildResult(preset.mandate);
    const order = result.ranked.map((row, index) => `${index + 1} ${row.city.name} fit ${row.fit} talent ${row.talent}`).join("; ");
    lines.push(`${preset.label}. ${preset.mandate.headcount} people. ${order}. ${result.dek}`);
  }
  const cost400 = buildResult({ ...PRESETS[2].mandate, headcount: 400 });
  lines.push(
    `Engineering, cost first, 400 people. ${cost400.ranked.map((row, index) => `${index + 1} ${row.city.name} fit ${row.fit}`).join("; ")}. ${cost400.dek}`,
  );
  return lines.join("\n");
}
