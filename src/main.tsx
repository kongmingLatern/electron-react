import 'regenerator-runtime/runtime'
import ReactDOM from 'react-dom/client'
import App from './App'
import './samples/node-api'
import './index.scss'
import '@unocss/reset/normalize.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import '@/assets/reset.scss'
import '@fontsource/roboto/500.css'
import { ConfigProvider, theme } from 'antd'

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<ConfigProvider
		theme={{
			// 1. 单独使用暗色算法
			algorithm: theme.darkAlgorithm,

			// 2. 组合使用暗色算法与紧凑算法
			// algorithm: [
			// 	theme.darkAlgorithm,
			// 	theme.compactAlgorithm,
			// ],
		}}
	>
		<App />
	</ConfigProvider>
)

postMessage({ payload: 'removeLoading' }, '*')
