import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './stores/appStore'
import ModeSelector from './components/layout/ModeSelector'
import AppShell from './components/layout/AppShell'
import AdminHome from './pages/AdminHome'
import BuilderPage from './pages/BuilderPage'
import ViewSubmissionsPage from './pages/ViewSubmissionsPage'
import ScoutHome from './pages/ScoutHome'
import FillFormPage from './pages/FillFormPage'

export default function App() {
  const mode = useAppStore((s) => s.mode)

  if (!mode) {
    return <ModeSelector />
  }

  return (
    <HashRouter>
      <AppShell>
        <Routes>
          {mode === 'admin' ? (
            <>
              <Route path="/" element={<AdminHome />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/builder/:formId" element={<BuilderPage />} />
              <Route path="/submissions/:formId" element={<ViewSubmissionsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<ScoutHome />} />
              <Route path="/fill/:formId" element={<FillFormPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </AppShell>
    </HashRouter>
  )
}
