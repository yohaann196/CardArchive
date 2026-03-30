// category display config — emoji, accent color, glow for hover states
export const TYPE_META = {
  TCG:    { label: 'TCG',    emoji: '🃏', color: '#4080c0', glow: 'rgba(64,128,192,0.2)'  },
  Sports: { label: 'Sports', emoji: '⚾', color: '#c04040', glow: 'rgba(192,64,64,0.2)'   },
  Coins:  { label: 'Coins',  emoji: '🪙', color: '#c08040', glow: 'rgba(192,128,64,0.2)'  },
  Comics: { label: 'Comics', emoji: '📚', color: '#8060c0', glow: 'rgba(128,96,192,0.2)'  },
  Other:  { label: 'Other',  emoji: '📦', color: '#40a060', glow: 'rgba(64,160,96,0.2)'   },
}

export const GRADES = [
  'PSA 10', 'PSA 9', 'PSA 8', 'PSA 7',
  'BGS 10', 'BGS 9.5', 'BGS 9',
  'CGC 9.8', 'CGC 9.6', 'CGC 9.4',
  'Raw NM', 'Raw VG', 'Ungraded',
]

// returns display info for a grade string
// a bit rough but works for everything we currently have
export const GRADE_META = (g = '') => {
  if (g.includes('10') || g.includes('9.8'))
    return { label: g, cls: 'gem', color: '#40a060' }
  if (g.includes('9.5') || (g.includes('9') && !g.includes('9.')))
    return { label: g, cls: 'mint', color: '#4080c0' }
  if (g.includes('8'))
    return { label: g, cls: 'nm', color: '#c09030' }
  return { label: g || 'Raw', cls: 'raw', color: '#7a6848' }
}

export const SAMPLE_ITEMS = [
  { id: 1, name: 'Charizard Base Set Holo',  set: 'Base Set 1st Edition',  type: 'TCG',    grade: 'PSA 9',   value: 3200,    year: 1999, notes: 'One of my earliest grails. Perfect centering.' },
  { id: 2, name: 'Black Lotus',              set: 'Alpha Edition',          type: 'TCG',    grade: 'BGS 9.5', value: 42000,   year: 1993, notes: 'The holy grail of Magic. Reserved for display only.' },
  { id: 3, name: 'Michael Jordan Rookie',    set: 'Fleer 1986-87',          type: 'Sports', grade: 'PSA 10',  value: 22000,   year: 1986, notes: 'Flawless corners, no print lines. Bought from an estate sale.' },
  { id: 4, name: 'Honus Wagner T206',        set: 'T206 White Border',      type: 'Sports', grade: 'Raw NM',  value: 350000,  year: 1909, notes: 'The rarest card in existence. Trimmed history unknown.' },
  { id: 5, name: '1909-S VDB Lincoln Cent',  set: 'US Mint Philadelphia',   type: 'Coins',  grade: 'PSA 10',  value: 9500,    year: 1909, notes: 'Key date cent. Original luster, sharp strike on wheat stalks.' },
  { id: 6, name: 'Amazing Fantasy #15',      set: 'Marvel Comics',          type: 'Comics', grade: 'CGC 9.8', value: 1200000, year: 1962, notes: 'First Spider-Man. Only 1 copy in 9.8.' },
  { id: 7, name: 'Umbreon Gold Star',        set: 'POP Series 5',           type: 'TCG',    grade: 'PSA 9',   value: 8000,    year: 2006, notes: 'My favorite Pokémon illustration. Near impossible pull.' },
  { id: 8, name: 'Mickey Mantle 1952 Topps', set: 'Topps Baseball Series',  type: 'Sports', grade: 'PSA 8',   value: 85000,   year: 1952, notes: 'The definitive postwar American baseball card.' },
  { id: 9, name: 'Pikachu Illustrator',      set: 'CoroCoro Comic Promo',   type: 'TCG',    grade: 'PSA 8',   value: 180000,  year: 1998, notes: 'Given only to winners of the 1997-98 Illustration Contest.' },
]

export const fmt = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000)     return '$' + Math.round(n).toLocaleString()
  return '$' + Math.round(n)
}

export const SLOTS_PER_PAGE = 9
