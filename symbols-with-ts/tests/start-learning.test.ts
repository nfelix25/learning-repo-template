import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("start-learning skill artifacts", () => {
  it("keeps Codex and Claude Code skill definitions equivalent", () => {
    const codexSkill = read("../.codex/skills/start-learning/SKILL.md");
    const claudeSkill = read("../.claude/skills/start-learning/SKILL.md");

    expect(codexSkill).toBe(claudeSkill);
    expect(codexSkill).toContain("name: start-learning");
    expect(codexSkill).toContain("3-4 high-signal scoping questions");
    expect(codexSkill).toContain("Recommend `koan`, `build`, or `hybrid`");
    expect(codexSkill).toContain("3-5 build-piece options");
    expect(codexSkill).toContain("Delegate syllabus drafting to `curriculum-design`");
    expect(codexSkill).toContain("connected extensions");
    expect(codexSkill).toContain("Do not write files");
    expect(codexSkill).toContain("content planning, source fetching, research prompt generation, or repo scaffolding");
    expect(codexSkill).toContain("Stop at syllabus approval");
    expect(codexSkill).toContain("`content-planner`");
    expect(codexSkill).toContain("concrete next-step handoff");
  });

  it("keeps the TS generics start-learning fixture aligned with the canonical flow", () => {
    const fixture = read("../fixtures/start-learning/ts-generics-flow.md");

    expect(fixture).toContain("/start-learning TypeScript generics");
    expect(fixture).toContain("3-4 high-signal scoping questions");
    expect(fixture).toContain("Goal: deep mechanics plus library-author level");
    expect(fixture).toContain("Scope boundary: include conditional types and `infer`; exclude utility types");
    expect(fixture).toContain("Expected recommendation: Hybrid");
    expect(fixture).toContain("Typed Result library with combinators");
    expect(fixture).toContain("`Result<E, T>` plus `map`, `flatMap`, `mapErr`, `Result.all`, and `Result.fromPromise`");
    expect(fixture).toContain("Pass these inputs to `curriculum-design`");
    expect(fixture).toContain("Branded types before `11-result-type-design`");
    expect(fixture).toContain("name `content-planner` as the concrete next-step handoff");
    expect(fixture).toContain("No files written");
    expect(fixture).toContain("Do not run `content-planner`");
  });
});
