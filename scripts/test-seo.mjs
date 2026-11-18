import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const origin = "https://fcortell.com";

function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (match) => JSON.parse(match[1])
  );
}

function canonical(html) {
  const match = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.ok(match, "Missing canonical URL");
  return match[1];
}

test("homepage and article structured data describe the correct entities", async () => {
  const home = await readFile("dist/index.html", "utf8");
  const homeData = jsonLd(home);
  assert.deepEqual(homeData.map((item) => item["@type"]).sort(), ["Person", "WebSite"]);
  assert.equal(homeData.find((item) => item["@type"] === "Person").name, "Fermín Cortell");
  assert.equal(canonical(home), `${origin}/`);

  const article = await readFile("dist/posts/2026/robert-pattinson-james-bond/index.html", "utf8");
  const articleData = jsonLd(article);
  const url = `${origin}/posts/2026/robert-pattinson-james-bond`;
  assert.equal(canonical(article), url);
  assert.equal(articleData.length, 1);
  assert.equal(articleData[0]["@type"], "BlogPosting");
  assert.equal(articleData[0].mainEntityOfPage["@id"], url);
  assert.equal(articleData[0].author.name, "Fermín Cortell");
  assert.ok(!Number.isNaN(Date.parse(articleData[0].datePublished)));
  assert.match(article, /<meta property="og:type" content="article"/);
});

test("duplicate article routes point to canonical posts and are omitted from the sitemap", async () => {
  const blog = await readFile("dist/blog/2026/robert-pattinson-james-bond/index.html", "utf8");
  const legacy = await readFile("dist/posts/2023/old/tvguia-tv-guide-app/index.html", "utf8");
  assert.equal(canonical(blog), `${origin}/posts/2026/robert-pattinson-james-bond`);
  assert.equal(canonical(legacy), `${origin}/posts/old/tvguia-tv-guide-app`);
  assert.match(blog, /<meta name="robots" content="noindex"/);

  const sitemap = await readFile("dist/sitemap-0.xml", "utf8");
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.ok(sitemap.includes(`${origin}/posts/2026/robert-pattinson-james-bond`));
  assert.ok(sitemap.includes(`${origin}/posts/old/tvguia-tv-guide-app`));
  assert.ok(locations.every((url) => !new URL(url).pathname.match(/^\/blog(?:\/|$)/)));
  assert.ok(locations.every((url) => !new URL(url).pathname.match(/^\/posts\/\d{4}\/old\//)));
});
