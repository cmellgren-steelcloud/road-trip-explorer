# Road Trip Explorer

A kid-friendly road trip scavenger hunt: a toggleable bingo card / checklist of things
to spot, plus a hardcoded (no API key, no external service) map of the drive from
Kansas City, MO to Tawas City, MI with tappable city checkpoints and a mileage progress bar.

## Running it

No build step — it's plain HTML/CSS/JS. Two ways to run it:

1. **Just open it**: double-click `index.html`.
2. **Recommended — run a tiny local server**:

   ```bash
   cd "road-trip-explorer"
   python3 -m http.server 8080
   ```

   Then visit `http://localhost:8080` on your phone/tablet (same wifi network) or laptop.

You can also just upload the folder to any static host (GitHub Pages, Netlify, Vercel)
to use it on the road over cell data. Nothing in this app calls out to a third-party
API, so it works fully offline once loaded (and re-visited once so the browser caches it).

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
- **Map tab**: a stylized, hand-drawn (not geographically precise), zoomed-in SVG map
  covering just the Kansas City–to–Michigan region, with a marker for each major city
  along the way. Tap a city (on the map or in the list below it) when you actually drive
  past it — the route line fills in green up to that point and the progress bar updates
  in miles.
- **Three route options** — pick one on the setup screen (or switch later via **⚙️ Settings**
  or the **🔀 Change Route** button on the Map tab):
  - **Route A**: via St. Louis, Indianapolis & Fort Wayne (920 mi)
  - **Route B**: via Des Moines & Chicago (895 mi)
  - **Route C**: via Springfield & Joliet (945 mi)

  Routes B and C both swing through **The Original Rainbow Cone** in New Buffalo, MI —
  shown as a special gold milestone marker (🍦) on the map. Switching routes resets that
  route's checkpoint progress.

## Customizing the routes

Edit `route.js`:

- `CITIES` is a lookup of every stop used by any route: `{ name, x, y }` (plus optional
  `subtitle`, `milestone: true`, `emoji`, and `shortLabel` for special stops like the
  Rainbow Cone). `x`/`y` are hand-placed pixel coordinates on the map's `0 0 870 560` SVG
  canvas (not a real map projection — just enough to look right).
- `ROUTES` is the list of selectable routes, each an ordered array of `{ city, mile }`
  stops referencing `CITIES` by id. `mile` is the approximate cumulative driving distance
  for that specific route, used for the progress bar and for deciding which route segments
  show as "traveled."

To add or change a route, add/edit entries in `CITIES` and `ROUTES`. If a new route needs
geography outside the current map's bounds, also adjust the static land/lake shapes in
`index.html`'s `#route-map-svg`.

## Customizing the item pool

Edit `items.js` — each entry is:

```js
{ id: 'cactus', emoji: '🌵', label: 'Cactus', points: 1, regions: ['desert'], category: 'Nature', fact: 'optional fun fact' }
```

`regions` can include `'any'` (always shown) plus any of `desert`, `coastal`, `mountains`,
`farmland`, `forest`, `urban`. Add new regions in the `REGIONS` array at the bottom of
the same file.
