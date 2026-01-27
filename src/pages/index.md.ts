import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Fermin Cortell (@fcortell)

Make yourself comfortable and take a look.

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [Archives](/archives.md)
- [RSS Feed](/rss.xml)

## Links

- Twitter: [@fcortell](https://twitter.com/fcortell)
- GitHub: [@fcortell](https://github.com/fcortell)
- Email: fcortell@gmail.com

---

*This is the markdown-only version of fcortell.com. Visit [fcortell.com](https://fcortell.com) for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
