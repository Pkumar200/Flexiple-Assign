import { PRESETS, cityById } from "./data";
import { annualPay, buildResult } from "./engine";
import { ask } from "./ask";
import { inventedNumbers } from "./guard";

function assert(cond: unknown, message: string): void {
  if (!cond) throw new Error(message);
}

const sensible = buildResult(PRESETS[0].mandate);
const bench = buildResult(PRESETS[1].mandate);
const cost = buildResult(PRESETS[2].mandate);
const cost400 = buildResult({ ...PRESETS[2].mandate, headcount: 400 });
const bfsi = buildResult(PRESETS[3].mandate);
const chips = buildResult(PRESETS[4].mandate);
const plant = buildResult(PRESETS[5].mandate);

console.log("\nSensible engineering");
for (const row of sensible.ranked) console.log(`  ${row.city.name} ${row.fit} talent ${row.talent} penalty ${row.penalty}`);
console.log(sensible.dek, "\n");

console.log("Deepest bench");
for (const row of bench.ranked) console.log(`  ${row.city.name} ${row.fit}`);
console.log("\nCost first, 150");
for (const row of cost.ranked) console.log(`  ${row.city.name} ${row.fit}`);
console.log("\nCost first, 400");
for (const row of cost400.ranked) console.log(`  ${row.city.name} ${row.fit}`);
console.log("\nBFSI");
for (const row of bfsi.ranked) console.log(`  ${row.city.name} ${row.fit} cost parts ${row.parts.map((p) => p.key).join(",")}`);
console.log("\nChips");
for (const row of chips.ranked) console.log(`  ${row.city.name} ${row.fit}`);
console.log("\nIndustrial");
for (const row of plant.ranked) console.log(`  ${row.city.name} ${row.fit}`);

assert(sensible.ranked[0].city.id === "hyderabad", `sensible winner was ${sensible.ranked[0].city.name}`);
assert(bench.ranked[0].city.id === "bengaluru", `bench winner was ${bench.ranked[0].city.name}`);
assert(cost.ranked[0].city.id === "chennai", `cost winner was ${cost.ranked[0].city.name}`);
assert(cost400.ranked[0].city.id === "hyderabad", `cost400 winner was ${cost400.ranked[0].city.name}`);
assert(bfsi.ranked[0].city.id === "hyderabad", `bfsi winner was ${bfsi.ranked[0].city.name}`);
assert(bfsi.costDropped, "bfsi should drop pay");
assert(!bfsi.ranked[0].parts.some((part) => part.key === "cost"), "bfsi parts still contain pay");
assert(chips.ranked[0].city.id === "hyderabad" || chips.ranked[0].city.id === "bengaluru", "chips winner");
assert(!chips.ranked[0].parts.some((part) => part.key === "cost"), "chips should not use software pay");
assert(plant.ranked[0].city.id === "pune", `plant winner was ${plant.ranked[0].city.name}`);

const blr = cityById("bengaluru");
const chn = cityById("chennai");
const payGap = (annualPay(blr.engineerMedian, 150) - annualPay(chn.engineerMedian, 150)) / 1e7;
assert(Math.abs(payGap - 12.15) < 0.001, `pay gap ${payGap}`);

const goldman = ask("How many people does Goldman Sachs employ in India?");
assert(goldman.refused, "goldman should refuse");
assert(/blank/i.test(goldman.title), "goldman title");

const harbour = ask("Does the safe harbour change favour Bengaluru?");
assert(/does not pick a city/i.test(harbour.title), harbour.title);

const karnataka = ask("What GCC incentives does Karnataka offer in Bengaluru?");
assert(/wrong city|Beyond Bengaluru/i.test(karnataka.paragraphs.join(" ")), "karnataka cliff");

const compare = ask("Compare Bengaluru and Chennai for engineering pay");
assert(/12\.15 crore/.test(compare.paragraphs.join(" ")), compare.paragraphs.join(" | "));

const tier = ask("Should a first GCC go to Coimbatore?");
assert(/does not rank/i.test(tier.paragraphs.join(" ")), "tier 2");

const census = ask("How many GCCs are in India?");
assert(/2,117/.test(census.paragraphs.join(" ")), "census");
assert(/1,855/.test(census.paragraphs.join(" ")), "restatement");

assert(
  inventedNumbers("Goldman employs 8,400 people in India.", "Goldman Sachs is in the sample. Headcount is blank.").includes("8400"),
  "guard should catch an invented headcount",
);
assert(inventedNumbers("India has 2,117 GCCs.", "2,117 GCC organisations").length === 0, "2,117 is in the file");

console.log("\nAll checks passed.");
