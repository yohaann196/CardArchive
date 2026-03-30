import { useState } from 'react'
import { TYPE_META, GRADE_META, fmt, SLOTS_PER_PAGE } from '../constants'
import styles from './BinderPage.module.css'

export default function BinderPage({ items, page, totalPages, onSelect, onAdd, onPageChange }) {
  const start = page * SLOTS_PER_PAGE
  const slots = items.slice(start, start + SLOTS_PER_PAGE)

  // pad with nulls to always fill 9 slots, then replace the first null with 'add'
  while (slots.length < SLOTS_PER_PAGE) slots.push(null)
  const firstEmpty = slots.indexOf(null)
  if (firstEmpty !== -1) slots[firstEmpty] = 'add'

  return (
    <div className={styles.wrap}>
      <div className={styles.binder}>
        <Spine />
        <div className={styles.body}>
          <div className={styles.pageNumRow}>
            <span className={styles.pageNum}>Pg {String(page + 1).padStart(2, '0')}</span>
          </div>
          <div className={styles.grid}>
            {slots.map((slot, i) => (
              <Sleeve key={i} item={slot} index={i} onSelect={onSelect} onAdd={onAdd} />
            ))}
          </div>
        </div>
      </div>

      <PageNav page={page} totalPages={totalPages} onChange={onPageChange} />
    </div>
  )
}

function Spine() {
  return (
    <div className={styles.spine}>
      {Array.from({ length: 7 }, (_, i) => <SpineRing key={i} />)}
    </div>
  )
}

function SpineRing() {
  return <div className={styles.spineRing} />
}

function Sleeve({ item, index, onSelect, onAdd }) {
  const [hovered, setHovered] = useState(false)
  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }

  if (!item) return <div className={styles.sleeveEmpty} />

  if (item === 'add') {
    return (
      <div className={styles.sleeveAdd} onClick={onAdd} {...handlers}>
        <div className={styles.addRing} style={{ opacity: hovered ? 1 : 0.4 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="10" y1="4" x2="10" y2="16"/>
            <line x1="4"  y1="10" x2="16" y2="10"/>
          </svg>
        </div>
        <span className={styles.addLabel}>Add Item</span>
      </div>
    )
  }

  const meta  = TYPE_META[item.type] ?? TYPE_META.Other
  const grade = GRADE_META(item.grade)

  return (
    <div
      className={styles.sleeve}
      onClick={() => onSelect(item)}
      style={{ animationDelay: `${index * 40}ms` }}
      {...handlers}
    >
      <div className={styles.shine} style={{ opacity: hovered ? 1 : 0 }} />

      <div className={styles.inner}>
        <div className={styles.art}>
          <div className={styles.typeBar} style={{ background: meta.color }} />
          <div className={styles.artGlow} style={{ background: meta.glow, opacity: hovered ? 1 : 0.5 }} />
          <div className={styles.artBg}>{meta.emoji}</div>
          <div className={styles.artEmoji}>{meta.emoji}</div>
        </div>

        <div className={styles.info}>
          <div className={styles.name}>{item.name}</div>
          <div className={styles.set}>{item.set}</div>
          <div className={styles.bottom}>
            <span
              className={styles.grade}
              style={{ color: grade.color, borderColor: grade.color + '55', background: grade.color + '18' }}
            >
              {grade.label || 'Raw'}
            </span>
            <span className={styles.value}>{fmt(item.value)}</span>
          </div>
        </div>
      </div>

      <div className={styles.overlay} style={{ opacity: hovered ? 1 : 0 }}>
        <span className={styles.viewLabel}>View Details</span>
      </div>
    </div>
  )
}

function PageNav({ page, totalPages, onChange }) {
  return (
    <div className={styles.nav}>
      <button className={styles.navBtn} onClick={() => onChange(page - 1)} disabled={page === 0}>
        <ChevronLeft /> Prev Page
      </button>

      <div className={styles.dots}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
            onClick={() => onChange(i)}
          />
        ))}
      </div>

      <button className={styles.navBtn} onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1}>
        Next Page <ChevronRight />
      </button>
    </div>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
