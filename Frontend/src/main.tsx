import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { UiProvider } from './store/ui-store'

/**
 * QueryClient - configuración de TanStack Query
 * 
 * Para desarrollo: staleTime: 0 para evitar cache de respuestas vacías
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // ⚠️ 0 para desarrollo - sempre refetch si hay datos en backend
      refetchOnWindowFocus: true, // Refrescar cuando vuelve a la pestaña
      retry: 2, // Reintentar hasta 2 veces si falla
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UiProvider>
          <App />
        </UiProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)