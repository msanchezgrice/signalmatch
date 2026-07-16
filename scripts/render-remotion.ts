import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

import { SIGNALMATCH_VIDEO_BRIEFS } from "../remotion/briefs";
import {
  VIDEO_VARIANTS,
  compositionIdFor,
  type VideoVariant,
} from "../remotion/video-config";

const args = process.argv.slice(2);
const renderAll = args.includes("--all");

function valueAfter(flag: string) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

const requestedSlug = valueAfter("--brief") ?? SIGNALMATCH_VIDEO_BRIEFS[0].slug;
const requestedVariant = (valueAfter("--variant") ??
  "horizontal") as VideoVariant;

if (!(requestedVariant in VIDEO_VARIANTS)) {
  throw new Error(
    `Unknown variant "${requestedVariant}". Choose horizontal, square, or vertical.`,
  );
}

const briefs = renderAll
  ? SIGNALMATCH_VIDEO_BRIEFS
  : SIGNALMATCH_VIDEO_BRIEFS.filter((brief) => brief.slug === requestedSlug);
const variants = renderAll
  ? (Object.keys(VIDEO_VARIANTS) as VideoVariant[])
  : [requestedVariant];

if (briefs.length === 0) {
  throw new Error(`Unknown brief "${requestedSlug}".`);
}

for (const brief of briefs) {
  const outputDirectory = join("artifacts", "remotion", brief.slug);
  mkdirSync(outputDirectory, { recursive: true });

  for (const variant of variants) {
    const output = join(outputDirectory, `${variant}.mp4`);
    const result = spawnSync(
      "pnpm",
      [
        "exec",
        "remotion",
        "render",
        "remotion/index.ts",
        compositionIdFor(variant),
        output,
        `--props=${JSON.stringify(brief)}`,
        "--codec=h264",
        "--crf=18",
      ],
      { stdio: "inherit" },
    );

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  }
}
