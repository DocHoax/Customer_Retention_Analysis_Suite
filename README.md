# Customer Retention Analysis Suite

This repository contains a Vite frontend and Vercel-ready API routes for customer retention analysis, simulation, model training, and automated cohort reporting.

## Local Development

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Start the local server:
   `npm run dev`

## Vercel Deployment

The repo is already structured for Vercel with `/api` serverless functions and a `vercel.json` configuration.

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Keep the default build settings or use the values in `vercel.json`:
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
4. Deploy.

## Notes

- The simulation and model-analysis endpoints are stateless on Vercel. The frontend sends the active customer dataset back to the API when recalculating models or generating the advisory report.
- If you want persistent server-side state between sessions, add a database or KV store later.
