import LoginForm from './components/form/LoginForm'
import { Icon } from '@iconify/react'
import Speech from './module/Speech'

function App() {
	console.log(
		'[App.tsx]',
		`Hello world from Electron ${process.versions.electron}!`
	)
	return (
		<>
			<div className="bg-white overflow-hidden rounded-lg w-400px absolute-center rounded">
				<h3 className="flex-center text-center bg-#00AEEC color-white h-40px lh-40px">
					<Icon
						icon="fa6-brands:bilibili"
						className="mr-2"
						width={30}
						height={30}
						color="#fff"
					/>
					<span className="select-none">
						哔哩哔哩直播助手
					</span>
				</h3>
				<LoginForm />
			</div>

			<Speech />
		</>
	)
}

export default App
