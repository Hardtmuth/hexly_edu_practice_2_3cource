import { createRoot } from 'react-dom/client'

import './i18next.js'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <App />,
)
