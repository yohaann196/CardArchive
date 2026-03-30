import { useState, useEffect, useRef } from 'react'
import styles from './TutorialModal.module.css'

const STEPS = [
  {
    emoji: '📈',
    title: 'Welcome to CardArchive!',
    body: 'Your personal collectibles portfolio tracker. Manage TCG cards, sports cards, coins, comics, and more — all in one place.',
    features: [],
  },
  {
    emoji: '📊',
    title: 'Your Dashboard',
    body: 'See your entire collection at a glance. The stats bar at the top shows key numbers, and the charts below break down portfolio growth and allocation by category.',
    features: [
      { icon: '💰', label: 'Portfolio Value',   desc: 'Sum of all your estimated item values' },
      { icon: '🏆', label: 'Top Holding',        desc: 'Your single most valuable item' },
      { icon: '📊', label: 'Allocation Donut',   desc: 'How your collection is split by category' },
      { icon: '📉', label: 'Growth Chart',       desc: 'Cumulative value as items were added' },
    ],
  },
  {
    emoji: '➕',
    title: 'Adding & Editing Holdings',
    body: 'Click "Add Holding" to log any collectible. Fill in a name, category, professional grade, year, set, and estimated value. You can edit or delete any item from the table at any time.',
    features: [
      { icon: '🃏', label: 'TCG',    desc: 'Pokémon, Magic, Yu-Gi-Oh cards' },
      { icon: '⚾', label: 'Sports', desc: 'Baseball, basketball, football cards' },
      { icon: '🪙', label: 'Coins',  desc: 'Numismatic coins & currency' },
      { icon: '📚', label: 'Comics', desc: 'Comic books & graphic novels' },
    ],
  },
  {
    emoji: '💾',
    title: 'No Login — JSON is Your Save File',
    body: 'CardArchive has no accounts, no passwords, and no cloud. Your data lives in your browser\'s local storage. Use Export & Import to back up or move your collection between devices.',
    features: [
      { icon: '⬇️', label: 'Export',  desc: 'Download your portfolio as a .json backup file' },
      { icon: '⬆️', label: 'Import',  desc: 'Load a previously exported .json to restore your collection on any device' },
    ],
    emphasis: true,
  },
]

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1
  const nextBtnRef = useRef(null)

  useEffect(() => {
    nextBtnRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function handleNext() {
    if (isLast) { onClose(); return }
    setStep(s => s + 1)
  }

  function handleBack() {
    setStep(s => s - 1)
  }

  return (
    <div
      className={styles.overlay}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={current.title}
      >
        {/* Progress dots */}
        <div className={styles.dotsRow}>
          <div className={styles.dots}>
            {STEPS.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === step ? styles.dotActive : ''}`}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close tutorial"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Step content */}
        <div className={styles.content}>
          <div className={styles.emoji}>{current.emoji}</div>
          <h2 className={`${styles.title} ${current.emphasis ? styles.titleEmphasis : ''}`}>
            {current.title}
          </h2>
          <p className={styles.body}>{current.body}</p>

          {current.emphasis && (
            <div className={styles.emphasisBadge}>
              🔒 No accounts &nbsp;·&nbsp; 🌐 No cloud &nbsp;·&nbsp; 📁 Just a .json file
            </div>
          )}

          {current.features.length > 0 && (
            <ul className={styles.features}>
              {current.features.map(f => (
                <li key={f.label} className={styles.feature}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <div>
                    <span className={styles.featureLabel}>{f.label}</span>
                    <span className={styles.featureDesc}> — {f.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Navigation */}
        <div className={styles.nav}>
          <button
            className={styles.btnSkip}
            onClick={onClose}
          >
            Skip tutorial
          </button>
          <div className={styles.navRight}>
            {step > 0 && (
              <button className={styles.btnBack} onClick={handleBack}>
                ← Back
              </button>
            )}
            <button className={styles.btnNext} onClick={handleNext} ref={nextBtnRef}>
              {isLast ? '🚀 Let\'s go!' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
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
