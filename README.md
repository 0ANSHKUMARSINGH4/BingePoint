# 🎬 BingePoint

**BingePoint** is a sleek, high-performance movie and anime discovery platform that fetches and displays the latest movies using The Movie Database (TMDB) API.  
It focuses on simplicity, speed, and a modern, cinematic UI — inspired by TMDB but designed to be cleaner and faster.

🌐 **Live Demo:** https://binge-point-ycbt.vercel.app

---

## 🚀 Features

- 🆕 Displays **latest movies** (sorted by release date) from TMDB  
- 🎥 **YouTube trailers** (via TMDB videos) and **Watch Now** (vidsrc.pk / vidsrc.icu embeds)  
- 🧩 Dedicated **Anime** section (Animation genre from TMDB)  
- 🌗 **Dark/Light theme toggle** with persistence (localStorage)  
- ♻️ **Infinite scroll** with "Load more" fallback for lists  
- ⚡ Built with **Vite + React** for fast development and production builds  
- 📱 Fully **responsive** — works on desktop, tablet, and mobile  
- ✅ Clean, reusable components and straightforward file structure

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (18) + Vite |
| Styling | Tailwind CSS (PostCSS) + custom utilities |
| Animations | Framer Motion (ready) |
| Data | TMDB API |
| Streaming Embeds | vidsrc.pk / vidsrc.icu (iframe embeds) |
| Deployment | Vercel |
| Storage | localStorage (for theme / optional watchlist) |
| Languages | JavaScript (no TypeScript by default) |

---

## 📸 Preview

> Replace the screenshot placeholders in `assets/` with actual images for the README.

- Homepage: `assets/screenshot-home.png`  
- Details / Player modal: `assets/screenshot-details.png`  
- Anime section: `assets/screenshot-anime.png`

---

## ⚙️ Installation & Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/BingePoint.git
   cd BingePoint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file (root)**
   ```
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   ```
   > Vite only exposes env vars that start with `VITE_`. Obtain a key from https://developer.themoviedb.org/

4. **Run dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build locally (optional)**
   ```bash
   npm run preview
   ```

---

## 🌍 Deployment (Vercel)

1. Push your code to GitHub.  
2. Go to https://vercel.com and import the GitHub repository.  
3. Vercel usually auto-detects Vite. If needed:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable in Vercel project settings:
   - `VITE_TMDB_API_KEY` = your_tmdb_api_key_here
5. Click **Deploy**. The site will be live at a vercel.app URL; add a custom domain if desired.

> Note: If video embeds fail to render on production, the embed provider may block cross-origin iframing (X-Frame-Options). Provide a fallback link to open the source in a new tab.

---

## 📁 Project Structure

```
BingePoint/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── components/       # Navbar, HeroCarousel, MovieCard, ModalPlayer...
│   ├── pages/            # Home, Details, Anime
│   ├── shared/           # Reusable modal / helpers
│   ├── utils/            # tmdb.js, helpers
│   ├── styles/           # tailwind.css or custom css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── vite.config.mjs
└── README.md
```

---

## ✅ Best Practices & Notes

- **Do not commit** your `.env` to GitHub. Add `.env` to `.gitignore`.
- **TMDB rate limits** apply — cache results or paginate carefully if you hit limits.
- **Embed reliability:** vidsrc providers may block iframe embedding. Always provide a fallback button to open the provider page in a new tab when the iframe fails.
- **SEO & Metadata:** Add proper `<meta>` and Open Graph tags in `index.html` for better link previews (title, description, og:image).

---

## 🔧 Troubleshooting

- **Blank UI / “Failed to load”** → Check that `VITE_TMDB_API_KEY` is present in Vercel environment and local `.env`. Ensure `import.meta.env.VITE_TMDB_API_KEY` is not `undefined`.
- **ESM plugin error with Vite** → Ensure `vite.config.mjs` uses ESM (`export default`) and `type: "module"` in `package.json` or `.mjs` extension.
- **Tailwind not compiling** → Confirm `postcss.config.cjs` and `tailwind.config.cjs` are present and `src/styles/tailwind.css` imports `@tailwind base; @tailwind components; @tailwind utilities;`.

---

## ♻️ Future Improvements (Roadmap)

- User authentication + server-side watchlist sync (optional)
- Genre filters, advanced search, and sorting
- "Continue Watching" and playback position persistence
- Accessibility improvements & Lighthouse score optimizations
- CI linting & tests (Jest / Vitest)

---

## 📜 License

This repository is provided under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Ansh Kumar Singh**  
Final-year B.Tech (CSE) • Web Developer  
Portfolio: https://portfolio-website-henna-mu.vercel.app

---

## ⭐ If you find this project useful

Please give it a **star** on GitHub — it helps visibility and motivation!  
If you'd like, I can also generate a short project blurb for your resume or LinkedIn that highlights the technical skills demonstrated here.
