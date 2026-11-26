[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/riskiozora12/makefun-best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/riskiozora12/makefun-best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# NusaStat — Portal Statistik Indonesia

Built for the [make.fun best-national-statistics-site-20261126-0539 bounty](https://make.fun/bounty/best-national-statistics-site-20261126-0539).

A working national statistics site for Indonesia, served as plain static files — no build step, no network requests. Open `app/index.html` through any static server (for example `python3 -m http.server` inside `app/`) and explore:

- **Beranda** — eight headline indicators (population, GDP, growth, GDP per capita, poverty, unemployment, inflation, HDI) with source and year on every card, plus growth and population charts and a list of cited releases.
- **Penduduk** — population 2015–2024, age structure, and a sortable, searchable table of the ten most populous provinces (2020 Census).
- **Ekonomi** — GDP nominal / growth toggle chart, exports vs imports 2019–2024, trade facts.
- **Tenaga Kerja & Kemiskinan** — unemployment and poverty series 2019–2024, with a working CSV download of the data.
- **Kesehatan & Pendidikan** — Human Development Index 2019–2024 and key health/education facts.
- **Daerah** — the province table again, with sorting and search.
- **Metodologi & Sumber** — every source (BPS, World Bank, APJII, Bank Indonesia, Kemendagri) and the notes on how each series was compiled.

All figures are real published figures from BPS (Statistics Indonesia), the World Bank, and APJII, each labelled with its source and year. Charts are hand-drawn SVG (no chart library); the whole first load is a handful of small local files.

## Layout

- `app/` — the site: `index.html`, `style.css`, `data.js` (figures + sources), `charts.js` (SVG charts), `views.js` (pages), `main.js` (router + interactions).
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with `buildDossier` from `vendor/makefun-frontend.ts`.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.
- `screenshots/` — renders of the site in a browser (desktop + phone).

## Run locally

```sh
cd app
python3 -m http.server 8080
# open http://localhost:8080/
```

## Build the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Try make.fun yourself: https://make.fun/?ref=wt28nn7m
