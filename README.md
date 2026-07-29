# Road Trip Explorer

A kid-friendly road trip scavenger hunt: a toggleable bingo card / checklist of things
to spot, with an optional live route map and "where am I right now" map powered by
Google Maps.

## Running it

No build step — it's plain HTML/CSS/JS. Two ways to run it:

1. **Just open it**: double-click `index.html`.
2. **Recommended — run a tiny local server** (more reliable geolocation/maps behavior):

   ```bash
   cd "road-trip-explorer"
   python3 -m http.server 8080
   ```

   Then visit `http://localhost:8080` on your phone/tablet (same wifi network) or laptop.

You can also just upload the folder to any static host (GitHub Pages, Netlify, Vercel)
to use it on the road over cell data.

## Google Maps setup (optional)

The bingo/checklist game works with **no setup at all**. If you also want the route
map and live "find me" map, you need a free Google Maps **Embed API** key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials).
2. Create (or pick) a project.
3. Under **APIs & Services → Library**, enable **Maps Embed API**.
4. Under **APIs & Services → Credentials**, create an **API key**.
5. (Recommended) Restrict the key to the **Maps Embed API** and to your website's domain,
   or leave unrestricted for local/personal use.
6. Paste the key into the app on the setup screen (or later in **Settings**).

The Maps Embed API is free with no billing account required (as of this writing —
double check current Google pricing before relying on it).

## How it works

- **Bingo tab**: a 5x5 board (with a free center space) drawn from a themed pool of
  things to spot. Tap a square when you find it.
- **Checklist tab**: the full list of things to find for your chosen scenery/region,
  grouped by category — same underlying items as the bingo board, just a different view.
  Marking something found in one view marks it found in the other too.
- **Region themes**: pick Desert, Coastal, Mountains, Farmland, Forest, Urban, or Mixed —
  this filters which items show up (a desert trip won't ask you to find a lighthouse).
- **Points**: 1 = common, 3 = uncommon, 5 = rare/bonus — good for mixed-age groups since
  younger kids can rack up easy 1-pointers while older kids hunt for rare finds.
- **Progress saves locally** in the browser (`localStorage`) on that device only, so it
  survives refreshes/closing the tab but doesn't sync across devices.
- **Map tab**: shows your planned route (if you entered a start/destination) and a button
  to re-center a map on your current GPS location using the browser's geolocation API.

## Customizing the item pool

Edit `items.js` — each entry is:

```js
{ id: 'cactus', emoji: '🌵', label: 'Cactus', points: 1, regions: ['desert'], category: 'Nature', fact: 'optional fun fact' }
```

`regions` can include `'any'` (always shown) plus any of `desert`, `coastal`, `mountains`,
`farmland`, `forest`, `urban`. Add new regions in the `REGIONS` array at the bottom of
the same file.
