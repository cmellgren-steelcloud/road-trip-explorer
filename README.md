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
- **Map tab**: a stylized, hand-drawn (not geographically precise) SVG map of the
  Kansas City → Tawas City route, with a marker for each major city along the way.
  Tap a city (on the map or in the list below it) when you actually drive past it —
  the route line fills in green up to that point and the progress bar updates in miles.

## Customizing the route

Edit `route.js` — `ROUTE_STOPS` is an ordered array of checkpoints:

```js
{ id: 'st-louis', name: 'St. Louis, MO', x: 420, y: 230, mile: 250 }
```

`x`/`y` are hand-placed pixel coordinates on the map's `0 0 900 550` SVG canvas (not a
real map projection — just enough to look right), and `mile` is the approximate
cumulative driving distance from the start, used for the progress bar and for deciding
which route segments show as "traveled." To change the trip, edit the stops (and the
static map background/lakes in `index.html`'s `#route-map-svg` if the new route needs
different geography shown).

## Customizing the item pool

Edit `items.js` — each entry is:

```js
{ id: 'cactus', emoji: '🌵', label: 'Cactus', points: 1, regions: ['desert'], category: 'Nature', fact: 'optional fun fact' }
```

`regions` can include `'any'` (always shown) plus any of `desert`, `coastal`, `mountains`,
`farmland`, `forest`, `urban`. Add new regions in the `REGIONS` array at the bottom of
the same file.
