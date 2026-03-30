import { useMemo } from 'react'
import { TYPE_META, fmt } from '../constants'
import styles from './HoldingsChart.module.css'

export default function HoldingsChart({ items }) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 10),
    [items]
  )

  const maxVal = sorted[0]?.value || 1

  if (sorted.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.title}>🏅 Top Holdings</div>
        <div className={styles.empty}>Add items to see your top holdings!</div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.titleRow}>
        <span className={styles.title}>🏅 Top Holdings</span>
        <span className={styles.sub}>by value · top {sorted.length}</span>
      </div>

      <div className={styles.bars}>
        {sorted.map((item, i) => {
          const meta  = TYPE_META[item.type] ?? TYPE_META.Other
          const pct   = ((item.value || 0) / maxVal) * 100
          return (
            <div key={item.id} className={styles.row}>
              <div className={styles.rank}>#{i + 1}</div>
              <div className={styles.info}>
                <div className={styles.name}>
                  <span className={styles.emoji}>{meta.emoji}</span>
                  <span>{item.name}</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${pct}%`,
                      background: meta.color,
                      animationDelay: `${i * 60}ms`,
                    }}
                  />
                </div>
              </div>
              <div className={styles.val}>{fmt(item.value)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
