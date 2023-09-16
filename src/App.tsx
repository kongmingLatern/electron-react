import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { Button, InputNumber, message } from 'antd'
import Speech from './module/Speech'
import { getQrCodeInfo, scanQrCode } from '@/module/scan'
import { KeepLiveWS } from 'bilibili-live-ws'
import { createLiveConnect } from './module/connect'
import DanmakuList, { ItemProps } from './pages/DanmakuList'
import { CMD } from './module/connect/const'
import AvatarImg from './components/AvatarImg'

function App() {
	const [url, setUrl] = useState('')
	const [codeKey, setCodeKey] = useState('')
	const [live, setLive] = useState({} as KeepLiveWS)
	const danmakuList: Partial<ItemProps>[] = []
	const [list, setList] = useState<Partial<ItemProps>[]>([])
	const [roomId, setRoomId] = useState<number>(0)
	let total = 0

	function reset() {
		danmakuList.length = 0
		setList([])
	}

	function connect() {
		const live = createLiveConnect(
			{
				// roomId: 1007329,
				// roomId: 22021613,
				roomId,
			},
			{
				SEND_GIFT: res => {
					const {
						uid,
						face,
						giftName,
						receive_user_info,
						uname,
						action,
						total_coin,
						num,
					} = res.data

					const { uname: name } = receive_user_info
					total += total_coin / 100

					danmakuList.push({
						uid,
						avatar: face,
						name: uname,
						type: CMD.SEND_GIFT,
						money: total_coin / 100,
						content: (
							<span className="text-white font-bold font-lg">
								<AvatarImg avatar={face} />
								<span className="color-yellow">{`[${uname}]`}</span>
								{`${action}给[${[name]}]`}
								<br />
								<span className="color-blue">
									<span className="color-yellow">{`${giftName}`}</span>
									{`  * ${num}`}
								</span>
								<br />
								<span className="color-yellow">
									<span className="color-white">
										总价值:
									</span>
									{` ${total_coin / 100} 电池 `}
								</span>
							</span>
						),
						time: new Date().getTime(),
						total,
					})

					setList([...danmakuList])
				},
				ENTRY_EFFECT: res => {
					const { face, uid, copy_writing } = res.data
					const name = /<%(.*?)%>/g.exec(copy_writing)?.[1]
					danmakuList.push({
						uid,
						avatar: face,
						name: '[自动触发]',
						type: CMD.ENTRY_EFFECT,
						content: (
							<span className="text-white font-bold font-lg">
								欢迎 <AvatarImg avatar={face} />
								<span className="color-yellow">
									{name}
								</span>{' '}
								进入直播间!
							</span>
						),
						time: new Date().getTime(),
						total,
					})
					setList([...danmakuList])
				},
				DANMU_MSG: res => {
					// 如果弹幕超过300,则清空弹幕,释放空间
					if (danmakuList.length >= 300) {
						reset()
					}

					const { info } = res
					const content = info[1]
					const name = info[2][1]
					danmakuList.push({
						type: CMD.DANMU_MSG,
						content,
						name,
						time: new Date().getTime(),
						total,
					})
					setList([...danmakuList])
				},
				SUPER_CHAT_MESSAGE: res => {
					const {
						price,
						background_color,
						background_price_color,
						message,
						user_info,
						end_time,
						uid,
					} = res.data

					danmakuList.push({
						type: CMD.SUPER_CHAT_MESSAGE,
						uid,
						avatar: user_info.face,
						content: (
							<span
								style={{
									color: 'white',
									background: background_color,
								}}
							>
								{`${user_info.uname}留言说: ${message}`}
							</span>
						),
						name: user_info.uname,
						time: new Date().getTime(),
						money: price,
						background_price_color,
						end_time,
						total,
					})
					setList([...danmakuList])
				},
				// LIVE_INTERACTIVE_GAME: res => {
				// 	const { data } = res
				// 	const content = data.msg
				// 	const name = data.uname
				// 	const uid = data.uid
				// 	danmakuList.push({
				// 		type: CMD.LIVE_INTERACTIVE_GAME,
				// 		content,
				// 		name,
				// 		time: new Date().getTime(),
				// 		uid,
				// 	})
				// 	setList([...danmakuList])
				// },
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
			{/* <div className="bg-white overflow-hidden rounded-lg w-400px absolute-center rounded">
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
			</div> */}

			<InputNumber
				className="flex w-200px"
				placeholder="请输入直播间id"
				// defaultValue={4245963}
				defaultValue={23271282}
				onBlur={e => {
					setRoomId(Number(e.target.value))
				}}
			/>

			<Button onClick={() => connect()}>连接</Button>
			<Button onClick={() => live.close()}>断开</Button>
			<Button
				onClick={() => {
					setList([])
					danmakuList.length = 0
				}}
			>
				清空弹幕
			</Button>

			{/* <Speech /> */}

			<DanmakuList
				total={list[list.length - 1]?.total || 0}
				danmakuList={list}
			/>

			<img src={url} />
		</>
	)
}

export default App
