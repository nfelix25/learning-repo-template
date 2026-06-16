import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("content-planning skill artifacts", () => {
  it("keeps Codex and Claude Code content-planner definitions equivalent", () => {
    const codexSkill = read("../.codex/skills/content-planner/SKILL.md");
    const claudeSkill = read("../.claude/skills/content-planner/SKILL.md");

    expect(codexSkill).toBe(claudeSkill);
    expect(codexSkill).toContain("name: content-planner");
    expect(codexSkill).toContain("Approved syllabus YAML");
    expect(codexSkill).toContain("Do not redo topic scoping");
    expect(codexSkill).toContain("outline");
    expect(codexSkill).toContain("intro");
    expect(codexSkill).toContain("mechanic");
    expect(codexSkill).toContain("worked_example");
    expect(codexSkill).toContain("pitfalls");
    expect(codexSkill).toContain("exercise_setup");
    expect(codexSkill).toContain("call `source-fetcher`");
    expect(codexSkill).toContain("`versioned` and `frontier`");
    expect(codexSkill).toContain("Active fetching is not required");
    expect(codexSkill).toContain("research-prompt-generator");
    expect(codexSkill).toContain("digest table");
    expect(codexSkill).toContain("Do not write files");
  });

  it("keeps Codex and Claude Code source-fetcher definitions equivalent", () => {
    const codexSkill = read("../.codex/skills/source-fetcher/SKILL.md");
    const claudeSkill = read("../.claude/skills/source-fetcher/SKILL.md");

    expect(codexSkill).toBe(claudeSkill);
    expect(codexSkill).toContain("name: source-fetcher");
    expect(codexSkill).toContain("Official documentation");
    expect(codexSkill).toContain("Specifications");
    expect(codexSkill).toContain("Release notes");
    expect(codexSkill).toContain("High-signal named-expert");
    expect(codexSkill).toContain("Aggregators");
    expect(codexSkill).toContain("Tutorial farms");
    expect(codexSkill).toContain("AI-generated content sites");
    expect(codexSkill).toContain("Anonymous tutorials");
    expect(codexSkill).toContain("fetched");
    expect(codexSkill).toContain("version_checked");
    expect(codexSkill).toContain("conflicts_or_caveats");
    expect(codexSkill).toContain("sources_md_draft");
    expect(codexSkill).toContain("Do not write files");
  });

  it("keeps the TS generics content-planning fixture aligned with canonical markers", () => {
    const fixture = read("../fixtures/content-planning/ts-generics-plan.md");

    expect(fixture).toContain("TypeScript generics");
    expect(fixture).toContain("Approved lesson count: 15");
    expect(fixture).toContain("must not redo topic scoping");
    expect(fixture).toContain("intro");
    expect(fixture).toContain("mechanic");
    expect(fixture).toContain("worked_example");
    expect(fixture).toContain("pitfalls");
    expect(fixture).toContain("exercise_setup");
    expect(fixture).toContain("source-fetcher is not required");
    expect(fixture).toContain("`10-infer`: verify `infer extends`");
    expect(fixture).toContain("`13-recursive-conditionals`: verify recursion depth limits");
    expect(fixture).toContain("reject aggregators, tutorial farms, AI-generated content sites, anonymous tutorials, and Stack Overflow");
    expect(fixture).toContain("URL, role, fetched date, version checked");
    expect(fixture).toContain("`05-variance`");
    expect(fixture).toContain("`11-result-type-design`");
    expect(fixture).toContain("research_prompt_queued: true");
    expect(fixture).toContain("15 rows total");
    expect(fixture).toContain("No files written");
    expect(fixture).toContain("research-prompt-generator");
    expect(fixture).toContain("repo-scaffold");
  });
});
