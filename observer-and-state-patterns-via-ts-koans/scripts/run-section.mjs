import { access, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { spawn } from "node:child_process";

const section = process.argv[2];

if (!section) {
  console.error("Usage: npm run koans:section -- <section-directory>");
  console.error("Example: npm run koans:section -- 01-observer");
  process.exit(1);
}

const sectionDirectory = fileURLToPath(new URL(`../koans/${section}/`, import.meta.url));

try {
  await access(sectionDirectory);
} catch {
  console.error(`Unknown koan section: ${section}`);
  process.exit(1);
}

async function collectTests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectTests(path));
    } else if (entry.isFile() && entry.name.endsWith(".test.ts")) {
      files.push(path);
    }
  }

  return files.sort();
}

const files = await collectTests(sectionDirectory);

if (files.length === 0) {
  console.error(`No koan test files found for section: ${section}`);
  process.exit(1);
}

const child = spawn(process.execPath, ["--test", ...files], {
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
