# Road Trip Explorer

A kid-friendly road trip scavenger hunt: a toggleable bingo card / checklist of things
to spot, a hardcoded (no API key, no external service) map of the drive from
Kansas City, MO to Tawas City, MI with tappable city checkpoints and a mileage progress bar,
and a 50-state license plate spotting game.

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
  survives refreshes/closing the tab but doesn't sync across devices — this applies to
  every part of the app, including the plates game below. There's no backend, so nothing
  is shared between different phones/devices.
- **Plates tab**: the classic road-trip license plate game — tap a state when you spot
  its plate. Includes all 50 states, plus a separate "Bonus Plates" section below for
  rarer finds: Washington D.C., the 10 Canadian provinces, Mexico, Puerto Rico, U.S.
  Government plates, and Native Nation plates. Has its own progress bar, persists exactly
  like everything else in the app (survives refreshes, closed tabs, and coming back days
  later — see the persistence note above), and a "Clear Plate Board" button that can be
  undone for a few seconds afterward in case of a stray tap.
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
- **Extra stops & state-line crossings**: each route also includes additional waypoints
  through Iowa and Missouri (Columbia/St. Joseph, MO and Des Moines/Iowa City, IA), plus
  a small dashed "🪧 Entering [State]" checkpoint every time the route crosses into a new
  state — Route A has 2 of these, Routes B and C have 3 each.
- **4 visual styles** — pick one on the setup screen, or change anytime via **⚙️ Settings**:
  Classic, Olympus Odyssey (Greek-myth adventure, gold & parchment), Arena Games (dark,
  dystopian-competition look), and Dachshund (warm, cozy dog theme). The style is a
  separate, standalone preference (its own `localStorage` key) — it survives even a full
  "Reset Entire Trip," and previews live as you click through the options.

## Customizing the routes

Edit `route.js`:

- `CITIES` is a lookup of every stop used by any route: `{ name, x, y }` (plus optional
  `subtitle`, `milestone: true`, `stateLine: true`, `emoji`, and `shortLabel` for special
  stops like the Rainbow Cone or a state-line crossing). `x`/`y` are hand-placed pixel
  coordinates on the map's `0 0 870 560` SVG canvas (not a real map projection — just
  enough to look right).
- `ROUTES` is the list of selectable routes, each an ordered array of `{ city, mile }`
  stops referencing `CITIES` by id. `mile` is the approximate cumulative driving distance
  for that specific route, used for the progress bar and for deciding which route segments
  show as "traveled." The same state-line `CITIES` entry can be (and is) reused by more
  than one route when they cross at roughly the same real-world spot — each route just
  assigns it its own `mile`.

To add or change a route, add/edit entries in `CITIES` and `ROUTES`. If a new route needs
geography outside the current map's bounds, also adjust the static land/lake shapes in
`index.html`'s `#route-map-svg`.

## Customizing or adding a style

Edit the `THEMES` array and the `html[data-theme="..."]` blocks in `styles.css`'s `:root`
section. Every visual choice — colors, card/page backgrounds, map land/lake colors, font,
even whether headings go uppercase — is a CSS variable, so a new theme is just a new
`html[data-theme="yourtheme"] { --sunny: ...; }` block plus a matching entry in the
`THEMES` array in `app.js` (emoji, display name, title emoji, and setup-screen subtitle).
No JS changes needed beyond that entry.

## Wanting the license plate board to sync across devices

Right now it's per-device only (`localStorage`), same as everything else in the app.
Making it genuinely global — where one person tapping a state updates it for every visitor
of the site — needs a real backend, since GitHub Pages only serves static files with no
server or database of its own. That means standing up something like a free Firebase
Realtime Database or Supabase project (you'd create the account; the API key/URL it gives
you is safe to put in client-side code) and adding read/write calls in `renderPlates()` /
`togglePlate()` in `app.js`. Worth knowing: this app has no user accounts, so a fully open
shared board also means any visitor could clear or spam it — there's no built-in way to
restrict who can edit it without adding real authentication too.

## Customizing the item pool

Edit `items.js` — each entry is:

```js
{ id: 'cactus', emoji: '🌵', label: 'Cactus', points: 1, regions: ['desert'], category: 'Nature', fact: 'optional fun fact' }
```

`regions` can include `'any'` (always shown) plus any of `desert`, `coastal`, `mountains`,
`farmland`, `forest`, `urban`. Add new regions in the `REGIONS` array at the bottom of
the same file.
