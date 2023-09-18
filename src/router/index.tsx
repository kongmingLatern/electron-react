import App from '@/App'
import Global from '@/Global'
import { createHashRouter } from 'react-router-dom'
export const router = createHashRouter([
	{
		path: '/',
		element: <Global />,
	},
	{
		path: '/home',
		element: <App />,
	},
])
