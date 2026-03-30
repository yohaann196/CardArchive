import { fmt } from '../constants'
import styles from './Header.module.css'

export default function Header({ items, onAdd, onImport, onExport }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>📈</span>
          <div>
            <div className={styles.logoText}>CardArchive</div>
            <div className={styles.logoSub}>Investor Dashboard</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnGhost} onClick={onImport}>
            <UpIcon /> Import
          </button>
          <button className={styles.btnGhost} onClick={onExport}>
            <DownIcon /> Export
          </button>
          <button className={styles.btnAdd} onClick={onAdd}>
            <PlusIcon /> Add Holding
          </button>
        </div>
      </div>
    </header>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="7" y1="2" x2="7" y2="12"/>
      <line x1="2" y1="7" x2="12" y2="7"/>
    </svg>
  )
}

function UpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 9V1M4 4l3-3 3 3M2 11h10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 1v8M4 6l3 3 3-3M2 11h10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
