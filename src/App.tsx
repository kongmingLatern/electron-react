import LoginForm from './components/form/LoginForm'

function App() {
	console.log(
		'[App.tsx]',
		`Hello world from Electron ${process.versions.electron}!`
	)
	return (
		<>
			<div className="bg-blue-300 rounded w-400px absolute-center">
				<h3 className="text-center bg-#00AEEC color-white">
					Bilibili Helper
				</h3>
				<LoginForm />
			</div>
			{/* <header className='mb-2'>
				<h3 className="text-center bg-#00AEEC color-white">
					Bilibili Helper
				</h3>
			</header> */}
		</>
	)
}

export default App
