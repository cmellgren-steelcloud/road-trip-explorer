// Hardcoded road trip routes: Kansas City, MO -> Tawas City, MI
// No external map API — coordinates are hand-placed on a stylized SVG (viewBox 0 0 870 560)
// covering just the KC-to-Michigan region, not a precise geographic projection.
// "mile" on each stop is an approximate cumulative driving distance for that specific route,
// used for the progress bar and for deciding which route segments count as "traveled."
//
// Two kinds of special stops, beyond regular cities:
//   - milestone: true   -> a fun named stop (e.g. an ice cream landmark)
//   - stateLine: true    -> a "you just crossed into a new state" checkpoint
// Both support `emoji` (shown on the marker) and `shortLabel` (compact on-map text;
// the full `name` is still used in the stop list and status text).

const CITIES = {
  'kansas-city':    { name: 'Kansas City, MO',  x: 40,  y: 480 },
  'columbia-mo':    { name: 'Columbia, MO',      x: 187, y: 500 },
  'st-joseph-mo':   { name: 'St. Joseph, MO',    x: 57,  y: 427 },
  'des-moines':     { name: 'Des Moines, IA',    x: 106, y: 267 },
  'iowa-city-ia':   { name: 'Iowa City, IA',     x: 245, y: 259 },
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

  // State-line crossings — same real crossing can be reused across routes that
  // travel that corridor; each route just assigns its own mile value to it.
  'enter-iowa':       { name: 'Entering Iowa',     shortLabel: '🪧 IA', x: 80,  y: 352, stateLine: true, emoji: '🪧' },
  'enter-illinois':   { name: 'Entering Illinois', shortLabel: '🪧 IL', x: 337, y: 510, stateLine: true, emoji: '🪧' },
  'enter-illinois-b': { name: 'Entering Illinois', shortLabel: '🪧 IL', x: 318, y: 255, stateLine: true, emoji: '🪧' },
  'enter-indiana-a':  { name: 'Entering Indiana',  shortLabel: '🪧 IN', x: 559, y: 423, stateLine: true, emoji: '🪧' },
  'enter-michigan-a': { name: 'Entering Michigan', shortLabel: '🪧 MI', x: 719, y: 261, stateLine: true, emoji: '🪧' },
  'enter-indiana-bc':  { name: 'Entering Indiana',  shortLabel: '🪧 IN', x: 532, y: 253, stateLine: true, emoji: '🪧' },
  'enter-michigan-bc': { name: 'Entering Michigan', shortLabel: '🪧 MI', x: 558, y: 262, stateLine: true, emoji: '🪧' },
};

const ROUTES = [
  {
    id: 'route-a',
    name: '🛣️ Route A',
    via: 'via St. Louis, Indianapolis & Fort Wayne',
    stops: [
      { city: 'kansas-city',     mile: 0   },
      { city: 'columbia-mo',     mile: 125 },
      { city: 'st-louis',        mile: 250 },
      { city: 'enter-illinois',  mile: 260 },
      { city: 'springfield-il',  mile: 345 },
      { city: 'enter-indiana-a', mile: 490 },
      { city: 'indianapolis',    mile: 525 },
      { city: 'fort-wayne',      mile: 645 },
      { city: 'enter-michigan-a', mile: 700 },
      { city: 'ann-arbor',       mile: 755 },
      { city: 'flint',           mile: 815 },
      { city: 'bay-city',        mile: 865 },
      { city: 'tawas',           mile: 920 },
    ],
  },
  {
    id: 'route-b',
    name: '🌽 Route B',
    via: 'via Des Moines & Chicago — 🍦 Rainbow Cone stop!',
    stops: [
      { city: 'kansas-city',       mile: 0   },
      { city: 'st-joseph-mo',      mile: 50  },
      { city: 'enter-iowa',        mile: 120 },
      { city: 'des-moines',        mile: 200 },
      { city: 'iowa-city-ia',      mile: 315 },
      { city: 'enter-illinois-b',  mile: 375 },
      { city: 'chicago',           mile: 530 },
      { city: 'enter-indiana-bc',  mile: 545 },
      { city: 'enter-michigan-bc', mile: 575 },
      { city: 'rainbow-cone',      mile: 595 },
      { city: 'kalamazoo',         mile: 670 },
      { city: 'lansing',           mile: 740 },
      { city: 'flint',             mile: 795 },
      { city: 'bay-city',          mile: 840 },
      { city: 'tawas',             mile: 895 },
    ],
  },
  {
    id: 'route-c',
    name: '🏙️ Route C',
    via: 'via Springfield & Joliet — 🍦 Rainbow Cone stop!',
    stops: [
      { city: 'kansas-city',       mile: 0   },
      { city: 'columbia-mo',       mile: 125 },
      { city: 'st-louis',          mile: 250 },
      { city: 'enter-illinois',    mile: 260 },
      { city: 'springfield-il',    mile: 345 },
      { city: 'joliet',            mile: 545 },
      { city: 'enter-indiana-bc',  mile: 590 },
      { city: 'enter-michigan-bc', mile: 620 },
      { city: 'rainbow-cone',      mile: 645 },
      { city: 'kalamazoo',         mile: 720 },
      { city: 'lansing',           mile: 790 },
      { city: 'flint',             mile: 845 },
      { city: 'bay-city',          mile: 890 },
      { city: 'tawas',             mile: 945 },
    ],
  },
];

const DEFAULT_ROUTE_ID = 'route-a';

function getRoute(routeId) {
  return ROUTES.find(r => r.id === routeId) || ROUTES.find(r => r.id === DEFAULT_ROUTE_ID);
}
