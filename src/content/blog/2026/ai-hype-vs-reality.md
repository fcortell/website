---
title: "AI Hype vs Reality"
description: "A summary of Ethan Ding's insights on why respected engineers are pushing back on the AI coding agent hype cycle, the K-shaped productivity curve, and why more code often just means more bloat."
pubDatetime: '2026-05-07'
author: 'Fermín Cortell'
featured: true
tags: ['ai', 'development', 'claude', 'automation', 'productivity', 'agentic-coding', 'machine-learning']
---


# Claude code is not making your product better
*Why the most respected engineers are pushing back on the coding agent hype cycle, and what the Claude code argument actually reveals*

---

Something interesting is happening. The loudest voices in the room are telling you that AI coding agents changed everything. The engineers who actually built the things you use every day are telling you something more complicated.

## The K-shaped productivity curve

Labor economists are seeing a K-shaped reality: senior engineers using AI are getting meaningfully more productive, while junior engineers are treading water or getting worse. 

The popular venture-backed narrative ignores the bottom half of that K, boasting about teams "clearing six years of backlog in a quarter" or building whole backends in three days. But while agentic coding *does* reduce time-to-PR, lines of code per hour is the wrong metric. 

**If engineers are more productive, the rate at which product improves per engineer should be going up.**

## The best product builders are a canary

Recently, respected builders like Dax (OpenCode.ai), Karri Saarinen (Linear), and David Cramer (Sentry) all noticed the same pattern. 

Cramer summarized it best after reviewing his GitHub graphs: LLMs remove the barrier to get started, but they create increasingly complex, unmaintainable software. His verdict: **it's mostly bloat.** These aren't luddites—Dax is literally building an AI agent, and Karri built Linear. Yet they are struggling to see their product improvement velocity accelerate.

When you can generate features at the speed of thought, you stop saying no. The cost structure of software development changes. Suddenly, it's cheaper to ship crud than to think about what matters.

## Why isn't Claude Code in fast take off mode?

Anthropic boasts that Claude Code is completely Claude-coded. If the machine is writing the machine, the rate of product improvement should be a compounding function (y = e^(cx), exponential growth).

If that were true, Anthropic's 7-month head start should have created an unbridgeable gap between them and competitors like Codex or Cursor. Instead, everyone is still debating which tool is better. The compound advantage isn't showing up because **something else is bottlenecking product quality, and it was never the code.**

That's not how you'd expect exponential improvement to look.

## Lines of code is a cost, not a product

The best engineering cultures treat lines of code as a liability on the balance sheet, not an asset. Every line is a surface for bugs; every feature creates dependencies. 

Take Linear vs. Jira. Linear has a fraction of the headcount and codebase size, but infinitely better consumer quality. Facebook isn't constrained by UI code production – it's constrained by delivering it reliably to billions. The reward function for great software is *compression*, not production. Coding agents don't have a theory of the system to make long-term tradeoffs.

The constraint was never "write code faster." The constraint was always "figure out what's worth building."

## The real bottleneck: pushing the frontier

Product quality at the frontier isn't bounded by how fast you write code. It's bounded by how fast you come up with ideas good enough to push the frontier.

That kind of quality emerges from *taste* – from the painful, slow decision to build less. A backlog full of CRUD features is exactly what AI accelerates, but shipping faster doesn't make your product better. It makes it better when you ship something that makes users care more.

### The AI productivity paradox

* **The Upside:** AI agents get 0-to-1 products to a working version much faster. 
* **The Downside:** Technical debt compounds. You're buying speed with money you'll pay later.

## Camrys for everyone, Ferraris for no one

So, is Claude Code worth it? It depends on where you are.

* **If you're at the frontier, your bottleneck is tastemakers.** Knowing what to delete, compress, or refuse isn't on any AI's roadmap.
* **If you're already #1, pumping tokens might not add value.** Throwing more money at AI generated code when you're already winning yields diminishing returns.
* **It helps anyone build a Camry competitor.** It doesn't help the artisans at Ferrari make faster Ferraris. 
* **The cost of software will plummet.** But chaos is piling up in the rafters. Eventually, someone has to pay off the massive technical debt we are generating today.

---

Summary of Substack [Claude Code is Not Making Your Product Better](https://open.substack.com/pub/ethanding/p/claude-code-is-not-making-your-product?utm_campaign=post&utm_medium=web)