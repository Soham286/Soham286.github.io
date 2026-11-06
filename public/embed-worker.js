// Runs the embedding model off the main thread so the page stays responsive.
// Kept as a plain file so the bundler doesn't need to process the ML library.
// The library, its runtime and the model load from public CDNs, not from this site.
// Only those files are downloaded: the visitor's question never leaves this worker.

import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2";

let embed;

try {
  embed = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    dtype: "q8",
    device: "wasm",
    progress_callback: (event) => {
      // The .onnx file is by far the largest download, so its progress is what matters.
      if (event.status === "progress" && event.file?.endsWith(".onnx")) {
        self.postMessage({ type: "progress", percent: Math.round(event.progress) });
      }
    },
  });
  self.postMessage({ type: "ready" });
} catch (error) {
  self.postMessage({ type: "failed", error: String(error) });
}

self.onmessage = async ({ data }) => {
  try {
    const output = await embed(data.text, { pooling: "mean", normalize: true });
    self.postMessage({ type: "vector", id: data.id, vector: Array.from(output.data) });
  } catch {
    self.postMessage({ type: "vector", id: data.id, vector: null });
  }
};
