import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  return (
    <main style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>Prueba de conexión Supabase</h1>

      {error ? (
        <p style={{ color: 'red' }}>
          Error: {error.message}
        </p>
      ) : (
        <p style={{ color: 'green' }}>
          Conexión exitosa. Usuario: {data.user ? data.user.email : 'ninguno (no hay sesión activa)'}
        </p>
      )}
    </main>
  )
}
