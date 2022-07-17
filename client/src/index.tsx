import App from 'App'
import 'tailwindcss/tailwind.css'
// import { store } from 'redux/store'
import { EthProvider } from 'context'
// import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  // <Provider store={store}>
  <EthProvider>
    <App />
  </EthProvider>
  // </Provider>
)
