import { useState, useEffect } from 'react'
import { rutasIniciales, type RutaData } from '../data/rutas'

const STORAGE_KEY = 'rutas-admin-v3'

export function useRutas() {
  const [rutas, setRutas] = useState<RutaData[]>(() => {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEY)
      if (!guardadas) return rutasIniciales

      const parsed: RutaData[] = JSON.parse(guardadas)
      if (parsed[0]?.camiones === undefined) return rutasIniciales

      return parsed
    } catch {
      return rutasIniciales
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rutas))
  }, [rutas])

  return { rutas, setRutas }
}