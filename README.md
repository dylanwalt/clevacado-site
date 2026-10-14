# ClevaCado — Marketing Site

Live site: https://clevacado.co.za
Source repository: https://github.com/dylanwalt/clevacado-site

## Local development
The current production site is the evidence-led Vite/React release in
[`website-v3/`](./website-v3/). Install its dependencies and run it locally:

```bash
cd website-v3
npm ci
npm run dev
```

Then open the Local URL Vite prints (usually `http://localhost:5173`).
The root `npm run dev`, `npm run build`, and `npm run lint` scripts also target
`website-v3/` after its dependencies are installed.

## Netlify build

Netlify is connected to this repository. Pull requests receive Deploy Previews;
updates merged into `main` publish the production site. The root
[`netlify.toml`](./netlify.toml) selects `website-v3/` as the build base, and
uses the Vite build output and the app walkthrough redirect.

The former Next.js implementation remains in the repository as preserved
source, but is no longer the production build target.

The enquiry form requires only an email address. Netlify Forms stores its
submissions; the notification to `hello@clevacado.co.za` must be configured in
Netlify Forms settings. Localhost does not transmit form values.
