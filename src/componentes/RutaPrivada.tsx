import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RutaPrivada({ children }: { children: React.ReactNode }) {
  const { user, cargando } = useAuth()

  if (cargando) return (
    <div className="flex min-h-screen items-center justify-center"
      style={{ background: '#0E0E0A', color: '#C9A84C' }}>
      Cargando...
    </div>
  )

  return user ? <>{children}</> : <Navigate to="/login" replace />
}