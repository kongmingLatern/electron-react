import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { Button, message } from 'antd'
import Speech from './module/Speech'
import { getQrCodeInfo, scanQrCode } from '@/module/scan'
import { KeepLiveWS } from 'bilibili-live-ws'
import { createLiveConnect } from './module/connect'
import DanmakuList, { ItemProps } from './pages/DanmakuList'

function App() {
	const [url, setUrl] = useState('')
	const [codeKey, setCodeKey] = useState('')
	const [live, setLive] = useState({} as KeepLiveWS)
	const danmakuList: Partial<ItemProps>[] = []
	const [list, setList] = useState<Partial<ItemProps>[]>([])

	function connect() {
		const live = createLiveConnect(
			{
				// roomId: 1007329,
				// roomId: 22021613,
				roomId: 923833,
			},
			{
				LIVE_INTERACTIVE_GAME: res => {
					const { data } = res
					const content = data.msg
					const name = data.uname
					const uid = data.uid
					danmakuList.push({
						content,
						name,
						time: new Date().getTime(),
						uid,
					})
					setList([...danmakuList])
				},
			}
		)
		setLive(live)
	}

	// console.log(`Electron ${process.versions.electron}!`)

	async function getInfo() {
		const { url, qrcode_key } = await getQrCodeInfo()
		setUrl(url)
		setCodeKey(qrcode_key)
	}

	// useEffect(() => {
	// 	getInfo()
	// }, [])

	// useEffect(() => {
	// 	const timer = setInterval(async () => {
	// 		const res = await scanQrCode(codeKey)
	// 		if (res.code === 0) {
	// 			message.success(res.msg)
	// 			clearInterval(timer)
	// 		}
	// 	}, 5000)
	// 	return () => clearInterval(timer)
	// }, [codeKey])

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
				{/* <LoginForm /> */}
			</div>

			<Button onClick={() => connect()}>连接</Button>
			<Button onClick={() => live.close()}>断开</Button>
			<Button onClick={() => setList([])}>清空弹幕</Button>

			<Speech />

			<DanmakuList danmakuList={list} />

			<img src={url} />
		</>
	)
}

export default App
