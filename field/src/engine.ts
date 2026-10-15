import {
  CITIES,
  City,
  Headcount,
  Mandate,
  SQFT_PER_PERSON,
  Weights,
  fnMeta,
  peersFor,
} from "./data";

export interface Part {
  key: keyof Weights;
  label: string;
  weight: number;
  value: number;
  note: string;
}

export interface Ranked {
  city: City;
  fit: number;
  talent: number;
  parts: Part[];
  penalty: number;
  space: number;
  spaceNote: string;
  speed: number;
  room: number;
  costValue: number | null;
  peers: { name: string; line: string }[];
}

export interface RankResult {
  mandate: Mandate;
  ranked: Ranked[];
  costDropped: boolean;
  headline: string;
  dek: string;
  scaleNote: string | null;
  board: string;
}

const CHEAPEST = Math.min(...CITIES.map((c) => c.engineerMedian));

export function formatInr(n: number): string {
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (abs >= 1e7) {
    const cr = abs / 1e7;
    const text = cr.toFixed(2).replace(/0$/, "").replace(/\.0$/, "");
    return `${sign}₹${text} crore`;
  }
  return `${sign}₹${Math.round(abs / 1e5)} lakh`;
}

export function annualPay(medianLpa: number, headcount: number): number {
  return medianLpa * 1e5 * headcount;
}

export function annualRent(rentPerSf: number, headcount: number): number {
  return headcount * SQFT_PER_PERSON * rentPerSf * 12;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function spaceFromVacancy(vacancy: number): number {
  return clamp(Math.round(30 + ((vacancy - 8) / 18) * 55), 0, 100);
}

function readings(city: City): { space: number; spaceNote: string; speed: number; room: number } {
  let space = spaceFromVacancy(city.vacancy);
  let spaceNote = `Floor reading ${space}, mapped from ${city.vacancy}% vacancy. Eight percent maps near 30, 26 percent maps near 85. A reading for the rank, not a second statistic.`;
  if (city.id === "mumbai") {
    space = clamp(space - 12, 0, 100);
    spaceNote = `City vacancy of ${city.vacancy}% is mapped to a floor reading, then cut by 12. That vacancy includes Thane and Navi Mumbai. BKC is a different market. The cut is a judgment, and it is shown.`;
  }
  const speed = Math.round(0.45 * city.ecosystem + 0.55 * space);
  const room = Math.round(0.65 * (100 - city.competition) + 0.35 * space);
  return { space, spaceNote, speed, room };
}

function costOf(city: City): number {
  return (CHEAPEST / city.engineerMedian) * 100;
}

export function rank(mandate: Mandate): Ranked[] {
  const fn = fnMeta(mandate.functionId);
  const usePay = fn.pay !== "none";

  return CITIES.map((city) => {
    const talent = city.talent[mandate.functionId];
    const { space, spaceNote, speed, room } = readings(city);
    const costValue = usePay ? costOf(city) : null;
    const parts: Part[] = [];

    const consider: { key: keyof Weights; label: string; value: number; note: string }[] = [
      {
        key: "talent",
        label: "Talent",
        value: talent,
        note: "Reading of the published cluster for this function. Not a headcount.",
      },
      {
        key: "cost",
        label: "Pay",
        value: costValue ?? 0,
        note: usePay
          ? `100 × the cheapest median (${CHEAPEST}) ÷ this city's median (${city.engineerMedian}). A city that costs twice as much scores about half.`
          : "Dropped.",
      },
      {
        key: "speed",
        label: "Speed",
        value: speed,
        note: "45 percent setup density, 55 percent the floor reading.",
      },
      {
        key: "incentives",
        label: "Incentives",
        value: city.incentive,
        note: city.incentiveNote,
      },
      {
        key: "room",
        label: "Room",
        value: room,
        note: "65 percent the inverse of the hiring fight, 35 percent the floor reading.",
      },
    ];

    for (const item of consider) {
      const weight = mandate.weights[item.key];
      if (weight <= 0) continue;
      if (item.key === "cost" && !usePay) continue;
      parts.push({
        key: item.key,
        label: item.label,
        weight,
        value: Math.round(item.value),
        note: item.note,
      });
    }

    const weightSum = parts.reduce((sum, part) => sum + part.weight, 0);
    const avg =
      weightSum === 0 ? 0 : parts.reduce((sum, part) => sum + part.value * part.weight, 0) / weightSum;
    const penalty = mandate.headcount >= 400 && talent < 72 ? 8 : 0;

    return {
      city,
      fit: Math.round(avg - penalty),
      talent,
      parts,
      penalty,
      space,
      spaceNote,
      speed,
      room,
      costValue,
      peers: peersFor(city.id, mandate.functionId).map((peer) => ({
        name: peer.name,
        line: peer.line,
      })),
    };
  }).sort((a, b) => b.fit - a.fit || b.talent - a.talent);
}

function versus(other: City, winner: City, headcount: number): string {
  const pay = annualPay(other.engineerMedian, headcount) - annualPay(winner.engineerMedian, headcount);
  const rent = annualRent(other.rent, headcount) - annualRent(winner.rent, headcount);
  const payWord = `${formatInr(Math.abs(pay))} ${pay >= 0 ? "more" : "less"} a year in median base`;
  const rentWord = `${formatInr(Math.abs(rent))} ${rent >= 0 ? "more" : "less"} in rent`;
  return `${other.name} costs ${payWord} than ${winner.name}, and ${rentWord}`;
}

export function buildResult(mandate: Mandate): RankResult {
  const ranked = rank(mandate);
  const fn = fnMeta(mandate.functionId);
  const top = ranked[0];
  const second = ranked[1];
  const bengaluru = ranked.find((row) => row.city.id === "bengaluru")!;
  const costDropped = fn.pay === "none" && mandate.weights.cost > 0;

  const sentences: string[] = [];
  sentences.push(
    `${top.city.name} ranks first for a ${mandate.headcount}-person ${fn.label.toLowerCase()} centre on these weights. ${second.city.name} is next.`,
  );

  if (fn.pay !== "none" && top.city.id !== "bengaluru") {
    sentences.push(
      `${versus(bengaluru.city, top.city, mandate.headcount)}. Rent assumes ${SQFT_PER_PERSON} sq ft a person. Bengaluru's talent reading is still the highest, at ${bengaluru.talent}.`,
    );
  } else if (fn.pay !== "none") {
    sentences.push(`${versus(second.city, top.city, mandate.headcount)}. Rent assumes ${SQFT_PER_PERSON} sq ft a person.`);
  }

  if (fn.pay === "none") {
    const deepest = ranked.reduce((best, row) => (row.talent > best.talent ? row : best));
    if (deepest.city.id !== top.city.id) {
      sentences.push(
        `${deepest.city.name} has the higher talent reading, ${deepest.talent} against ${top.talent}. The other weights are what put ${top.city.name} first.`,
      );
    }
  }

  if (costDropped) {
    sentences.push(`Pay was weighted at ${mandate.weights.cost} and then set aside. ${fn.payNote}`);
  } else if (fn.pay === "proxy") {
    sentences.push(fn.payNote);
  }

  const otherCount: Headcount = mandate.headcount === 400 ? 150 : 400;
  const otherTop = rank({ ...mandate, headcount: otherCount })[0];
  let scaleNote: string | null = null;
  if (otherTop.city.id !== top.city.id) {
    scaleNote = `At ${otherCount} people the first place flips to ${otherTop.city.name}. Once a centre is 400 people, any city with a talent reading under 72 loses 8 fit points.`;
  }
  if (scaleNote) sentences.push(scaleNote);

  return {
    mandate,
    ranked,
    costDropped,
    headline: `${top.city.name}.`,
    dek: sentences.join(" "),
    scaleNote,
    board: writeBoard(mandate, ranked, costDropped, scaleNote),
  };
}

function writeBoard(
  mandate: Mandate,
  ranked: Ranked[],
  costDropped: boolean,
  scaleNote: string | null,
): string {
  const fn = fnMeta(mandate.functionId);
  const lines: string[] = [];
  lines.push(`Field shortlist — ${fn.label}, ${mandate.headcount} people`);
  lines.push("");
  lines.push(
    `Weights: talent ${mandate.weights.talent}, pay ${mandate.weights.cost}, speed ${mandate.weights.speed}, incentives ${mandate.weights.incentives}, room ${mandate.weights.room}. A weight of 0 is ignored.`,
  );
  if (costDropped) lines.push(`Pay was set aside. ${fn.payNote}`);
  if (fn.pay === "proxy") lines.push(fn.payNote);
  lines.push("");
  ranked.forEach((row, index) => {
    const pay =
      fn.pay === "none"
        ? "Pay: blank"
        : `Software median ₹${row.city.engineerMedian}L${fn.pay === "proxy" ? " (proxy)" : ""}`;
    lines.push(
      `${index + 1}. ${row.city.name} — fit ${row.fit}${row.penalty ? `, including −${row.penalty}` : ""}. Talent reading ${row.talent}. ${pay}. Rent ₹${row.city.rent}/sf. Vacancy ${row.city.vacancy}%.`,
    );
  });
  lines.push("");
  if (scaleNote) lines.push(scaleNote);
  lines.push(
    `Rent assumes ${SQFT_PER_PERSON} sq ft a person, for scale only. Talent, speed, room and incentives are readings. This is not a site visit, and not a census of 2,117 GCCs. Company headcount is blank on purpose.`,
  );
  return lines.join("\n");
}

export function methodText(): string {
  return "Fit is a weighted average of five readings, each from 0 to 100. Talent is a reading of how deep the published cluster is for this function, not a count of résumés. Pay, when a figure exists, is 100 times the cheapest median divided by this city's median, so a city that costs twice as much scores about half. The most expensive city is not scored as a zero. Speed is 45 percent setup density and 55 percent a floor reading mapped from vacancy. Room is 65 percent the inverse of the hiring fight and 35 percent that floor reading. Incentives are high only where a policy was read. Bengaluru does not inherit line items that apply outside Bengaluru. Delhi NCR stays low because three state notifications have not been read into this file. A weight of 0 drops that reading. If the function has no pay figure, pay is dropped even when it was weighted. At 400 people, any city with a talent reading under 72 loses 8 fit points. Mumbai's floor reading is cut by 12, in the open, because the city vacancy includes markets a GCC will not lease.";
}

export const NATIONAL_NOTE =
  "The Union Budget change to Safe Harbour — a single margin of 15.5 percent, replacing a range of 17 to 24 percent, and a threshold lifted from about $30 million to $200 million — applies in every city. It is kept out of the ranking. A national rule cannot pick a site.";
