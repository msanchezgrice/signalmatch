import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const hub = read("../src/app/(marketing)/resources/page.tsx");
const article = read("../src/app/(marketing)/resources/[slug]/page.tsx");
const content = read("../content/editorial/wave2-content.json");
const css = read("../src/app/(marketing)/resources/editorial.module.css");

test("resources hide internal labels and define complete share metadata", () => {
  assert.doesNotMatch(`${hub}\n${article}\n${content}`, /2,?000\+?\s*word|<strong>pillar:|>pillar|\bspec\b/i);
  for (const source of [hub, article]) { assert.match(source, /images/); assert.match(source, /twitter/); }
});

test("resources match SignalMatch's dark purple marketplace system responsively", () => {
  assert.match(css, /#08070f/i);
  assert.match(css, /#7c5cff/i);
  assert.match(css, /@media\(max-width:640px\)/);
});
