import { fmt } from '../constants'
import styles from './Header.module.css'

export default function Header({ items, onAdd, onImport, onExport }) {
  const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0)
  const numCategories = new Set(items.map(i => i.type)).size

  return (
    <header className={styles.header}>
      <div className={styles.grain} />
      <div className={styles.inner}>

        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="3" stroke="#c9a84c" strokeWidth="1"/>
              <rect x="6" y="6" width="16" height="16" rx="2" fill="rgba(201,168,76,0.08)" stroke="#c9a84c" strokeWidth="0.5"/>
              <line x1="14" y1="6" x2="14" y2="22" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.5"/>
              <line x1="6"  y1="14" x2="22" y2="14" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.5"/>
              <circle cx="14" cy="14" r="2.5" fill="#c9a84c"/>
            </svg>
          </div>
          <div>
            <div className={styles.logoText}>CardArchive</div>
            <div className={styles.logoSub}>Collector Showcase</div>
          </div>
        </div>

        <div className={styles.stats}>
          <Stat label="Items"      val={items.length} />
          <div className={styles.divider} />
          <Stat label="Est. Value" val={fmt(totalValue)} />
          <div className={styles.divider} />
          <Stat label="Categories" val={numCategories} />
        </div>

        <div className={styles.actions}>
          <button className={styles.btnGhost} onClick={onImport}>
            <UpIcon /> Import
          </button>
          <button className={styles.btnGhost} onClick={onExport}>
            <DownIcon /> Export
          </button>
          <button className={styles.btnAdd} onClick={onAdd}>
            <PlusIcon /> Add Item
          </button>
        </div>

      </div>
    </header>
  )
}

function Stat({ label, val }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statVal}>{val}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

// tiny inline icons — not worth a separate file
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="7" y1="2" x2="7" y2="12"/>
      <line x1="2" y1="7" x2="12" y2="7"/>
    </svg>
  )
}

function UpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 9V1M4 4l3-3 3 3M2 11h10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 1v8M4 6l3 3 3-3M2 11h10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
