// Browser-side access to the embedding worker. Every failure resolves to null, and the
// chat then uses keyword search, so a blocked CDN or old device never breaks the page.

import type { StoredVector } from "./retrieval.ts";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

let worker: Worker | null = null;
let loading: Promise<StoredVector[] | null> | null = null;
let nextId = 0;
const pending = new Map<number, (vector: number[] | null) => void>();

/** Starts the model download once. Resolves to the stored question vectors. */
export function loadSemantic(onProgress?: (percent: number) => void): Promise<StoredVector[] | null> {
  loading ??= new Promise((resolve) => {
    // The model is roughly 20+ MB, so don't spend it on data-saver or slow connections.
    const network = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    if (network?.saveData || /(^|-)(2g|3g)$/.test(network?.effectiveType ?? "")) {
      return resolve(null);
    }

    try {
      worker = new Worker("/embed-worker.js", { type: "module" });
    } catch {
      return resolve(null);
    }

    worker.onerror = () => resolve(null);
    worker.onmessage = async ({ data }) => {
      if (data.type === "progress") {
        onProgress?.(data.percent);
      } else if (data.type === "failed") {
        console.warn("Semantic search unavailable:", data.error);
        resolve(null);
      } else if (data.type === "ready") {
        try {
          const response = await fetch("/embeddings.json");
          const { vectors } = (await response.json()) as { vectors: StoredVector[] };
          resolve(vectors);
        } catch {
          resolve(null);
        }
      } else if (data.type === "vector") {
        pending.get(data.id)?.(data.vector);
        pending.delete(data.id);
      }
    };
  });
  return loading;
}

export function embedQuery(text: string): Promise<number[] | null> {
  if (!worker) return Promise.resolve(null);
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    worker!.postMessage({ id, text });
  });
}
