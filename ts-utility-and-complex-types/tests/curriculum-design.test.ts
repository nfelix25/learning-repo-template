import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("curriculum-design skill artifacts", () => {
  it("keeps Codex and Claude Code skill definitions equivalent", () => {
    const codexSkill = read("../.codex/skills/curriculum-design/SKILL.md");
    const claudeSkill = read("../.claude/skills/curriculum-design/SKILL.md");

    expect(codexSkill).toBe(claudeSkill);
    expect(codexSkill).toContain("name: curriculum-design");
    expect(codexSkill).toContain("Do not fetch sources");
    expect(codexSkill).toContain("Do not write files");
    expect(codexSkill).toContain("Do not include `sources` or `outline`");
    expect(codexSkill).toContain("Treat the syllabus as a draft");
  });

  it("keeps the TS generics fixture aligned with the canonical dry-run", () => {
    const input = read("../fixtures/curriculum-design/ts-generics-input.md");
    const expected = read("../fixtures/curriculum-design/ts-generics-expected.yaml");
    const lessonIds = [...expected.matchAll(/^\s+- id: /gm)];

    expect(input).toContain("TypeScript generics");
    expect(input).toContain("Hybrid");
    expect(input).toContain("Typed `Result<E, T>` library");
    expect(expected).toContain("phase_1_koans:");
    expect(expected).toContain("phase_2_build:");
    expect(expected).toContain("id: 05-variance");
    expect(expected).toContain("id: 10-infer");
    expect(expected).toContain("currency: versioned");
    expect(expected).toContain("id: 13-recursive-conditionals");
    expect(expected).toContain("id: 15-result-async-and-polish");
    expect(expected).not.toContain("sources:");
    expect(expected).not.toContain("outline:");
    expect(lessonIds).toHaveLength(15);
  });
});
