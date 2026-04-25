import { createContext, type Dispatch, type SetStateAction, useContext } from 'react'

export const UI_STORAGE_KEY = 'foodstore-ui-state'

export type ProductosQueryState = {
  offset: number
  limit: number
  search: string
}

export type UiState = {
  sidebarCollapsed: boolean
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>
  productosQuery: ProductosQueryState
  setProductosQuery: Dispatch<SetStateAction<ProductosQueryState>>
}

export const initialProductosQuery: ProductosQueryState = {
  offset: 0,
  limit: 20,
  search: '',
}

export function getInitialUiState() {
  if (typeof window === 'undefined') {
    return {
      sidebarCollapsed: false,
      productosQuery: initialProductosQuery,
    }
  }

  const stored = localStorage.getItem(UI_STORAGE_KEY)
  if (!stored) {
    return {
      sidebarCollapsed: false,
      productosQuery: initialProductosQuery,
    }
  }

  try {
    const parsed = JSON.parse(stored) as {
      sidebarCollapsed?: boolean
      productosQuery?: ProductosQueryState
    }

    return {
      sidebarCollapsed:
        typeof parsed.sidebarCollapsed === 'boolean' ? parsed.sidebarCollapsed : false,
      productosQuery: {
        offset: parsed.productosQuery?.offset ?? 0,
        limit: parsed.productosQuery?.limit ?? 20,
        search: parsed.productosQuery?.search ?? '',
      },
    }
  } catch {
    return {
      sidebarCollapsed: false,
      productosQuery: initialProductosQuery,
    }
  }
}

export const UiContext = createContext<UiState | null>(null)

export function useUiStore() {
  const context = useContext(UiContext)

  if (!context) {
    throw new Error('useUiStore must be used inside UiProvider')
  }

  return context
}
