import { useState, useEffect } from 'react'

export function useStorage(key, fallback) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      // storage full or private browsing — just skip it
    }
  }, [key, val])

  return [val, setVal]
}
