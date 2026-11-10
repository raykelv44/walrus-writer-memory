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

const args = process.argv.slice(2);
const learn = args[0] === "--learn";
const text = (learn ? args.slice(1) : args).join(" ").trim();

if (!text) {
  console.log('Usage:\n  node ask.mjs "your question"\n  node ask.mjs --learn "feedback to remember"');
  process.exit(0);
}

if (learn) {
  const job = await memwal.remember(text);
  await memwal.waitForRememberJob(job.job_id);
  console.log("Saved to Walrus Memory:", text);
} else {
  const r = await memwal.recall({ query: text, limit: 5 });
  console.log("Question:", text);
  console.log("\nWhat the assistant remembers about this writer:");
  for (const x of r.results) console.log("-", x.text);
  console.log("\nBrief ready to paste into any AI:");
  console.log("Write for this writer, following these remembered preferences:");
  for (const x of r.results) console.log("- " + x.text);
  console.log("Task: " + text);
}

if (env.TATUM_API_KEY) {
  try {
    const res = await fetch("https://sui-mainnet.gateway.tatum.io/", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env.TATUM_API_KEY },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "sui_getLatestCheckpointSequenceNumber", params: [] }),
    });
    const j = await res.json();
    console.log("\nSui mainnet latest checkpoint via Tatum RPC:", j.result ?? j);
  } catch (e) {
    console.log("\nTatum RPC check failed:", e.message);
  }
}