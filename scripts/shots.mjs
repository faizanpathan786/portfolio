// One-off tool to (re)capture project screenshots into /public/projects.
// Requires playwright (not a build dependency):
//   npm i -D playwright && npx playwright install chromium && node scripts/shots.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/projects");

const sites = [
  { name: "linkedinflow", url: "https://linkedinflowfe.vercel.app/" },
  { name: "rivaleye", url: "https://rivaleye.app/" },
  { name: "elitebadge", url: "https://elite-badge-media.vercel.app/" },
  { name: "ayushflower", url: "https://ayushflowermerchant.vercel.app/" },
  { name: "shadabportfolio", url: "https://shadabportfolio.vercel.app/" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const site of sites) {
  const page = await ctx.newPage();
  try {
    console.log(`→ ${site.name}: loading ${site.url}`);
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(3500); // let animations/hero settle
    const out = path.join(outDir, `${site.name}.png`);
    await page.screenshot({ path: out });
    console.log(`✓ ${site.name} saved`);
  } catch (e) {
    console.log(`✗ ${site.name} FAILED: ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("done");
