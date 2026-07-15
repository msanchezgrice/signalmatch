export const VIDEO_FPS = 30;
export const VIDEO_DURATION_SECONDS = 60;
export const VIDEO_DURATION_IN_FRAMES = VIDEO_FPS * VIDEO_DURATION_SECONDS;

export const VIDEO_VARIANTS = {
  horizontal: { width: 1920, height: 1080 },
  square: { width: 1080, height: 1080 },
  vertical: { width: 1080, height: 1920 },
} as const;

export type VideoVariant = keyof typeof VIDEO_VARIANTS;

export function compositionIdFor(variant: VideoVariant) {
  return `SignalMatch${variant[0].toUpperCase()}${variant.slice(1)}`;
}
