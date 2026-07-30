// Hardcoded road trip route: Kansas City, MO -> Tawas City, MI
// No external map API — coordinates are hand-placed on a stylized SVG (viewBox 0 0 900 550),
// not a precise geographic projection. "mile" is an approximate cumulative driving distance,
// used for the progress bar and to decide which route segments count as "traveled".

const ROUTE_STOPS = [
  { id: 'kansas-city',    name: 'Kansas City, MO',   x: 330, y: 230, mile: 0   },
  { id: 'st-louis',       name: 'St. Louis, MO',     x: 420, y: 230, mile: 250 },
  { id: 'springfield-il', name: 'Springfield, IL',   x: 480, y: 205, mile: 345 },
  { id: 'indianapolis',   name: 'Indianapolis, IN',  x: 560, y: 210, mile: 525 },
  { id: 'fort-wayne',     name: 'Fort Wayne, IN',    x: 600, y: 195, mile: 645 },
  { id: 'ann-arbor',      name: 'Ann Arbor, MI',     x: 655, y: 175, mile: 755 },
  { id: 'flint',          name: 'Flint, MI',         x: 662, y: 145, mile: 815 },
  { id: 'bay-city',       name: 'Bay City, MI',      x: 672, y: 112, mile: 865 },
  { id: 'tawas',          name: 'Tawas City, MI',    x: 686, y: 95,  mile: 920 },
];

const ROUTE_TOTAL_MILES = ROUTE_STOPS[ROUTE_STOPS.length - 1].mile;
