# HomeEdge Brand Guide

**HomeEdge** — a rent-vs-buy comparison dashboard for evaluating the financial tradeoffs between renting and buying a home. It should feel practical, data-driven, and decision-oriented: a side-by-side financial model, not a generic mortgage calculator. The aim is to give users an edge when judging whether buying is financially smarter than renting.

Recommended domain:

```txt
homeedge.taylormorsedev.com
```

## Positioning & core idea

**Make the rent-vs-buy decision easier to understand with clear financial comparisons.**

- One-line description: HomeEdge is a rent-vs-buy dashboard that compares monthly cost, long-term wealth, equity, investment opportunity cost, and break-even timing.
- Short marketing description: HomeEdge helps you compare renting vs buying using a clear financial dashboard. Model home price, mortgage terms, rent growth, appreciation, taxes, insurance, maintenance, and investment returns to see which path gives you the better long-term outcome.

## Messaging

Primary tagline:

> Know when buying gives you the edge.

Alternates:

- Rent or buy with confidence.
- See the real cost of homeownership.
- A clearer way to decide whether to rent or buy.

## Target user & mindset

Primary users:

- First-time homebuyers  
- Renters considering buying within 1–3 years  
- People who want more than a basic mortgage calculator  
- Analytical users who want a data-backed decision tool  

User mindset examples:

- “Can I actually afford this?”  
- “Is buying smarter than renting right now?”  
- “How long do I need to stay in the home for buying to make sense?”  
- “What am I giving up by putting cash into a down payment instead of investing it?”  

## Brand personality

HomeEdge should feel: clear, practical, financially smart, calm, modern, trustworthy, slightly premium, analytical without being intimidating.

Avoid feeling: gimmicky, overly playful, real estate agent-heavy, crypto/fintech hype, corporate banking dull, too spreadsheet-like.

## Voice & UI copy

Use direct, practical copy. Avoid hype.

**Good examples**

- Compare the true cost of renting vs buying.
- See when buying breaks even.
- Model appreciation, rent growth, taxes, insurance, maintenance, and investment returns.
- Based on your assumptions, buying appears stronger after year 7.
- Renting keeps more cash liquid in the early years.

**Avoid**

- “Unlock your dream home journey.”
- “Revolutionize your real estate decision.”
- “AI-powered financial freedom.”
- “Become a homeowner today.”

## Result language (non-advisory)

**Good**

- Based on your assumptions, buying appears stronger after year 7.
- Renting keeps more cash available in the short term.

**Avoid**

- You should buy a house.
- Renting is throwing money away.

## Disclaimer

> HomeEdge is an educational planning tool. Results are estimates based on your assumptions.

Longer footer variant (marketing / docs):

> HomeEdge is an educational planning tool. Results are estimates based on your assumptions provided and should not be considered financial, tax, or real estate advice.

## Product vocabulary (app)

Align copy with shipped UI:

- **Navigation:** Dashboard, Scenarios, Documentation (plus wordmark linking to landing).
- **Dashboard sections:** Key Insights, Analysis Charts, Scenario inputs.
- Prefer **scenario**, **assumptions**, **break-even**, **rent vs buy** in explanatory copy where it fits.

## Visual

- **Wordmark:** `HomeEdge` (text-only mark is fine for MVP).
- **Palette:** Keep the existing dashboard colors (blue owner / cyan renter, defined in theme).
- **Typography:** Use the app’s configured system UI sans stack (`theme.ts`), not a custom font mandate.

## Landing page copy (canonical)

Used on `/` ([src/routes/Landing.tsx](src/routes/Landing.tsx)).

| Block | Copy |
|-------|------|
| **Headline** | Rent vs buy, calculated clearly. |
| **Subhead** | HomeEdge helps you compare monthly cost, long-term wealth, equity growth, and break-even timing before you decide whether to rent or buy. |
| **Primary CTA** | Start Comparing → `/dashboard` |
| **Secondary CTA** | View example scenario → `/dashboard` (loads default scenario from app state) |

**Feature cards**

1. **True cost comparison** — Compare mortgage payments, rent, taxes, insurance, maintenance, closing costs, and opportunity cost.  
2. **Break-even timeline** — See how long it may take for buying to become financially stronger than renting.  
3. **Long-term wealth view** — Visualize estimated equity, investment growth, and net worth over your selected time horizon.  

**Landing footer**

> HomeEdge is an educational planning tool. Results are estimates based on your assumptions.

## SEO & social metadata

**Title**

```txt
HomeEdge | Rent vs Buy Calculator Dashboard
```

**Description**

```txt
Compare renting vs buying with HomeEdge. Model mortgage costs, rent growth, home appreciation, equity, investment returns, and break-even timing in one clear dashboard.
```

**Open Graph title**

```txt
HomeEdge - Rent vs Buy, Calculated Clearly
```

**Open Graph description**

```txt
A visual rent-vs-buy dashboard for comparing monthly costs, long-term wealth, equity, and break-even timing.
```

## Out of scope for this repo’s brand work

- Renaming packages, modules, or localStorage keys to `HomeEdge*`.
- Obligatory logo icon design beyond the wordmark.
