import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

import { BrowserRouter, Routes, Route } from 'react-router'

import { LoginPage } from './pages/LoginPage'
import { ProjectsPage } from './pages/ProjectsPage'

const App = () => {
  return (
    <BrowserRouter>
      <MantineProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/list" element={<ProjectsPage />} />
        </Routes>
      </MantineProvider>
    </BrowserRouter>
  )
}

export default App
