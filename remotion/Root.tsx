import { Composition } from "remotion";

import { SIGNALMATCH_VIDEO_BRIEFS } from "./briefs";
import { SignalMatchExplainer } from "./SignalMatchExplainer";
import { signalMatchExplainerSchema } from "./schema";
import {
  VIDEO_DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_VARIANTS,
  compositionIdFor,
  type VideoVariant,
} from "./video-config";

const variants = Object.entries(VIDEO_VARIANTS) as Array<
  [VideoVariant, (typeof VIDEO_VARIANTS)[VideoVariant]]
>;

export function RemotionRoot() {
  return (
    <>
      {variants.map(([variant, dimensions]) => (
        <Composition
          key={variant}
          id={compositionIdFor(variant)}
          component={SignalMatchExplainer}
          durationInFrames={VIDEO_DURATION_IN_FRAMES}
          fps={VIDEO_FPS}
          width={dimensions.width}
          height={dimensions.height}
          schema={signalMatchExplainerSchema}
          defaultProps={SIGNALMATCH_VIDEO_BRIEFS[0]}
        />
      ))}
    </>
  );
}
