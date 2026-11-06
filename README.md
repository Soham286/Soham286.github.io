# Soham Banerjee: Portfolio

Personal portfolio with a recruiter assistant, live at https://soham286.github.io.

The assistant answers questions about Soham with no server, API key or running costs. A sentence-embedding model (`all-MiniLM-L6-v2`, via Transformers.js) runs in the visitor's browser and compares their question with precomputed embeddings of known questions. It blends that with keyword scoring and returns a pre-written answer, or admits it doesn't know if nothing matches closely. If the model can't load, it uses keyword search alone.

## Run locally

```bash
npm install
npm run dev
```

## Edit the content

- `content/profile.ts`: what the page shows
- `content/knowledge.ts`: what the assistant can answer

After changing any `questions` in `knowledge.ts`:

```bash
npm run embed
npm run eval
```

`embed` rebuilds the search index and `eval` measures accuracy on questions the assistant hasn't seen.

## Deploy

Pushing to `main` runs the tests, builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`).
