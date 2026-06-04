import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

import { LoginPage } from './pages/LoginPage'
import { ProjectsPage } from './pages/ProjectsPage'

const App = () => {
  return (
    <MantineProvider>
      {/* <LoginPage /> */}
      <ProjectsPage />
    </MantineProvider>
  )
}

export default App
