import { useMemo } from 'react'
import { TYPE_META, fmt } from '../constants'
import styles from './AllocationChart.module.css'

const CX = 90
const CY = 90
const R  = 68
const INNER_R = 44

export default function AllocationChart({ items }) {
  const slices = useMemo(() => {
    const total = items.reduce((s, i) => s + (i.value || 0), 0)
    if (total === 0) return []

    const byType = {}
    for (const item of items) {
      byType[item.type] = (byType[item.type] || 0) + (item.value || 0)
    }

    let startAngle = -Math.PI / 2
    return Object.entries(byType)
      .sort((a, b) => b[1] - a[1])
      .map(([type, val]) => {
        const pct   = val / total
        const sweep = pct * 2 * Math.PI
        const meta  = TYPE_META[type] ?? TYPE_META.Other
        const slice = { type, val, pct, startAngle, sweep, color: meta.color, emoji: meta.emoji, label: meta.label }
        startAngle += sweep
        return slice
      })
  }, [items])

  const total = items.reduce((s, i) => s + (i.value || 0), 0)

  if (slices.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.title}>🥧 Allocation</div>
        <div className={styles.empty}>No data yet</div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.titleRow}>
        <span className={styles.title}>🥧 Allocation</span>
        <span className={styles.sub}>by value</span>
      </div>

      <div className={styles.body}>
        <svg viewBox="0 0 180 180" className={styles.svg}>
          {slices.map((s, i) => {
            const path = describeArc(CX, CY, R, s.startAngle, s.startAngle + s.sweep)
            return (
              <g key={i} className={styles.slice}>
                <path
                  d={path}
                  fill={s.color}
                  stroke="#fff"
                  strokeWidth="3"
                />
              </g>
            )
          })}
          {/* inner circle cutout */}
          <circle cx={CX} cy={CY} r={INNER_R} fill="#fff" stroke="#1A1A1A" strokeWidth="2" />
          <text x={CX} y={CY - 6} textAnchor="middle" fontSize="11" fontWeight="800"
            fontFamily="Nunito, sans-serif" fill="#3D3D3D">Total</text>
          <text x={CX} y={CY + 10} textAnchor="middle" fontSize="12" fontWeight="800"
            fontFamily="Bangers, Impact, sans-serif" fill="#1A1A1A" letterSpacing="0.5">
            {fmt(total)}
          </text>
        </svg>

        <div className={styles.legend}>
          {slices.map((s, i) => (
            <div key={i} className={styles.legendRow}>
              <span className={styles.dot} style={{ background: s.color }} />
              <span className={styles.legendEmoji}>{s.emoji}</span>
              <span className={styles.legendLabel}>{s.label}</span>
              <span className={styles.legendPct}>{(s.pct * 100).toFixed(1)}%</span>
              <span className={styles.legendVal}>{fmt(s.val)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function describeArc(cx, cy, r, startAngle, endAngle) {  const sweep = endAngle - startAngle
  // avoid full-circle path artifacts
  const end = sweep >= 2 * Math.PI - 0.001 ? startAngle + 2 * Math.PI - 0.001 : endAngle
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(end)
  const y2 = cy + r * Math.sin(end)
  const lg = sweep > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2} Z`
}
