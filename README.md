# Friends: Central Snake — PWA

A self-contained, installable Snake game with a cozy Central Perk-inspired café look.

## Features
- Classic Snake gameplay
- Obstacles that increase with level
- Coffee collectibles
- Boost, Heart and Star power-ups
- Temporary speed boost and double-score effects
- Keyboard, WASD and mobile swipe controls
- Pause with Space
- Local best score
- Original locally bundled background music (`assets/central-perk-theme.wav`)
- PWA manifest + service worker + icons
- Offline-capable after first load

## Deploy
Upload the contents of this folder to any static HTTPS host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.). No build step is required.

For local testing, serve the folder over HTTP instead of opening `index.html` directly, e.g. `python -m http.server 8080`.

## Assets
All artwork is original and included locally. The background music is generated in-browser with Web Audio, so there is no third-party music file or remote dependency.
