import { useMemo } from 'react'
import { fmt } from '../constants'
import styles from './PortfolioChart.module.css'

const W = 600
const H = 220
const PAD = { top: 20, right: 20, bottom: 40, left: 70 }

export default function PortfolioChart({ items }) {
  const sorted = useMemo(() => [...items].sort((a, b) => a.id - b.id), [items])

  // cumulative value points
  const points = useMemo(() => {
    let cum = 0
    return sorted.map((item, i) => {
      cum += item.value || 0
      return { x: i, y: cum, item }
    })
  }, [sorted])

  if (points.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.titleRow}>
          <span className={styles.title}>📈 Portfolio Growth</span>
          <span className={styles.badge}>Cumulative</span>
        </div>
        <div className={styles.empty}>Add items to see your portfolio chart!</div>
      </div>
    )
  }

  const maxY = Math.max(...points.map(p => p.y)) * 1.15 || 1
  const n    = points.length

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top  - PAD.bottom

  const cx = (i) => PAD.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW)
  const cy = (v) => PAD.top  + innerH - (v / maxY) * innerH

  // smooth SVG path
  const pathD = points.reduce((d, p, i) => {
    const x = cx(i), y = cy(p.y)
    if (i === 0) return `M ${x} ${y}`
    const px = cx(i - 1), py = cy(points[i - 1].y)
    const cpx = (px + x) / 2
    return d + ` C ${cpx} ${py} ${cpx} ${y} ${x} ${y}`
  }, '')

  const areaD = pathD + ` L ${cx(n - 1)} ${PAD.top + innerH} L ${cx(0)} ${PAD.top + innerH} Z`

  // Y axis ticks (4 labels)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    val: maxY * t,
    y: cy(maxY * t),
  }))

  const totalValue = points[points.length - 1]?.y ?? 0

  return (
    <div className={styles.card}>
      <div className={styles.titleRow}>
        <div>
          <span className={styles.title}>📈 Portfolio Growth</span>
          <span className={styles.titleSub}>Cumulative value as holdings added</span>
        </div>
        <div className={styles.rightStat}>
          <span className={styles.totalVal}>{fmt(totalValue)}</span>
          <span className={styles.badge}>{points.length} holdings</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.svg}
        aria-label="Portfolio growth chart"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6C63FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.left} y1={t.y}
              x2={W - PAD.right} y2={t.y}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray={i === 0 ? '0' : '4 3'}
            />
            <text
              x={PAD.left - 8} y={t.y + 4}
              textAnchor="end"
              fontSize="11"
              fill="#9B9B9B"
              fontFamily="DM Mono, monospace"
            >
              {fmt(t.val)}
            </text>
          </g>
        ))}

        {/* area fill */}
        <path d={areaD} fill="url(#areaGrad)" />

        {/* line */}
        <path
          d={pathD}
          fill="none"
          stroke="#6C63FF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* dots + tooltips */}
        {points.map((p, i) => (
          <g key={i} className={styles.dot}>
            <circle cx={cx(i)} cy={cy(p.y)} r="5" fill="#6C63FF" stroke="#fff" strokeWidth="2" />
            <text
              x={cx(i)} y={PAD.top + innerH + 20}
              textAnchor="middle"
              fontSize="10"
              fill="#9B9B9B"
              fontFamily="Nunito, sans-serif"
              fontWeight="700"
            >
              #{i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
