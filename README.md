# Retool Custom Components Library

A modern base for building custom component libraries in [Retool](https://www.retool.com).

This template includes two ready-to-use components:
- **Gmap**: An interactive Google Map with clustering, proximity highlighting, and KML overlay support.
- **NylasAuth**: A Nylas OAuth authentication component for Google and Microsoft accounts.
- **Many More to come!**

Crafted and maintained by Miguel.

---

## Features

### Gmap

- **Marker Clustering** for large datasets
- **Proximity Highlighting**: Draws a circle and highlights nearby POIs
- **KML Layer Support**: Overlay custom KML files (e.g., transit lines)
- **Legend**: Color-coded by POI type
- **Retool State Integration**: All map state is Retool-inspectable

**Code Base Reference:**  
This component is based on the official [Google Maps Platform 101 with React](https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1) codelab.  
The codelab provides a step-by-step guide for integrating Google Maps with React, including instructions for creating your API key and Map ID.

**Usage:**
```tsx
import { Gmap } from 'retool-custom-components-library';
<Gmap />
```
Configure your Google Maps API key and Map ID in [`src/gMap/variables.ts`](src/gMap/variables.ts).  
For setup instructions, see the [Google Maps Platform 101 with React](https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1) codelab.

---

### NylasAuth

- **OAuth for Google & Microsoft** via Nylas
- **Cloudflare Worker** handles the OAuth redirect and token exchange
- **Grant ID** is returned to Retool state for downstream use
- **Customizable Email**: Pre-fill the email field

**Usage:**
```tsx
import { NylasAuth } from 'retool-custom-components-library';
<NylasAuth />
```
Set your Cloudflare Worker URL in [`src/nylas/index.tsx`](src/nylas/index.tsx) and configure your Nylas credentials in the worker’s environment.

---

## Getting Started

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Start local development**
   ```sh
   npm run dev
   ```

3. **Deploy to Retool**
   ```sh
   npm run deploy
   ```

4. **(Optional) Deploy the Nylas OAuth Worker**
   ```sh
   cd src/nylas/nylas-oauth-worker
   npm install
   npm run deploy
   ```

---

## Project Structure

- `src/gMap/` – Google Map component and helpers
- `src/nylas/` – Nylas OAuth component and Cloudflare Worker
- `src/index.tsx` – Library entry point

---

## License

MIT © Miguel

---

_This project is a friendly starting point for your own Retool custom component libraries. Contributions and suggestions are welcome!_
