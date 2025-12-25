# A Precious — A Little Love Archive

*An elegant, interactive surprise archive — crafted with care, for moments that matter.*

---

## Overview

A Precious is a hand-crafted, full‑stack interactive web experience for creating, scheduling, and revealing personal surprises. It&rsquo;s designed for anyone who wants to present curated memories and messages on special dates — lovers, friends, and creators who care about craft and subtle delight.

Why this exists
- To give meaningful moments a beautiful home on the web.
- To combine simple game-like reveal mechanics (timers, keys, surprises) with a polished, responsive UI.

Who its for
- Creators delivering time-locked messages or gifts.
- Developers who want a thoughtful, design-forward sample of a small full-stack app.

---

## Key Features

- Time-locked surprises: schedule reveals by date and optionally protect them with secret keys.
- Two-stage surprise content: teaser text shows while the timer runs; the main surprise reveals after unlock.
- Admin editor: edit name, teaser (timer) text, full surprise content, external URL, image, and key.
- Smooth, animated UI with graceful loading and accessible controls.
- Server-side API with persistent Postgres storage (Drizzle ORM) and safe defaults.
- Easy deployment: production build and Express server ready for Render or similar hosts.

---

## Tech Stack
# A Precious — A Little Love Archive

<div align="center">

*An elegant, interactive surprise archive — crafted with care, for moments that matter.*

![Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=180&section=header&text=A%20Precious&fontSize=56&fontColor=fff&animation=twinkling&fontAlignY=40&desc=A%20Beautiful%20Time-Locked%20Experience&descSize=18&descAlignY=62)

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=Pacifico&size=26&pause=1000&color=FF69B4&center=true&vCenter=true&width=700&lines=Make+Someone's+Day+Special;Crafted+With+Love;Smooth+Animations;Unforgettable+Moments" alt="Typing SVG" />

<p>
[![Made with Love](https://img.shields.io/badge/Made%20with-Love-ff69b4?style=for-the-badge&logo=heart)](https://github.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-FF0055?style=for-the-badge&logo=framer)](https://framer.com/motion)
</p>

</div>

---

## Overview

A Precious is a design-forward, full‑stack web experience for scheduling and revealing meaningful surprises. It blends crisp UI, smooth animations, and secure time-lock mechanics so creators can deliver emotional, polished moments on special dates.

Why this exists
- To make thoughtfully timed surprises feel delightful and effortless.
- To showcase a small but refined full-stack app combining animation, accessibility, and persistence.

Who it’s for
- Creators who deliver personal surprises (birthdays, anniversaries, milestones).
- Developers seeking a tasteful reference app for animations + server-driven content.

---

## Key Features

- Time-locked surprises: schedule reveals by date and optionally protect them with secret keys.
- Two-stage surprise content: teaser text shows while the timer runs; the main surprise reveals after unlock.
- Admin editor: edit name, teaser (timer) text, full surprise content, external URL, image, and key.
- Smooth, animated UI using Framer Motion and careful asset loading.
- Persistent storage with PostgreSQL using Drizzle ORM and zod validation.
- Production-ready Express server and a simple deployment flow for Render or similar hosts.

---

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Database: PostgreSQL (Drizzle ORM + drizzle-zod)
- Bundler / Tooling: Vite, TypeScript, tsx
- Dev tooling: React Query, Lucide icons

---

## What Makes This Special

<table align="center">
<tr>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png" width="48" height="48" alt="Confetti"/>
<br><b>Confetti</b>
<br><sub>Celebration Effects</sub>
</td>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Birthday%20Cake.png" width="48" height="48" alt="Cake"/>
<br><b>Interactive Cake</b>
<br><sub>Light & Blow Candle</sub>
</td>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkling%20Heart.png" width="48" height="48" alt="Hearts"/>
<br><b>Falling Hearts</b>
<br><sub>Romantic Animation</sub>
</td>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Camera%20with%20Flash.png" width="48" height="48" alt="Photos"/>
<br><b>Photo Gallery</b>
<br><sub>Memory Slideshow</sub>
</td>
</tr>
<tr>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Musical%20Notes.png" width="48" height="48" alt="Music"/>
<br><b>Background Music</b>
<br><sub>Set The Mood</sub>
</td>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" width="48" height="48" alt="Animations"/>
<br><b>Smooth Animations</b>
<br><sub>Framer Motion</sub>
</td>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png" width="50" alt="Messages"/>
<br><b>Sweet Messages</b>
<br><sub>Heartfelt Words</sub>
</td>
<td align="center" width="150">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Mobile%20Phone.png" width="48" height="48" alt="Responsive"/>
<br><b>Responsive</b>
<br><sub>Works Everywhere</sub>
</td>
</tr>
</table>

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/jkraj8173-maker/A-precious.git
cd A-precious

# Install dependencies
npm ci

# Add a .env.local file with at least:
# ADMIN_PASSWORD=your_password
# DATABASE_URL=postgres://user:pass@host:5432/dbname

# Apply DB migrations (Drizzle)
npm run db:push

# Build and start in production
npm run build
NODE_ENV=production npm run start
```

Dev server (hot reload):

```bash
npm ci
npm run dev
```

Visit `http://localhost:5000` to preview.

---

## Deploying to Render (recommended for full-stack)

1. Create a PostgreSQL database on Render and copy the `DATABASE_URL`.
2. Create a Web Service on Render connected to this repository.
	- Build command: `npm ci && npm run build`
	- Start command: `npm run start`
	- Environment variables: `DATABASE_URL`, `ADMIN_PASSWORD`, `NODE_ENV=production`
3. After the service is created, run migrations against the Render DB:

```bash
# from your machine (replace with your Render DB URL):
DATABASE_URL=postgres://... npm run db:push

# or from a one-off shell on Render:
npm ci
npm run db:push
```

4. Restart the service and verify logs. The app will insert default surprises only if the table is empty.

Why Render?
- Render can host the Express server and the static client from the same service, with a managed Postgres.

Vercel note
- Vercel is ideal for static/frontend hosting. This repository includes an Express API and Postgres; a common setup is to host the frontend on Vercel and the API + Postgres on Render.

---

## Project Structure (summary)

- `client/` — static entry and React source
- `client/src/` — components and pages (key component: `surprises-section.tsx`)
- `server/` — Express app, routes, storage and DB initialization
- `shared/` — DB schema (Drizzle) and shared types
- `script/` — build & helper scripts

---

## Screenshots / Demo

*(Replace the placeholders with your screenshots or animated GIFs.)*

- Desktop Reveal Flow — teaser → timer → reveal
- Admin Edit Mode — edit teaser, content, image, URL, and key

---

## Roadmap

- Progressive image optimization and CDN delivery
- Client code-splitting and bundle reduction for faster first paint
- Optional notifications for unlocked surprises

---

## Contributing

Contributions are welcome. Please open an issue for larger proposals and make small, focused PRs.

---

## License

MIT

---

## Author & Credits

Created & Maintained by: Jeet

- GitHub: https://github.com/jkraj8173-maker
- Instagram: https://instagram.com/kj_rajsingh
- YouTube: Coming soon

Made with care — design-forward and performance-conscious.

---

<div align="center">

[![Support](https://img.shields.io/badge/Support-Give%20a%20Star-ffd700?style=for-the-badge)](https://github.com/jkraj8173-maker/A-precious/stargazers)

<br/>

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,16,18,20&height=100&section=footer)

</div>