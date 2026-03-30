import { TYPE_META, fmt } from '../constants'
import styles from './StatsBar.module.css'

export default function StatsBar({ items }) {
  const total   = items.reduce((s, i) => s + (i.value || 0), 0)
  const top     = items.reduce((a, b) => ((b.value || 0) > (a.value || 0) ? b : a), items[0] ?? {})
  const avg     = items.length ? total / items.length : 0
  const presentCats = [...new Set(items.map(i => i.type))].map(t => TYPE_META[t]?.emoji + ' ' + t)

  return (
    <div className={styles.bar}>
      <StatCard
        emoji="💰"
        label="Portfolio Value"
        value={fmt(total)}
        accent="#6C63FF"
        sub={`${items.length} holdings`}
      />
      <StatCard
        emoji="🏆"
        label="Top Holding"
        value={top?.name ? top.name.split(' ').slice(0, 3).join(' ') : '—'}
        accent="#F59E0B"
        sub={fmt(top?.value)}
      />
      <StatCard
        emoji="📊"
        label="Avg Value"
        value={fmt(avg)}
        accent="#10B981"
        sub={`across ${items.length} items`}
      />
      <StatCard
        emoji="🗂️"
        label="Categories"
        value={presentCats.length}
        accent="#EC4899"
        sub={presentCats.join(', ') || '—'}
      />
    </div>
  )
}

function StatCard({ emoji, label, value, accent, sub }) {
  return (
    <div className={styles.card} style={{ '--accent': accent }}>
      <div className={styles.cardTop}>
        <span className={styles.emoji}>{emoji}</span>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.sub}>{sub}</div>
    </div>
  )
}
