import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const FULL = process.argv.includes("--full");
const failures = [];
const fail = (message) => failures.push(message);
const norm = (p) => p.split("\\").join("/");

if (!existsSync(DIST)) {
  console.error("dist/ not found. Run `npm run build` first.");
  process.exit(2);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(DIST).map(norm);
const pages = files.filter((f) => f.endsWith(".html") && !f.startsWith(`${DIST}/pagefind/`));
const words = JSON.parse(readFileSync("src/data/words.json", "utf8"));
const ids = words.map((w) => w.id);
const categories = [...new Set(words.map((w) => w.category))];

const titles = new Map();
const descriptions = new Map();

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const is404 = page.endsWith("/404.html");
  if (!/<html[^>]*lang=["']?es/.test(html)) fail(`${page}: missing lang="es"`);
  const titleMatches = html.match(/<title>[^<]+<\/title>/g) ?? [];
  if (titleMatches.length !== 1)
    fail(`${page}: expected exactly one <title>, found ${titleMatches.length}`);
  else if (titles.has(titleMatches[0]))
    fail(`${page}: duplicate title also used by ${titles.get(titleMatches[0])}`);
  else titles.set(titleMatches[0], page);
  const h1Matches = html.match(/<h1[\s>]/g) ?? [];
  if (h1Matches.length !== 1) fail(`${page}: expected exactly one <h1>, found ${h1Matches.length}`);
  const description = html.match(/<meta[^>]*name=["']?description["']?[^>]*content="([^"]*)"/);
  if (!description) fail(`${page}: missing meta description`);
  else if (descriptions.has(description[1]))
    fail(`${page}: duplicate description also used by ${descriptions.get(description[1])}`);
  else descriptions.set(description[1], page);
  if (!is404 && !/<link[^>]*rel=["']?canonical["']?/.test(html))
    fail(`${page}: missing canonical link`);
}

for (const id of ids) {
  const page = `${DIST}/palabra/${id}/index.html`;
  if (!existsSync(page)) {
    fail(`missing word page for "${id}"`);
    continue;
  }
  const html = readFileSync(page, "utf8");
  if (!html.includes('data-testid="definition"')) fail(`${page}: missing definition hook`);
  const ld = html.match(/<script type="application\/ld\+json">([^<]*)<\/script>/);
  if (!ld) fail(`${page}: missing JSON-LD`);
  else {
    try {
      if (JSON.parse(ld[1])["@type"] !== "DefinedTerm")
        fail(`${page}: JSON-LD @type is not DefinedTerm`);
    } catch {
      fail(`${page}: JSON-LD is not valid JSON`);
    }
  }
}
const wordDirs = files
  .filter((f) => /^dist\/palabra\/[^/]+\/index\.html$/.test(f))
  .map((f) => f.split("/")[2]);
for (const dir of wordDirs) if (!ids.includes(dir)) fail(`unexpected word page "${dir}"`);

// Every internal word link on every page must point to a page that exists.
for (const page of pages) {
  const html = readFileSync(page, "utf8");
  for (const match of html.matchAll(/href=["']\/palabra\/([a-z0-9-]+)\/["']/g)) {
    if (!ids.includes(match[1]))
      fail(`${page}: links to a word page that does not exist: ${match[1]}`);
  }
}

for (const category of categories) {
  if (!existsSync(`${DIST}/categoria/${category}/index.html`))
    fail(`missing category page "${category}"`);
}
if (!existsSync(`${DIST}/a-z/index.html`)) fail("missing /a-z/ page");

if (FULL) {
  for (const required of [
    "sitemap-index.xml",
    "sitemap-0.xml",
    "robots.txt",
    "llms.txt",
    "404.html",
    "_headers",
  ]) {
    if (!existsSync(`${DIST}/${required}`)) fail(`missing ${required}`);
  }
  if (existsSync(`${DIST}/sitemap-0.xml`)) {
    const sitemap = readFileSync(`${DIST}/sitemap-0.xml`, "utf8");
    for (const id of ids)
      if (!sitemap.includes(`/palabra/${id}/</loc>`)) fail(`sitemap missing "${id}"`);
    if (sitemap.includes("/404")) fail("sitemap lists the 404 page");
  }
  if (existsSync(`${DIST}/llms.txt`)) {
    const llms = readFileSync(`${DIST}/llms.txt`, "utf8");
    for (const match of llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
      const path = new URL(match[1]).pathname;
      const target = path.endsWith("/") ? `${DIST}${path}index.html` : `${DIST}${path}`;
      if (!existsSync(target)) fail(`llms.txt links to a missing page: ${match[1]}`);
    }
  }
  if (!existsSync(`${DIST}/pagefind/pagefind.js`))
    fail("missing pagefind index (dist/pagefind/pagefind.js)");
}

if (failures.length > 0) {
  console.error(`check-dist: ${failures.length} problem(s)`);
  for (const message of failures) console.error(` - ${message}`);
  process.exit(1);
}
console.log(`check-dist: OK (${pages.length} pages${FULL ? ", full" : ""})`);
