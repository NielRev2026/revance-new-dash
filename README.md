# Revance · New Dash

A prototype of a reimagined Revance Aesthetics provider portal — minimal, editorial, and personalizable.

## Pages

| Page | File | Purpose |
|---|---|---|
| Dashboard | `index.html` | Home with welcome + 3 entry tiles |
| Manage Rewards | `rewards.html` | Tier progress + rewards balance + redemption |
| Products | `purchase.html` | DAXXIFY · RHA® Collection · SkinPen® lineup |
| Experience | `experience.html` | Scroll-driven story with 6 personalization scenes |
| The Numbers | `numbers.html` | Editorial data viz for practice analytics |
| Check In | `checkin.html` | Giant phone input for patient check-in |

## Stack

Pure static HTML / CSS / vanilla JS. No build step. Fonts from Google Fonts, lifestyle photography from Unsplash, product imagery stored locally under `assets/products/`.

## Personalization

Selecting a scene on `/experience.html` saves `{id, label, image}` to `localStorage` under the key `revanceExperience`. The home page hero reads that value on load and turns into a full-bleed image hero with dark overlay + white welcome text. Click the frosted chip's **✕** to reset.

## Deploying

Drop-in static hosting. Recommended:

1. **Cloudflare Pages** (free, private repo supported, free email-auth via Cloudflare Access)
2. **Vercel** (free hobby plan, unguessable preview URLs)
3. **Netlify Drop** (drag-and-drop the folder for a quick share)
