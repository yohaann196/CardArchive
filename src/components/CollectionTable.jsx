import { useState, useMemo } from 'react'
import { TYPE_META, GRADE_META, fmt } from '../constants'
import styles from './CollectionTable.module.css'

const COLS = [
  { key: 'name',  label: 'Name'     },
  { key: 'type',  label: 'Category' },
  { key: 'grade', label: 'Grade'    },
  { key: 'year',  label: 'Year'     },
  { key: 'value', label: 'Value'    },
]

export default function CollectionTable({ items, onEdit, onDelete, onAdd }) {
  const [sort, setSort]   = useState({ key: 'value', dir: -1 })
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sort.key] ?? ''
      const bv = b[sort.key] ?? ''
      if (typeof av === 'number') return (av - bv) * sort.dir
      return String(av).localeCompare(String(bv)) * sort.dir
    })
  }, [filtered, sort])

  function toggleSort(key) {
    setSort(s => s.key === key ? { key, dir: s.dir * -1 } : { key, dir: -1 })
  }

  const categories = ['all', ...Object.keys(TYPE_META)]

  return (
    <div className={styles.card}>
      <div className={styles.titleRow}>
        <span className={styles.title}>📋 Collection</span>
        <div className={styles.controls}>
          <select
            className={styles.select}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : `${TYPE_META[c]?.emoji} ${c}`}</option>
            ))}
          </select>
          <button className={styles.addBtn} onClick={onAdd}>+ Add</button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className={styles.empty}>
          No items yet — <button className={styles.emptyLink} onClick={onAdd}>add your first holding!</button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {COLS.map(col => (
                  <th
                    key={col.key}
                    className={`${styles.th} ${sort.key === col.key ? styles.thActive : ''}`}
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.label}
                    <SortIcon active={sort.key === col.key} dir={sort.dir} />
                  </th>
                ))}
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, i) => {
                const meta  = TYPE_META[item.type] ?? TYPE_META.Other
                const grade = GRADE_META(item.grade)
                return (
                  <tr key={item.id} className={styles.tr} style={{ animationDelay: `${i * 30}ms` }}>
                    <td className={styles.td}>
                      <div className={styles.nameCell}>
                        <span className={styles.emoji}>{meta.emoji}</span>
                        <div>
                          <div className={styles.itemName}>{item.name}</div>
                          <div className={styles.itemSet}>{item.set}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.typePill} style={{ background: meta.color + '22', color: meta.color, borderColor: meta.color }}>
                        {item.type}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.gradePill} style={{ color: grade.color, borderColor: grade.color + '88', background: grade.color + '18' }}>
                        {grade.label || 'Raw'}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.mono}`}>{item.year || '—'}</td>
                    <td className={`${styles.td} ${styles.valCell}`}>{fmt(item.value)}</td>
                    <td className={styles.td}>
                      <div className={styles.rowActions}>
                        <button className={styles.btnEdit} onClick={() => onEdit(item)}>Edit</button>
                        <button className={styles.btnDel}  onClick={() => onDelete(item.id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SortIcon({ active, dir }) {
  return (
    <span className={`${styles.sortIcon} ${active ? styles.sortActive : ''}`}>
      {active ? (dir > 0 ? ' ▲' : ' ▼') : ' ⇅'}
    </span>
  )
}
