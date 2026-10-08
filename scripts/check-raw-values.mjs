// Guardrail: no raw colors, no raw <button>, no off-scale pixel values in app code.
// Tokens come from Figma via Style Dictionary; components come from src/components.
// Fails the build when generated UI bypasses either.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "src";
const SKIP = [/^src\/tokens\//, /\.test\.tsx?$/, /\.stories\.tsx?$/];
const RULES = [
  { name: "raw hex color", re: /#[0-9a-fA-F]{3,8}\b/g, allowIn: [] },
  { name: "raw rgb()/hsl() color", re: /\b(rgba?|hsla?)\(/g, allowIn: [] },
  { name: "Tailwind default palette", re: /\b(bg|text|border|ring|fill|stroke)-(gray|slate|zinc|neutral|stone|red|green|blue|indigo|emerald|amber|rose|sky)-\d{2,3}\b/g, allowIn: [] },
  { name: "arbitrary color class", re: /\b(bg|text|border|ring)-\[#?[0-9a-fA-F]{3,8}\]/g, allowIn: [] },
  { name: "raw <button>", re: /<button\b/g, allowIn: [/^src\/components\/(Button|Alert|TextLink)\.tsx$/] },
  { name: "raw <input>", re: /<input\b/g, allowIn: [/^src\/components\/(Input|RadioCard)\.tsx$/] },
  { name: "arbitrary px spacing", re: /\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|gap|space-[xy])-\[\d+px\]/g, allowIn: [] },
];

const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(p) && !SKIP.some((s) => s.test(p))) files.push(p);
  }
})(ROOT);

let failures = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  for (const rule of RULES) {
    if (rule.allowIn.some((a) => a.test(file))) continue;
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      if (line.includes("tokens-allow")) return;
      const m = line.match(rule.re);
      if (m) { failures++; console.error(`${file}:${i + 1}  ${rule.name}: ${m[0]}`); }
    });
  }
}
if (failures) { console.error(`\n${failures} raw value(s) found. Use tokens and components.`); process.exit(1); }
console.log(`Token guardrail passed: ${files.length} files, no raw values.`);
