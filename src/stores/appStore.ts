import { create } from 'zustand'

type AppMode = 'admin' | 'scout' | null

interface AppState {
  mode: AppMode
  setMode: (mode: 'admin' | 'scout') => void
  resetMode: () => void
}

const saved = localStorage.getItem('app-mode') as AppMode

export const useAppStore = create<AppState>((set) => ({
  mode: saved,
  setMode: (mode) => {
    localStorage.setItem('app-mode', mode)
    set({ mode })
  },
  resetMode: () => {
    localStorage.removeItem('app-mode')
    set({ mode: null })
  },
}))
