import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public marketplace data safety", () => {
  const source = readFileSync("src/server/db/read.ts", "utf8");

  it("keeps seeded creator personas out of public directory queries", () => {
    expect(source).toContain("u.clerk_user_id not like 'seed_%'");
  });

  it("keeps seeded and example-domain campaigns out of public queries", () => {
    expect(source).toContain("owner.clerk_user_id not like 'seed_%'");
    expect(source).toContain("lower(p.url) not like '%example.com%'");
  });
});
