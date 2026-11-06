// Precomputes an embedding for every question in content/knowledge.ts so the browser
// only has to embed the visitor's question. Run `npm run embed` after editing questions.

import { writeFileSync } from "node:fs";
import { pipeline } from "@huggingface/transformers";
import { knowledge } from "../content/knowledge.ts";

const MODEL = "Xenova/all-MiniLM-L6-v2";

const embed = await pipeline("feature-extraction", MODEL, { dtype: "q8" });

const vectors = [];
for (const entry of knowledge) {
  for (const text of entry.questions) {
    const output = await embed(text, { pooling: "mean", normalize: true });
    vectors.push({
      id: entry.id,
      text,
      vector: Array.from(output.data, (n) => Number(n.toFixed(4))),
    });
  }
}

writeFileSync("public/embeddings.json", JSON.stringify({ model: MODEL, vectors }));
console.log(`Wrote ${vectors.length} vectors to public/embeddings.json`);
