import 'regenerator-runtime/runtime'
import ReactDOM from 'react-dom/client'
import App from './App'
import './samples/node-api'
import './index.scss'
import '@unocss/reset/normalize.css'
import 'uno.css'
import '@/assets/reset.scss'
import '@fontsource/roboto/500.css'

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(<App />)

postMessage({ payload: 'removeLoading' }, '*')
