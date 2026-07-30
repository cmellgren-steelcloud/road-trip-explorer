// Hardcoded road trip routes: Kansas City, MO -> Tawas City, MI
// No external map API — coordinates are hand-placed on a stylized SVG (viewBox 0 0 870 560)
// covering just the KC-to-Michigan region, not a precise geographic projection.
// "mile" on each stop is an approximate cumulative driving distance for that specific route,
// used for the progress bar and for deciding which route segments count as "traveled."

const CITIES = {
  'kansas-city':    { name: 'Kansas City, MO',  x: 40,  y: 480 },
  'des-moines':     { name: 'Des Moines, IA',    x: 106, y: 267 },
  'st-louis':       { name: 'St. Louis, MO',     x: 333, y: 520 },
  'springfield-il': { name: 'Springfield, IL',   x: 370, y: 422 },
  'joliet':         { name: 'Joliet, IL',        x: 475, y: 273 },
  'chicago':        { name: 'Chicago, IL',       x: 505, y: 243 },
  'rainbow-cone':   { name: 'The Original Rainbow Cone', shortLabel: '🍦 Rainbow Cone', subtitle: 'New Buffalo, MI', x: 585, y: 272, milestone: true, emoji: '🍦' },
  'indianapolis':   { name: 'Indianapolis, IN',  x: 604, y: 423 },
  'fort-wayne':     { name: 'Fort Wayne, IN',    x: 672, y: 312 },
  'kalamazoo':      { name: 'Kalamazoo, MI',     x: 642, y: 209 },
  'lansing':        { name: 'Lansing, MI',       x: 711, y: 171 },
  'ann-arbor':      { name: 'Ann Arbor, MI',     x: 766, y: 209 },
  'flint':          { name: 'Flint, MI',         x: 769, y: 146 },
  'bay-city':       { name: 'Bay City, MI',      x: 756, y: 98  },
  'tawas':          { name: 'Tawas City, MI',    x: 780, y: 40  },
};

const ROUTES = [
  {
    id: 'route-a',
    name: '🛣️ Route A',
    via: 'via St. Louis, Indianapolis & Fort Wayne',
    stops: [
      { city: 'kansas-city',    mile: 0   },
      { city: 'st-louis',       mile: 250 },
      { city: 'springfield-il', mile: 345 },
      { city: 'indianapolis',   mile: 525 },
      { city: 'fort-wayne',     mile: 645 },
      { city: 'ann-arbor',      mile: 755 },
      { city: 'flint',          mile: 815 },
      { city: 'bay-city',       mile: 865 },
      { city: 'tawas',          mile: 920 },
    ],
  },
  {
    id: 'route-b',
    name: '🌽 Route B',
    via: 'via Des Moines & Chicago — 🍦 Rainbow Cone stop!',
    stops: [
      { city: 'kansas-city',  mile: 0   },
      { city: 'des-moines',   mile: 200 },
      { city: 'chicago',      mile: 530 },
      { city: 'rainbow-cone', mile: 595 },
      { city: 'kalamazoo',    mile: 670 },
      { city: 'lansing',      mile: 740 },
      { city: 'flint',        mile: 795 },
      { city: 'bay-city',     mile: 840 },
      { city: 'tawas',        mile: 895 },
    ],
  },
  {
    id: 'route-c',
    name: '🏙️ Route C',
    via: 'via Springfield & Joliet — 🍦 Rainbow Cone stop!',
    stops: [
      { city: 'kansas-city',    mile: 0   },
      { city: 'st-louis',       mile: 250 },
      { city: 'springfield-il', mile: 345 },
      { city: 'joliet',         mile: 545 },
      { city: 'rainbow-cone',   mile: 645 },
      { city: 'kalamazoo',      mile: 720 },
      { city: 'lansing',        mile: 790 },
      { city: 'flint',          mile: 845 },
      { city: 'bay-city',       mile: 890 },
      { city: 'tawas',          mile: 945 },
    ],
  },
];

const DEFAULT_ROUTE_ID = 'route-a';

function getRoute(routeId) {
  return ROUTES.find(r => r.id === routeId) || ROUTES.find(r => r.id === DEFAULT_ROUTE_ID);
}
