import { useState, useRef } from 'react'
import { SAMPLE_ITEMS, SLOTS_PER_PAGE } from './constants'
import { useStorage } from './useStorage'

import Header      from './components/Header'
import FilterBar   from './components/FilterBar'
import BinderPage  from './components/BinderPage'
import DetailPanel from './components/DetailPanel'
import ItemModal   from './components/ItemModal'

import styles from './App.module.css'

// starts after sample data; increments on every add
let nextId = SAMPLE_ITEMS.length + 1

export default function App() {
  const [items, setItems] = useStorage('cardarchive-items', SAMPLE_ITEMS)
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [detailId, setDetailId] = useState(null)
  const [modal, setModal] = useState(null) // { mode: 'add' | 'edit', item? }
  const importRef = useRef(null)

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)
  const totalPages = Math.max(1, Math.ceil((filtered.length + 1) / SLOTS_PER_PAGE))

  const clampPage = (p) => setPage(Math.max(0, Math.min(p, totalPages - 1)))

  function handleFilter(f) {
    setFilter(f)
    setPage(0)
  }

  function openAdd() {
    setDetailId(null)
    setModal({ mode: 'add' })
  }

  function openEdit(item) {
    setDetailId(null)
    setModal({ mode: 'edit', item })
  }

  function handleSave(form) {
    if (modal.mode === 'edit') {
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...form } : i))
    } else {
      setItems(prev => [...prev, { ...form, id: nextId++ }])
      // jump to the last page so they can see what they just added
      setPage(Math.floor((filtered.length + 1) / SLOTS_PER_PAGE))
    }
    setModal(null)
  }

  function handleDelete(id) {
    setItems(prev => prev.filter(i => i.id !== id))
    setDetailId(null)
    // back up a page if we just emptied this one
    if (page > 0 && page >= Math.ceil((filtered.length - 1) / SLOTS_PER_PAGE)) {
      setPage(p => p - 1)
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'cardarchive-collection.json' })
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result)
        if (!Array.isArray(parsed)) throw new Error('expected array')
        setItems(parsed)
        nextId = Math.max(...parsed.map(i => i.id ?? 0)) + 1
        setPage(0)
      } catch {
        alert('Could not parse that file — make sure it\'s a vault export.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const detailItem = detailId ? items.find(i => i.id === detailId) : null

  return (
    <div className={styles.app}>
      <input
        ref={importRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />

      <Header
        items={items}
        onAdd={openAdd}
        onExport={handleExport}
        onImport={() => importRef.current?.click()}
      />

      <FilterBar filter={filter} onFilter={handleFilter} items={items} />

      <main className={styles.main}>
        {filtered.length === 0 && filter !== 'all' ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>No {filter} items yet</div>
            <div className={styles.emptySub}>Add your first {filter} collectible to get started</div>
            <button className={styles.emptyBtn} onClick={openAdd}>+ Add Item</button>
          </div>
        ) : (
          <BinderPage
            items={filtered}
            page={page}
            totalPages={totalPages}
            onSelect={item => setDetailId(item.id)}
            onAdd={openAdd}
            onPageChange={clampPage}
          />
        )}
      </main>

      {detailItem && (
        <DetailPanel
          item={detailItem}
          onClose={() => setDetailId(null)}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {modal && (
        <ItemModal
          item={modal.item ?? null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
