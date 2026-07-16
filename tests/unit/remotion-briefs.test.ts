import { describe, expect, it } from "vitest";

import { SIGNALMATCH_VIDEO_BRIEFS } from "../../remotion/briefs";
import { VIDEO_VARIANTS } from "../../remotion/video-config";

describe("SignalMatch Remotion briefs", () => {
  it("covers all ten editorial launch pieces", () => {
    expect(SIGNALMATCH_VIDEO_BRIEFS).toHaveLength(10);
    expect(
      new Set(SIGNALMATCH_VIDEO_BRIEFS.map((brief) => brief.slug)).size,
    ).toBe(10);
  });

  it("includes a complete narrative and live resource URL for every brief", () => {
    for (const brief of SIGNALMATCH_VIDEO_BRIEFS) {
      expect(brief.hook.length).toBeGreaterThan(20);
      expect(brief.beats).toHaveLength(3);
      expect(brief.cta.length).toBeGreaterThan(5);
      expect(brief.resourceUrl).toBe(
        `https://www.signalmatch.me/resources/${brief.slug}`,
      );
    }
  });

  it("ships horizontal, square, and vertical render targets", () => {
    expect(VIDEO_VARIANTS).toEqual({
      horizontal: { width: 1920, height: 1080 },
      square: { width: 1080, height: 1080 },
      vertical: { width: 1080, height: 1920 },
    });
  });
});
