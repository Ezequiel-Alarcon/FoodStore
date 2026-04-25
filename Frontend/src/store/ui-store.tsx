import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { getInitialUiState, type UiState, UI_STORAGE_KEY, UiContext } from './ui-context'

export function UiProvider({ children }: PropsWithChildren) {
  const [initialUiState] = useState(getInitialUiState)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialUiState.sidebarCollapsed)
  const [productosQuery, setProductosQuery] = useState(initialUiState.productosQuery)

  useEffect(() => {
    localStorage.setItem(
      UI_STORAGE_KEY,
      JSON.stringify({
        sidebarCollapsed,
        productosQuery,
      })
    )
  }, [sidebarCollapsed, productosQuery])

  const value = useMemo<UiState>(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      productosQuery,
      setProductosQuery,
    }),
    [sidebarCollapsed, productosQuery]
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}
