// TODO Phase 3: replace STATS_DATA with GET /api/stats?range=week|month|allTime
// All other constants can be derived from the API response or kept as lookup tables.

export const FILTER_OPTIONS = [
  { key: 'week',    label: 'This Week'  },
  { key: 'month',   label: 'This Month' },
  { key: 'allTime', label: 'All Time'   },
]

export const STATS_DATA = {
  week: {
    hero: [
      { label: 'Destinations Generated', value: '94',    sub: 'this week'           },
      { label: 'Countries Explored',      value: '12',   sub: 'across 3 continents' },
      { label: 'Top Mood',                value: 'City Break', sub: '#1 this week'  },
      { label: 'Avg Estimated Price',     value: '£298', sub: 'per person · 3 nights' },
    ],
    moods: [
      { name: 'City Break', pct: 45, color: 'bg-blue-500'   },
      { name: 'Adventure',  pct: 26, color: 'bg-amber-500'  },
      { name: 'Relax',      pct: 20, color: 'bg-teal-500'   },
      { name: 'Culture',    pct:  9, color: 'bg-violet-500' },
    ],
    trending: [
      { city: 'Tallinn', country: 'Estonia',  moods: ['City Break', 'Culture'],   price: '£275', emoji: '🏙️' },
      { city: 'Krakow',  country: 'Poland',   moods: ['City Break', 'Adventure'], price: '£242', emoji: '🏰' },
      { city: 'Porto',   country: 'Portugal', moods: ['City Break', 'Relax'],     price: '£310', emoji: '🌉' },
      { city: 'Gdansk',  country: 'Poland',   moods: ['Adventure', 'Culture'],    price: '£228', emoji: '⚓' },
    ],
    feed: [
      { text: 'Someone discovered Tallinn for a City Break', time: '3 hours ago', icon: '🏙️' },
      { text: 'Adventure trip generated for Krakow',         time: '5 hours ago', icon: '🧗' },
      { text: 'City Break to Porto discovered',              time: '8 hours ago', icon: '🌉' },
      { text: 'Weekend escape generated for Gdansk',         time: '1 day ago',   icon: '⚓' },
      { text: 'Relax trip to Malaga found',                  time: '2 days ago',  icon: '🌴' },
      { text: 'Culture trip to Vienna discovered',           time: '3 days ago',  icon: '🎭' },
    ],
    activity: [
      { label: 'Mon', value: 8  },
      { label: 'Tue', value: 14 },
      { label: 'Wed', value: 11 },
      { label: 'Thu', value: 19 },
      { label: 'Fri', value: 23 },
      { label: 'Sat', value: 12 },
      { label: 'Sun', value: 7  },
    ],
    countriesCount: 12,
  },

  month: {
    hero: [
      { label: 'Destinations Generated', value: '347',  sub: 'this month'          },
      { label: 'Countries Explored',      value: '24',  sub: 'across 4 continents' },
      { label: 'Top Mood',                value: 'City Break', sub: '#1 this month' },
      { label: 'Avg Estimated Price',     value: '£312', sub: 'per person · 3 nights' },
    ],
    moods: [
      { name: 'City Break', pct: 42, color: 'bg-blue-500'   },
      { name: 'Relax',      pct: 28, color: 'bg-teal-500'   },
      { name: 'Adventure',  pct: 19, color: 'bg-amber-500'  },
      { name: 'Culture',    pct: 11, color: 'bg-violet-500' },
    ],
    trending: [
      { city: 'Tallinn', country: 'Estonia',  moods: ['City Break', 'Culture'],   price: '£275', emoji: '🏙️' },
      { city: 'Lisbon',  country: 'Portugal', moods: ['City Break', 'Culture'],   price: '£318', emoji: '🌊' },
      { city: 'Krakow',  country: 'Poland',   moods: ['City Break', 'Adventure'], price: '£242', emoji: '🏰' },
      { city: 'Valencia',country: 'Spain',    moods: ['Relax', 'Culture'],        price: '£295', emoji: '☀️' },
    ],
    feed: [
      { text: 'Someone discovered Tallinn for a City Break', time: '2 hours ago',  icon: '🏙️' },
      { text: 'Adventure trip generated for Porto',          time: '4 hours ago',  icon: '🧗' },
      { text: 'Relax getaway found in Valencia',             time: '6 hours ago',  icon: '🌴' },
      { text: 'Culture trip to Krakow discovered',           time: '9 hours ago',  icon: '🏛️' },
      { text: 'Someone discovered Lisbon for a City Break',  time: '12 hours ago', icon: '🌊' },
      { text: 'Weekend escape generated for Riga',           time: '1 day ago',    icon: '✈️' },
    ],
    activity: [
      { label: 'Week 1', value: 72  },
      { label: 'Week 2', value: 89  },
      { label: 'Week 3', value: 103 },
      { label: 'Week 4', value: 83  },
    ],
    countriesCount: 24,
  },

  allTime: {
    hero: [
      { label: 'Destinations Generated', value: '1,247', sub: 'since launch'       },
      { label: 'Countries Explored',      value: '38',   sub: 'across 5 continents' },
      { label: 'Top Mood',                value: 'City Break', sub: '#1 all time'  },
      { label: 'Avg Estimated Price',     value: '£304', sub: 'per person · 3 nights' },
    ],
    moods: [
      { name: 'City Break', pct: 40, color: 'bg-blue-500'   },
      { name: 'Relax',      pct: 29, color: 'bg-teal-500'   },
      { name: 'Adventure',  pct: 20, color: 'bg-amber-500'  },
      { name: 'Culture',    pct: 11, color: 'bg-violet-500' },
    ],
    trending: [
      { city: 'Tallinn', country: 'Estonia',  moods: ['City Break', 'Culture'],   price: '£275', emoji: '🏙️' },
      { city: 'Lisbon',  country: 'Portugal', moods: ['City Break', 'Culture'],   price: '£318', emoji: '🌊' },
      { city: 'Krakow',  country: 'Poland',   moods: ['City Break', 'Adventure'], price: '£242', emoji: '🏰' },
      { city: 'Valencia',country: 'Spain',    moods: ['Relax', 'Culture'],        price: '£295', emoji: '☀️' },
    ],
    feed: [
      { text: 'Someone discovered Tallinn for a City Break', time: '2 hours ago',  icon: '🏙️' },
      { text: 'Adventure trip generated for Porto',          time: '4 hours ago',  icon: '🧗' },
      { text: 'Relax getaway found in Valencia',             time: '6 hours ago',  icon: '🌴' },
      { text: 'Culture trip to Krakow discovered',           time: '9 hours ago',  icon: '🏛️' },
      { text: 'Someone discovered Lisbon for a City Break',  time: '12 hours ago', icon: '🌊' },
      { text: 'Weekend escape generated for Riga',           time: '1 day ago',    icon: '✈️' },
      { text: 'Adventure getaway generated for Reykjavik',   time: '2 days ago',   icon: '🌋' },
      { text: 'Culture trip to Budapest discovered',         time: '3 days ago',   icon: '🏛️' },
    ],
    activity: [
      { label: 'Jan', value: 82  },
      { label: 'Feb', value: 94  },
      { label: 'Mar', value: 108 },
      { label: 'Apr', value: 127 },
      { label: 'May', value: 156 },
      { label: 'Jun', value: 178 },
      { label: 'Jul', value: 203 },
      { label: 'Aug', value: 189 },
      { label: 'Sep', value: 142 },
      { label: 'Oct', value: 119 },
      { label: 'Nov', value: 98  },
      { label: 'Dec', value: 151 },
    ],
    countriesCount: 38,
  },
}

export const REGIONS = [
  { label: 'Nordic & Baltic', destinations: ['Stockholm', 'Copenhagen', 'Reykjavik', 'Tallinn', 'Riga', 'Edinburgh'] },
  { label: 'Western Europe',  destinations: ['London', 'Paris', 'Amsterdam', 'Dublin'] },
  { label: 'Central Europe',  destinations: ['Prague', 'Budapest', 'Vienna', 'Krakow'] },
  { label: 'Iberia & Med',    destinations: ['Lisbon', 'Porto', 'Barcelona', 'Valencia', 'Dubrovnik', 'Thessaloniki'] },
]

// Currently trending — stronger badge style + fire icon
export const HOT_DESTINATIONS = new Set(['Tallinn', 'Lisbon'])

export const EXPLORATION_METRICS = [
  { icon: '🌍', label: 'Most explored',    value: 'Europe'         },
  { icon: '📈', label: 'Fastest growing',  value: 'Adventure'      },
  { icon: '✨', label: 'New this week',    value: '14 destinations' },
]

// Abstract dot positions for SVG route layer (evocative, not geographic)
// TODO Phase 3: replace with real lat/lng from generations table
export const ROUTE_DOTS = [
  [72, 52], [145, 88], [205, 168], [332, 52],
  [384, 82], [455, 152], [425, 28],
]

export const ROUTE_PATHS = [
  'M 72 52 Q 185 22 332 52',
  'M 145 88 Q 265 62 384 82',
  'M 145 88 Q 195 128 205 168',
  'M 384 82 Q 432 108 455 152',
  'M 205 168 Q 325 195 455 152',
  'M 332 52 Q 368 38 425 28',
]
