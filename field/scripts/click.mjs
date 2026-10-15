import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
  args: ["--disable-gpu"],
});
const page = await browser.newPage();
page.setDefaultTimeout(15000);
await page.setViewport({ width: 1440, height: 1100 });
await page.goto("http://localhost:5173/#mandate", { waitUntil: "domcontentloaded" });
await page.waitForSelector("h1");

async function clickText(text) {
  const ok = await page.evaluate((label) => {
    const btn = [...document.querySelectorAll("button")].find((el) => el.textContent.includes(label));
    if (!btn) return false;
    btn.click();
    return true;
  }, text);
  if (!ok) throw new Error(`no button: ${text}`);
}

const first = await page.$eval("h1", (el) => el.textContent.trim());
await clickText("Engineering, cost first");
await page.waitForFunction(() => document.querySelector("h1")?.textContent?.includes("Chennai"));
const cost = await page.$eval("h1", (el) => el.textContent.trim());
await clickText("Scale · 400");
await page.waitForFunction(() => document.querySelector("h1")?.textContent?.includes("Hyderabad"));
const scaled = await page.$eval(".dek", (el) => el.textContent);
await clickText("BFSI operations");
await page.waitForFunction(() => document.body.innerText.includes("set aside"));
const bfsi = await page.$eval(".dek", (el) => el.textContent);
const blank = await page.evaluate(() => document.body.innerText.includes("Blank"));
await page.goto("http://localhost:5173/#ask", { waitUntil: "domcontentloaded" });
await page.waitForSelector("h2");
const declined = await page.$eval("h2", (el) => el.textContent.trim());
await page.locator("#q").fill("Compare Bengaluru and Chennai");
await page.click("button.solid");
await page.waitForFunction(() => document.body.innerText.includes("12.15"));
const compared = await page.$eval("h2", (el) => el.textContent.trim());

console.log(JSON.stringify({ first, cost, scaledFlip: scaled.includes("400"), bfsiDropped: bfsi.includes("set aside"), blank, declined, compared }, null, 2));
await browser.close();
