import { useState, useRef } from 'react'
import { SAMPLE_ITEMS } from './constants'
import { useStorage } from './useStorage'

import Header          from './components/Header'
import StatsBar        from './components/StatsBar'
import PortfolioChart  from './components/PortfolioChart'
import AllocationChart from './components/AllocationChart'
import HoldingsChart   from './components/HoldingsChart'
import CollectionTable from './components/CollectionTable'
import ItemModal       from './components/ItemModal'
import TutorialModal   from './components/TutorialModal'

import styles from './App.module.css'

const TUTORIAL_KEY = 'cardarchive-tutorial-seen'

let nextId = SAMPLE_ITEMS.length + 1

export default function App() {
  const [items, setItems] = useStorage('cardarchive-items', SAMPLE_ITEMS)
  const [modal, setModal] = useState(null) // { mode: 'add' | 'edit', item? }
  const [showTutorial, setShowTutorial] = useState(
    () => !localStorage.getItem(TUTORIAL_KEY)
  )
  const importRef = useRef(null)

  function closeTutorial() {
    localStorage.setItem(TUTORIAL_KEY, '1')
    setShowTutorial(false)
  }

  function openTutorial() { setShowTutorial(true) }

  function openAdd() { setModal({ mode: 'add' }) }
  function openEdit(item) { setModal({ mode: 'edit', item }) }

  function handleSave(form) {
    if (modal.mode === 'edit') {
      setItems(prev => prev.map(i => i.id === form.id ? { ...i, ...form } : i))
    } else {
      setItems(prev => [...prev, { ...form, id: nextId++ }])
    }
    setModal(null)
  }

  function handleDelete(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'cardarchive-portfolio.json' })
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
      } catch {
        alert('Could not parse that file — make sure it\'s a CardArchive export.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

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
        onHelp={openTutorial}
      />

      <main className={styles.main}>
        <StatsBar items={items} />

        <div className={styles.charts}>
          <PortfolioChart items={items} />
          <AllocationChart items={items} />
        </div>

        <div className={styles.chartsBottom}>
          <HoldingsChart items={items} />
          <CollectionTable items={items} onEdit={openEdit} onDelete={handleDelete} onAdd={openAdd} />
        </div>
      </main>

      {modal && (
        <ItemModal
          item={modal.item ?? null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {showTutorial && <TutorialModal onClose={closeTutorial} />}
    </div>
  )
}
