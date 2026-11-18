import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";

async function blogPosts(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const posts = await Promise.all(
    entries.map(async (entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return blogPosts(file);
      if (entry.name.startsWith("_") || !/\.(md|mdx)$/.test(entry.name)) return [];
      const { data } = matter(await readFile(file, "utf8"));
      return [{ slug: entry.name.replace(/\.(md|mdx)$/, ""), ...data }];
    })
  );
  return posts.flat();
}

test("the built homepage lists the newest published posts without a featured section", async () => {
  const html = await readFile("dist/index.html", "utf8");
  const section = html.match(/<section id="recent-posts"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, "Expected a recent posts section");
  assert.doesNotMatch(html, /<section id="featured"/);

  const slugs = [...section.matchAll(/<a href="\/posts\/[^"]*\/([^/"]+)"/g)].map(
    (match) => match[1]
  );
  const posts = await blogPosts("src/content/blog");
  const available = posts.filter(
    (post) =>
      !post.draft &&
      !post.unlisted &&
      new Date(post.pubDatetime).getTime() < Date.now() + 15 * 60 * 1000
  );
  const expectedDates = available
    .map((post) => new Date(post.pubDatetime).getTime())
    .sort((a, b) => b - a)
    .slice(0, 10);
  const displayed = slugs.map((slug) => available.find((post) => post.slug === slug));

  assert.equal(new Set(slugs).size, slugs.length, "Posts must not appear twice");
  assert.ok(displayed.every(Boolean), "Only available posts should be displayed");
  assert.deepEqual(
    displayed.map((post) => new Date(post.pubDatetime).getTime()),
    expectedDates
  );
});
