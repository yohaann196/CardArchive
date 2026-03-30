import { TYPE_META } from '../constants'
import styles from './FilterBar.module.css'

const CATS = ['all', 'TCG', 'Sports', 'Coins', 'Comics', 'Other']

export default function FilterBar({ filter, onFilter, items }) {
  // count per category so the chips show how many items are in each
  const counts = Object.fromEntries(
    CATS.map(c => [c, c === 'all' ? items.length : items.filter(i => i.type === c).length])
  )

  return (
    <div className={styles.bar}>
      <span className={styles.label}>Collection</span>
      <div className={styles.chips}>
        {CATS.map(cat => {
          const isActive = filter === cat
          const meta = TYPE_META[cat]
          return (
            <button
              key={cat}
              className={`${styles.chip} ${isActive ? styles.active : ''}`}
              onClick={() => onFilter(cat)}
              style={isActive && meta ? { '--chip-color': meta.color, '--chip-glow': meta.glow } : undefined}
            >
              {meta && <span className={styles.emoji}>{meta.emoji}</span>}
              {cat === 'all' ? 'All' : cat}
              {counts[cat] > 0 && <span className={styles.count}>{counts[cat]}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
