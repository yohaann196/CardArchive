import { useState, useEffect, useRef } from 'react'
import { TYPE_META, GRADES } from '../constants'
import styles from './ItemModal.module.css'

const CATEGORIES = Object.keys(TYPE_META)

const EMPTY_FORM = { name: '', type: 'TCG', grade: 'PSA 9', set: '', year: '', value: '', notes: '' }

export default function ItemModal({ item, onClose, onSave }) {
  const isEdit = !!item
  const nameRef = useRef(null)

  const [form, setForm] = useState(item ? { ...EMPTY_FORM, ...item } : EMPTY_FORM)

  useEffect(() => { nameRef.current?.focus() }, [])

  const patch = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (!form.name.trim()) {
      nameRef.current?.focus()
      return
    }
    onSave({
      ...form,
      value: parseFloat(form.value) || 0,
      year:  form.year ? parseInt(form.year) : '',
    })
    onClose()
  }

  return (
    <div
      className={styles.overlay}
      onClick={e => e.target === e.currentTarget && onClose()}
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? '✏️ Edit Holding' : '➕ Add Holding'}</h2>
          <button className={styles.closeBtn} onClick={onClose}><CloseIcon /></button>
        </div>

        <div className={styles.body}>
          <Field label="Name" fullWidth>
            <input
              ref={nameRef}
              className={styles.input}
              value={form.name}
              onChange={e => patch('name', e.target.value)}
              placeholder="e.g. Charizard Base Set Holo"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </Field>

          <Field label="Category" fullWidth>
            <div className={styles.typePicker}>
              {CATEGORIES.map(cat => {
                const meta = TYPE_META[cat]
                const active = form.type === cat
                return (
                  <button
                    key={cat}
                    className={`${styles.typeBtn} ${active ? styles.typeBtnActive : ''}`}
                    style={active ? { '--tc': meta.color } : undefined}
                    onClick={() => patch('type', cat)}
                  >
                    <span className={styles.typeEmoji}>{meta.emoji}</span>
                    <span className={styles.typeLabel}>{cat}</span>
                  </button>
                )
              })}
            </div>
          </Field>

          <div className={styles.row}>
            <Field label="Grade">
              <select className={styles.select} value={form.grade} onChange={e => patch('grade', e.target.value)}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Year">
              <input
                className={styles.input}
                type="number"
                value={form.year}
                onChange={e => patch('year', e.target.value)}
                placeholder="1999"
              />
            </Field>
          </div>

          <div className={styles.row}>
            <Field label="Set / Series">
              <input
                className={styles.input}
                value={form.set}
                onChange={e => patch('set', e.target.value)}
                placeholder="Base Set 1st Edition"
              />
            </Field>
            <Field label="Est. Value ($)">
              <input
                className={styles.input}
                type="number"
                value={form.value}
                onChange={e => patch('value', e.target.value)}
                placeholder="0"
                min="0"
              />
            </Field>
          </div>

          <Field label="Personal Notes" fullWidth>
            <textarea
              className={styles.textarea}
              value={form.notes}
              onChange={e => patch('notes', e.target.value)}
              placeholder="Story behind this piece, where you found it, what makes it special..."
              rows={3}
            />
          </Field>
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
          <button className={styles.btnSave} onClick={handleSave}>
            {isEdit ? '💾 Save Changes' : '🚀 Add to Portfolio'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, fullWidth, children }) {
  return (
    <div className={`${styles.field} ${fullWidth ? styles.fieldFull : ''}`}>
      <label className={styles.label}>{label}</label>
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
