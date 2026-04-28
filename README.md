# Human-like autonomy paper site

Static project website for:

**Human-like autonomy emerges from self-play and a pinch of human data**

## Local preview

Open `index.html` directly in a browser, or run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy on Vercel

This is a plain static site. In Vercel, import the GitHub repo and use:

- Framework preset: `Other`
- Build command: leave empty
- Output directory: `.`

Vercel will serve `index.html` from the repository root.
