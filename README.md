# ClevaCado — Marketing Site

Live site: https://clevacado.co.za
Source repository: https://github.com/dylanwalt/clevacado-site

## Local development
Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Netlify build

Netlify is connected to this repository. Pull requests receive Deploy Previews;
updates merged into `main` publish the production site. Build settings:

- Build command: `npm run build`
- Publish directory: `out`
- Base directory: repository root

The site is a Next.js static export (`output: "export"`). Keep routes and forms
compatible with static hosting. Netlify Forms detection must be enabled in the
site dashboard; the pilot form uses `public/__forms.html` as its static form
definition and submits to that file.

## Static export
This project is configured to run as a static export (GitHub Pages friendly).

```bash
npm run build
```

The export output is generated into `out/`.
