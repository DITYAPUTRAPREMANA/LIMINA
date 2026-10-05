# Limina

An early-warning system for suspension risk of issuers listed on the Indonesia Stock Exchange (IDX).

> The name Limina comes from the Latin word *limen* (threshold, boundary). The core of this product isn't predicting events — it's measuring how far an issuer stands from the risk thresholds that IDX has already published.

**Status:** in development · **Competition:** Sectors Hackathon 2026, Track 03 Market Intelligence

---

## Summary

Retail investors holding second- and third-tier stocks typically only find out something is wrong with their issuer once the stock can no longer be sold. IDX publishes Special Notations and moves troubled issuers to the Special Monitoring Board, but both mechanisms mark conditions that have already happened — they don't warn about conditions that are still forming.

Limina continuously recalculates those risk criteria from [Sectors](https://sectors.app) data, then shows which issuers are moving closer to the threshold, along with the quantitative reasons their score is rising.

**Product claim:** not "we predict suspensions," but **"we calculate the already-published risk rubric, faster than the label itself gets issued."**

---

## Who it's for

- **Primary user** — retail investors holding second- and third-tier stocks, monitoring their own portfolio, without access to securities research
- **Secondary user** — writers and investment community managers who need a quantitative basis when discussing at-risk issuers
- **Not the target** — institutional investors and professional analysts who already have their own monitoring process

---

## What is claimed, what isn't

| Claimed | Not claimed |
|---|---|
| Calculates risk indicators from IDX's public criteria, continuously, for all covered issuers | Not a prediction of bankruptcy, fraud, or delisting |
| Displays issuer rankings based on risk score, with an explanation of each indicator's contribution | Not a buy, sell, or hold recommendation |
| Shows historical evidence of the time gap between a rising score and the official label being issued | Not a substitute for official IDX announcements |
| | Does not provide an estimated suspension duration |

---

## Features

- **Ranking Page** — list of issuers sorted by highest risk score, with 30-day movement direction and the most dominant indicator
- **Issuer Detail Page** — breakdown of each indicator's contribution, score movement chart, raw values shown alongside their thresholds
- **Evidence Page** — case studies of previously suspended issuers, shown as a timeline with the distribution of time gaps relative to the official label
- **Methodology Page** — label definitions, list of indicators and their formulas, point-in-time rules, known limitations

---

## Architecture

Computation is done offline, the results are exported as static files, and the interface only reads those files.

```
Sectors API → Ingestion layer → Local cache → Models & indicators → JSON artifacts → Static interface
```

Deliberate consequences:
- No server needs to stay alive for core features
- API keys never live on the client side
- The interface can be hosted on a free static hosting service

---

## Tech stack

| Layer | Technology |
|---|---|
| Data & model | Python |
| Interface | Vue 3 / React, Vite, Tailwind |
| Charts | ApexCharts |
| User accounts (optional) | Supabase (Postgres + Auth + Row Level Security) |
| Progressive Web App | Manifest + service worker |

---

## Project structure

```
limina/
  src/            API wrapper, label grouping, indicators,
                  point-in-time checker, sampling, model, export
  data/
    cache/        Raw responses (not version-controlled)
    labels/       Suspension reason mapping
    artifacts/    scores.json, backtest.json — outputs for the interface
  web/            Interface, PWA
  supabase/       Schema and migrations (if account features are enabled)
  scheduler/      Periodic update jobs
  notebooks/      Exploration, not part of the production pipeline
  docs/           Methodology and additional documentation
```

---

## Methodology overview

- **Positive labels** come only from compliance/distress-category suspensions (late financial reports, sanctions, going concern) — voluntary or short-term technical suspensions are excluded from the main label
- **Point-in-time rule**: no indicator uses data that only became available after T minus 30 days, enforced through an automated checker function on every sample
- **Data splitting is temporal**, not random — events before 2025 for training, 2025–2026 for testing
- **Primary metrics**: Precision@20 and the average time gap relative to the official label. Accuracy is not reported since it is misleading on an imbalanced class
- A rule-based fallback path is available if the sample size or model performance is insufficient

Full details are in `docs/methodology.md`.

---

## Limitations

- The number of positive samples is likely small, so confidence intervals on the metrics are wide
- Grouping of suspension reasons involves human judgment, published so it can be debated
- Scores do not apply to issuers with incomplete data — they are excluded from coverage and flagged, not silently given a low score
- Cannot see non-public information
- Historical time gaps are not a guarantee of future performance

---

## Disclaimer

Limina is not investment advice. All figures and scores are informational, calculated from public data, and do not replace verification against official sources such as financial statements or Indonesia Stock Exchange announcements. Investment decisions are entirely the user's responsibility.

---

## Website

https://limina-sigma.vercel.app
