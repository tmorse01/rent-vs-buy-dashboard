## Plan: Docs Pages + Dismissible Onboarding

Create short documentation pages under /docs/:page, with a TL;DR overview page and concise topic pages. Replace the About route with the new docs route, update navigation, and add a dismissible onboarding panel anchored bottom-right that works on desktop and mobile. Tone stays explanatory and finance-neutral.

### Steps 4–6 steps

1. Replace the About route in src/routes/About.tsx with a docs route handler in src/routes that supports /docs/:page and a default page.
2. Update navigation links in src/components/Navigation.tsx to point to /docs/overview (TL;DR summary).
3. Create a docs page list (short content pages) and ensure each maps to a /docs/:page slug, linked from the TL;DR page in src/routes.
4. Add a dismissible onboarding panel at the layout level in src/components/Layout.tsx so it appears across the app; tune positioning for mobile vs desktop.
5. Define onboarding content that explains the comparison, key metrics, and how to start in CALCULATIONS.md aligned language and add a link to /docs/overview.

### Further Considerations 1–3

1. Default docs page: overview vs getting-started? Option A / Option B.
2. Dismissal persistence: localStorage flag vs session-only? Option A / Option B.
3. Mobile behavior: bottom sheet vs inline banner? Option A / Option B.
