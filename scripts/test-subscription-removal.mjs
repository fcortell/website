import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the built about and post pages do not show the subscription box", async () => {
  for (const page of [
    "dist/about/index.html",
    "dist/posts/2026/robert-pattinson-james-bond/index.html",
    "dist/posts/2023/old/tvguia-tv-guide-app/index.html",
  ]) {
    const html = await readFile(page, "utf8");
    assert.doesNotMatch(html, /id="newsletter-form"/, page);
    assert.doesNotMatch(html, /New posts, shipping stories, and nerdy links/, page);
    assert.match(html, page.includes("/about/") ? /Stay Connected/ : /id="article"/, page);
  }
});
