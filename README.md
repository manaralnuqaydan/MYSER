# MYSER | مُيسّر

An Arabic-first, bilingual Saudi digital-services concept built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons.

The cinematic homepage includes a custom Saudi landmark composition, guided assistant, six-step service journey, searchable service sectors, GovMeet AI meeting demo, interactive demo wallet, and mobile application concepts. Arabic uses RTL; the header switches the entire experience to English LTR.

## Development

Use Node.js 20.9 or newer (validated on Node.js 24.19.0).

```sh
cd /workspace/Myser
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev
```

The development server uses port 3000. There is no database, external AI endpoint, API key, or government integration required. All fonts and imagery are served locally; installation only requires the npm registry.

## Validation

```sh
npm run build
npm run typecheck
npm run test:e2e
```

To exercise an existing production build, use `MYSER_TEST_PRODUCTION=1 npm run test:e2e`.

The browser suite covers Arabic/English localization, cross-language assistant guidance, searching and creating a demo service request, wallet payments, meeting controls, mobile navigation, responsive widths, and keyboard focus handling. It starts its own development server on port 3100 with two workers. Avoid running two Next.js development servers in this checkout at the same time because they share `.next`.

Tests use system Chromium when `/usr/bin/chromium` exists. Else install the Playwright browser with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an installed browser. For a production smoke check, run `npm run build` followed by `npm start`, then make a local HTTP request and exercise a demo journey in a browser.

## Structure

- `app/`: Next.js routes, metadata, app icon, and responsive design system.
- `components/Homepage.tsx`: page sections and demo state/interaction orchestration.
- `components/Brand.tsx`, `SectorArt.tsx`, `PhoneMockups.tsx`: reusable identity and visual components.
- `lib/content.ts`: Arabic and English product copy.
- `public/`: optimized local WebP artwork and locally hosted variable fonts with their OFL licenses.
- `tests/`: functional browser checks.

## Demo scope

This is an independent presentation prototype with no official government affiliation. Service numbers and target users describe the concept's vision. The Saudi skyline is an artistic composition combining landmarks in Riyadh and Buraidah, rather than a documentary view of a single location. Artwork and the advisor portrait were generated for the concept.

The assistant uses local guided responses, not a live language model. Requests and payments update only in browser-session memory; reloading resets the demo. Meetings never access the camera or microphone. Mobile app store buttons display a coming-soon notice; the app mockups are not downloadable applications. No real payments or official submissions are performed.
