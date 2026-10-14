# ClevaCado Website V3

This is the third ClevaCado landing-page release. It is a Vite/React static site prepared for the existing Netlify production site and its `clevacado.com` and `clevacado.co.za` domains.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies: `npm install`
2. Run the app: `npm run dev`
3. Build for production: `npm run build`

Field enquiries use Netlify Forms; email is the only required field. Leaving the email field with a valid address sends the email and any details entered so far as an early follow-up; pressing Send enquiry shares any later changes. This behavior is disclosed above the form. Netlify email notifications to `hello@clevacado.co.za` must be configured in the site dashboard after the form is detected by a deploy. The localhost preview never sends or stores enquiry contents and clearly identifies itself as a preview. The hero includes the single user-supplied, locally hosted 40-second illustrative MP4; it autoplays muted with controls and is not footage of an operating trial.

The six-part landing page combines current progress, the company journey timeline and concise founder role summaries. The About section links to the [Digital Smart Lab Group 03 public project page](https://dsllab.app/projects/group-03/), which describes the sensor-instrumented avocado proxy and controlled handling-event classification investigation.

The site also includes a small first-party analytics system using Netlify Functions and Netlify Blobs. It records aggregate event counts and one-way server-side viewer fingerprints without storing raw IP addresses or form contents. The footer’s Private analytics control opens a password-gated dashboard backed by a server-side password hash.

The standalone customer app demonstration is served at `/mobile-app-walkthrough` for the poster QR code. It is illustrative demo data and runs independently of the main React landing page.

## ClevaCado Live simulated preview — 3 October 2026

`/live/` reproduces the six-tab testing dashboard with browser-generated data,
markers/Redo, environment history/equations, noise-reference display and a fading
3D trail. The navbar links to it on desktop and mobile. A persistent simulation
banner identifies it; no ESP32, localhost receiver, credentials or sensor API
is contacted. Still, Shake and Impact control the illustrative motion.
Environment trends are accelerated; no physical performance is implied.
Exports are clearly named SIMULATED: recent downsampled CSVs or session JSON,
not a real acquisition ZIP.

To refresh shared display code after a prototype UI change, run
`python3 tools/sync_live_demo.py` from this site folder, then the established
`npm run build` and `npm run lint`. Prototype submodule must be initialized.
This change is prepared in source/Git; production Netlify deployment is separate.
