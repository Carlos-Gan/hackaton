import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../firebase/config'

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setCargando(false)
    })
    return unsub
  }, [])

  return { user, cargando }
}