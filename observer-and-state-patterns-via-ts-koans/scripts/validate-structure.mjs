import { access, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const requiredDirectories = [
  "src",
  "koans",
  "notes",
  "koans/helpers",
  "koans/01-observer",
  "koans/02-observable",
  "koans/03-state",
  "koans/04-state-machine",
  "koans/05-signals",
  "koans/06-reactive-graph",
  "koans/07-comparisons",
  "src/observer",
  "src/observable",
  "src/state",
  "src/state-machine",
  "src/signals",
  "src/comparisons"
];

const requiredFiles = [
  "README.md",
  "LESSON_MAP.md"
];

const missing = [];

for (const file of requiredFiles) {
  try {
    await access(new URL(`../${file}`, import.meta.url));
  } catch {
    missing.push(file);
  }
}

for (const directory of requiredDirectories) {
  try {
    await access(new URL(`../${directory}/`, import.meta.url));
  } catch {
    missing.push(directory);
  }
}

async function collectTests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const child = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectTests(child));
    } else if (entry.isFile() && entry.name.endsWith(".test.ts")) {
      files.push(child);
    }
  }

  return files;
}

let testFiles = [];
try {
  testFiles = await collectTests(fileURLToPath(new URL("../koans/", import.meta.url)));
} catch {
  missing.push("koans/**/*.test.ts");
}

if (testFiles.length === 0) {
  missing.push("at least one koan test");
}

if (missing.length > 0) {
  console.error("Repository structure is incomplete:");
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log(`Repository structure is valid. Found ${testFiles.length} koan test files.`);
