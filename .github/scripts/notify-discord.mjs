// Posts the guide pages a push to main changed to Discord, once the site that
// serves them has deployed, so every link in the message already works.
//
//   DISCORD_WEBHOOK  the channel's webhook URL (a secret; without it nothing is sent)
//   BEFORE, AFTER    the commits the push moved main between; no BEFORE is a manual run
//   SITE             the deployed site's root URL
//   REPOSITORY       owner/name, for the link back to the pull request
//   DRY_RUN=1        print the message instead of sending it
//
// A commit whose message holds [skip notify] is not announced, and neither is a
// push that changed no page -- a changelog copy, a theme tweak, a dependency.

import { execFileSync } from "node:child_process";

const MAX_PAGES = 20;
// --vp-c-brand-1 in the light theme.
const COLOR = 0x6d28d9;

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

// A manual run has no "before", and announces the latest change to a page
// again -- which is how to test the webhook without editing the guide.
const manual = !process.env.BEFORE || /^0+$/.test(process.env.BEFORE);
const head = process.env.AFTER || git("rev-parse", "HEAD");
const after = manual ? git("log", "-1", "--format=%H", head, "--", ":(glob)docs/**/*.md") || head : head;
const before = manual ? `${after}~1` : process.env.BEFORE;
const site = (process.env.SITE || "https://kiels.dev/Ascent/").replace(/\/?$/, "/");
const repository = process.env.REPOSITORY || "Vexx3/Ascent";
const dryRun = process.env.DRY_RUN === "1";
// The GitHub-format endpoint takes GitHub's payloads, not this one.
const webhook = (process.env.DISCORD_WEBHOOK || "").replace(/\/(github|slack)\/?$/, "");

const message = git("log", "-1", "--format=%B", after);
if (message.includes("[skip notify]")) {
  console.log("The commit asks not to be announced.");
  process.exit(0);
}

const isPage = (file) =>
  file.startsWith("docs/") &&
  file.endsWith(".md") &&
  !file.startsWith("docs/.vitepress/") &&
  !file.startsWith("docs/public/");

function urlOf(file) {
  const path = file.slice("docs/".length, -".md".length);
  if (path === "index") return site;
  return site + (path.endsWith("/index") ? path.slice(0, -"index".length) : path);
}

function titleOf(file, commit) {
  if (file === "docs/index.md") return "Home page";
  const text = git("show", `${commit}:${file}`);
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const named = front?.[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const heading = text.match(/^#\s+(.+)$/m);
  const title = named?.[1] ?? heading?.[1] ?? file.split("/").pop().slice(0, -".md".length);
  return title.replace(/[*_`]/g, "").replace(/[[\]]/g, "\\$&").trim();
}

const entries = [];
for (const line of git("diff", "--name-status", "--no-renames", before, after, "--", "docs").split("\n")) {
  const [status, file] = line.split("\t");
  if (file === undefined || !isPage(file)) continue;
  if (status === "D") {
    entries.push(`Removed: ${titleOf(file, before)}`);
  } else {
    const link = `[${titleOf(file, after)}](${urlOf(file)})`;
    entries.push(status === "A" ? `New: ${link}` : link);
  }
}

if (entries.length === 0) {
  console.log("No guide page changed, so there is nothing to announce.");
  process.exit(0);
}

const subject = message.split("\n")[0];
const pullRequest = subject.match(/\(#(\d+)\)\s*$/);
const summary = subject.replace(/\s*\(#\d+\)\s*$/, "").replace(/^[a-z]+(\([^)]*\))?!?:\s*/, "");
const shown = entries.slice(0, MAX_PAGES).map((entry) => `- ${entry}`);
if (entries.length > MAX_PAGES) shown.push(`- and ${entries.length - MAX_PAGES} more`);

const payload = {
  allowed_mentions: { parse: [] },
  embeds: [
    {
      author: { name: "Guide updated", url: site },
      title: (summary.charAt(0).toUpperCase() + summary.slice(1)).slice(0, 256),
      url: pullRequest
        ? `https://github.com/${repository}/pull/${pullRequest[1]}`
        : `https://github.com/${repository}/commit/${after}`,
      description: shown.join("\n"),
      color: COLOR,
      timestamp: git("log", "-1", "--format=%cI", after),
    },
  ],
};

if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}
if (webhook === "") {
  console.log("DISCORD_WEBHOOK is not set, so nothing was sent.");
  process.exit(0);
}

const url = new URL(webhook);
url.searchParams.set("wait", "true");
const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
if (!response.ok) {
  console.error(`Discord refused the message (${response.status}): ${await response.text()}`);
  process.exit(1);
}
console.log(`Announced ${entries.length} page(s).`);
