# Writer Memory: a writing assistant that remembers

Built for the Total Recall hackathon with Walrus Memory.

I write Web3 content and literary fiction, mostly from a phone and a laptop. Every time I asked an AI for help, I had to explain my style again. This project gives a writing assistant a memory.

## What it does
- `seed.mjs` stores 10 notes about my writing style and habits as memories on Walrus Memory (mainnet).
- `ask.mjs "your question"` recalls the most relevant memories and builds a brief that can be pasted into any AI.
- `ask.mjs --learn "feedback"` saves new feedback to memory, so the next answer already includes it.

## How it learns
After a draft I save what worked, for example "threads that open with a short personal story got the most replies". The next time I ask about openings, that feedback is recalled automatically.

## Built with
- Walrus Memory SDK (@mysten-incubation/memwal), mainnet, namespace `writer-assistant`
- Node.js

## Run it
1. `npm install`
2. Create `walrus-keys.txt` with two lines: `MEMWAL_PRIVATE_KEY=...` and `MEMWAL_ACCOUNT_ID=...` (from memory.walrus.xyz). Never share or upload this file.
3. `node seed.mjs` to store the starter memories.
4. `node ask.mjs "Help me start a thread about a new crypto project"`
5. `node ask.mjs --learn "Feedback: ..."`
