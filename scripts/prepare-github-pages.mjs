import fs from "node:fs";
import path from "node:path";

const source = process.argv[2] || "public";
const out = process.argv[3] || "site";

fs.rmSync(out, { recursive: true, force: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

copyDir(source, out);

const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
}
walk(out);

const rels = files
  .map((file) => path.relative(out, file).split(path.sep).join("/"))
  .sort((a, b) => b.length - a.length);
const textExt = new Set([".html", ".js", ".css", ".webmanifest", ".svg", ".json"]);

for (const file of files) {
  if (!textExt.has(path.extname(file))) continue;
  let text = fs.readFileSync(file, "utf8");
  const relFile = path.relative(out, file).split(path.sep).join("/");
  const fromDir = path.posix.dirname(relFile);
  const isCss = file.endsWith(".css");
  for (const rel of rels) {
    if (isCss) {
      let target = path.posix.relative(fromDir === "." ? "" : fromDir, rel);
      if (!target.startsWith(".")) target = `./${target}`;
      text = text.split(`url(/${rel})`).join(`url(${target})`);
      text = text.split(`url('/${rel}')`).join(`url('${target}')`);
      text = text.split(`url("/${rel}")`).join(`url("${target}")`);
      text = text.split(`"/${rel}"`).join(`"${target}"`);
      text = text.split(`'/${rel}'`).join(`'${target}'`);
    } else {
      text = text.split(`"/${rel}"`).join(`"${rel}"`);
      text = text.split(`'/${rel}'`).join(`'${rel}'`);
    }
  }
  if (file.endsWith(".html")) {
    text = text.replaceAll('href="/"', 'href="./"');
    text = text.replaceAll("href='/'", "href='./'");
    text = text.replaceAll(
      'if (video.readyState >= 2) video.classList.add("is-ready");',
      'if (video.readyState >= 2 && !video.classList.contains("is-ready")) video.classList.add("is-ready");',
    );
  }
  fs.writeFileSync(file, text);
}

fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log(`Prepared ${files.length} files in ${out}`);
