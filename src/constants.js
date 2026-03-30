// category display config — emoji, accent color, chart color for cartoony style
export const TYPE_META = {
  TCG:    { label: 'TCG',    emoji: '🃏', color: '#6C63FF', light: '#EDE9FF', chart: '#6C63FF' },
  Sports: { label: 'Sports', emoji: '⚾', color: '#EF4444', light: '#FFE5E5', chart: '#EF4444' },
  Coins:  { label: 'Coins',  emoji: '🪙', color: '#F59E0B', light: '#FEF3C7', chart: '#F59E0B' },
  Comics: { label: 'Comics', emoji: '📚', color: '#EC4899', light: '#FCE7F3', chart: '#EC4899' },
  Other:  { label: 'Other',  emoji: '📦', color: '#10B981', light: '#D1FAE5', chart: '#10B981' },
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

export const SAMPLE_ITEMS = []

export const fmt = (n) => {
  if (!n && n !== 0) return '—'
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000)     return '$' + Math.round(n).toLocaleString()
  return '$' + Math.round(n)
}

export const SLOTS_PER_PAGE = 9
