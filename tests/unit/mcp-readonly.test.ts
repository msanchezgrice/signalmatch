import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

describe("MCP read-only guard", () => {
  it("tools module does not import write layer", () => {
    const source = readFileSync(
      join(process.cwd(), "src/server/mcp/tools.ts"),
      "utf8",
    );

    expect(source).not.toContain("/db/write");
    expect(source).not.toContain("createCampaign(");
    expect(source).not.toContain("inviteCreatorToCampaign(");
    expect(source).not.toContain("rotateProductApiKey(");
  });

  it("registers expected read-only tools", () => {
    const source = readFileSync(
      join(process.cwd(), "src/server/mcp/tools.ts"),
      "utf8",
    );

    [
      "search_creators",
      "get_creator",
      "search_campaigns",
      "get_campaign",
      "list_my_campaigns",
      "get_my_campaign_analytics",
      "list_my_partnerships",
    ].forEach((toolName) => {
      expect(source).toContain(toolName);
    });
  });
});
