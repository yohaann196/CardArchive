import { TYPE_META, GRADE_META, fmt } from '../constants'
import styles from './DetailPanel.module.css'

export default function DetailPanel({ item, onClose, onEdit, onDelete }) {
  if (!item) return null

  const meta  = TYPE_META[item.type] ?? TYPE_META.Other
  const grade = GRADE_META(item.grade)

  const handleDelete = () => {
    // TODO: add a confirmation dialog at some point
    onDelete(item.id)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.panel}>

        <div className={styles.art} style={{ '--type-color': meta.color, '--type-glow': meta.glow }}>
          <div className={styles.artGlow} />
          <span className={styles.artEmoji}>{meta.emoji}</span>
          <div className={styles.artBar} style={{ background: meta.color }} />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <span
            className={styles.typeTag}
            style={{ color: meta.color, background: meta.glow, borderColor: meta.color + '44' }}
          >
            {meta.emoji} {meta.label}
          </span>

          <h2 className={styles.name}>{item.name}</h2>
          <p className={styles.set}>{item.set}{item.year ? ` · ${item.year}` : ''}</p>

          <div className={styles.metaGrid}>
            <MetaCard label="Est. Value">
              <span className={styles.bigVal}>{fmt(item.value)}</span>
            </MetaCard>
            <MetaCard label="Grade">
              <span
                className={styles.gradePill}
                style={{ color: grade.color, borderColor: grade.color + '55', background: grade.color + '18' }}
              >
                {grade.label || 'Ungraded'}
              </span>
            </MetaCard>
            <MetaCard label="Year">
              <span className={styles.metaVal}>{item.year || '—'}</span>
            </MetaCard>
            <MetaCard label="Category">
              <span className={styles.metaVal}>{item.type}</span>
            </MetaCard>
          </div>

          {item.notes && (
            <div className={styles.notes}>
              <div className={styles.notesLabel}>Notes</div>
              <p className={styles.notesText}>"{item.notes}"</p>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.btnEdit} onClick={() => onEdit(item)}>Edit Item</button>
            <button className={styles.btnDelete} onClick={handleDelete}>Remove</button>
          </div>
        </div>

      </div>
    </div>
  )
}

function MetaCard({ label, children }) {
  return (
    <div className={styles.metaCard}>
      <span className={styles.metaLabel}>{label}</span>
      {children}
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="2" y1="2" x2="12" y2="12"/>
      <line x1="12" y1="2" x2="2" y2="12"/>
    </svg>
  )
}
