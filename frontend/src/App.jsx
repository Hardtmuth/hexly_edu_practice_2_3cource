import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

import { LoginPage } from './pages/LoginPage'

const App = () => {
  return (
    <MantineProvider>
      <LoginPage />
    </MantineProvider>
  )
}

export default App
