import { readFileSync } from "node:fs";
import { MemWal } from "@mysten-incubation/memwal";

const env = {};
for (const line of readFileSync("walrus-keys.txt", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i > 0) env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
}

const memwal = MemWal.create({
  key: env.MEMWAL_PRIVATE_KEY,
  accountId: env.MEMWAL_ACCOUNT_ID,
  serverUrl: "https://relayer.memory.walrus.xyz",
  namespace: "writer-assistant",
});

const notes = [
  "I write Web3 and crypto content: promotional threads, bounty contest entries and ecosystem articles.",
  "I also write literary fiction for Reedsy contests and open-submission literary outlets.",
  "My Web3 threads work best with a strong hook in the first line and short, punchy sentences.",
  "For ecosystem articles I explain the technology simply for beginners before going into detail.",
  "In fiction I prefer a restrained voice and concrete imagery over heavy explanation.",
  "I work mostly from my phone and a laptop, so drafts must be easy to review on a small screen.",
  "Bounty contests reward originality and clear explanation, so I always include one personal story or example.",
  "I am currently learning to build with Walrus Memory for the Total Recall hackathon.",
  "I post on X, TikTok and Instagram, so every piece needs a short version for social media.",
  "After each draft I save the feedback so future drafts match what worked before.",
];

async function save(text) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const job = await memwal.remember(text);
      await memwal.waitForRememberJob(job.job_id);
      return;
    } catch (e) {
      console.log("  retrying after error:", String(e.message).slice(0, 90));
    }
  }
  console.log("  gave up on this one");
}

console.log("Health:", (await memwal.health()).status);
let n = 0;
for (const text of notes) {
  n++;
  console.log(`Saving ${n}/${notes.length}...`);
  await save(text);
}

const r = await memwal.recall({ query: "What kind of content does the writer make?", limit: 3 });
console.log("\nRecalled:");
for (const x of r.results) console.log("-", x.text);