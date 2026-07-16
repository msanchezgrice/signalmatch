# SignalMatch video system

The Remotion project turns the ten launch-content briefs into a shared 60-second explainer format. Every brief can render in three variants:

- `horizontal` — 1920×1080
- `square` — 1080×1080
- `vertical` — 1080×1920

Preview all compositions:

```bash
pnpm remotion:studio
```

Render one brief and variant:

```bash
pnpm remotion:render -- --brief creator-cpa-campaign-workbook --variant square
```

Render all 30 outputs:

```bash
pnpm remotion:render:all
```

Rendered MP4 files go to `artifacts/remotion/<brief-slug>/<variant>.mp4` and are intentionally ignored by Git. Edit narrative inputs in `briefs.ts`; visual changes belong in `SignalMatchExplainer.tsx`.
