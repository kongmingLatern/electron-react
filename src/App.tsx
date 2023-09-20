import { useEffect, useState } from 'react'
import { Button, Space, message } from 'antd'
import { KeepLiveWS } from 'bilibili-live-ws'
import { createLiveConnect } from './module/connect'
import DanmakuList, { ItemProps } from './pages/DanmakuList'
import { CMD } from './module/connect/const'
import AvatarImg from './components/AvatarImg'
import { handleContent } from './module/danmaku'
import { useLocation, useNavigate } from 'react-router-dom'
import { get } from './api'
function App() {
	const [live, setLive] = useState({} as KeepLiveWS)
	const danmakuList: Partial<ItemProps>[] = []
	const [list, setList] = useState<Partial<ItemProps>[]>([])
	const [roomId, setRoomId] = useState<number>(0)
	const [anchor, setAnchor] = useState<number>(0)
	// const [limit, setLimit] = useState(500)
	const navigate = useNavigate()
	let location = useLocation()
	// console.log('location', location.state)
	// console.log('protobuf', protobuf)

	let total = 0

	function reset() {
		danmakuList.length = 0
		setList([])
	}

	function connect(roomId?) {
		const live = createLiveConnect(
			{
				roomId: roomId || location.state.roomId,
				// platform: 'web',
				uid: 108569350,
				token:
					'KqElYY9b02Pz-tqNvDryyjKDgrzSaVRDk8nFhmvdFKwxpGBsDycZSVIFxl4VLFUlpzCfV3yadvCIGO-S5rdseoY9QX_D00hF-Bn9HioIHAZsH_Ha1gwbY9rsvCuSWMGgyghQohfjaKgvvXAPvkY9tUF8',
				// uid: 1,
				// buvid:
				// 	'1F5EA0BF-8AB9-4EE7-29F8-79B01EDE63A833155infoc',
				// uid: 1,
				//923833
				// authBody: {
				// uid: 1,
				// protover: 3,
				// },
				// uid: anchor,
			},
			{
				INTERACT_WORD: res => {
					const { msg_type, uname } = res.data
					console.log('uname', uname)
					if (msg_type === 2) {
						danmakuList.push({
							type: CMD.INTERACT_WORD,
							name: uname,
							content: (
								<span>
									<span className="color-yellow text-lg">
										{uname}
									</span>
									关注了本直播间!
								</span>
							),
							time: new Date().getTime(),
							total,
						})
						setList([...danmakuList])
					}
				},
				SEND_GIFT: async res => {
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
					if (giftName !== '辣条') {
						total += total_coin / 100
					} else {
						total += 0
					}

					const url = await get<any>('/img/getImg', {
						url: face,
					})

					danmakuList.push({
						uid,
						avatar: url,
						name: uname,
						type: CMD.SEND_GIFT,
						money: total_coin / 100,
						content: (
							<span className="text-white font-semibold text-lg">
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
									{`${
										giftName !== '辣条'
											? total_coin / 100 + '电池'
											: total_coin + '银瓜子'
									} `}
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
								欢迎用户 <AvatarImg avatar={face} />
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
				DANMU_MSG: async res => {
					// 如果弹幕超过300,则清空弹幕,释放空间
					// if (danmakuList.length >= 1000) {
					// 	message.success('当前弹幕过多，已进行重制')
					// 	reset()
					// }

					const { dm_v2, info } = res
					const bufferImg = Buffer.from(
						dm_v2,
						'base64'
					).slice(100, 350)
					const str =
						/(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.(jpg|jpeg|png|gif|bmp|webp)/gi.exec(
							Buffer.from(bufferImg).toString()
						)?.[0]

					const url = await get<any>('/img/getImg', {
						url: str,
					})

					const content = info[1]
					const name = info[2][1]
					danmakuList.push({
						type: CMD.DANMU_MSG,
						avatar: url,
						content: handleContent(name, content),
						name,
						time: new Date().getTime(),
						total,
					})
					setList([...danmakuList])

					// const reader = new FileReader()

					// 设置 FileReader 完成后的回调函数
					// reader.onload = function () {
					// 将 Blob 转换为 Base64 编码的字符串
					// const base64String = reader.result.split(',')[1]
					// const base64String = btoa(url)
					// )
					// 在这里您可以使用 base64String 进行任何操作，例如将其设置为图像的 src
					// console.log(base64String)
					// }

					// 读取 Blob 数据，并以DataURL方式读取
					// console.log(reader.readAsDataURL(blob))
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
				LIKE_INFO_V3_CLICK: res => {
					const { uname } = res.data
					danmakuList.push({
						type: CMD.LIKE_INFO_V3_CLICK,
						name: uname,
						content: (
							<span className="color-yellow font-semibold ">
								{`${uname}`}
								<span className="color-white font-semibold">
									为直播间点赞了哦!
								</span>
							</span>
						),
						time: new Date().getTime(),
						total,
					})
					setList([...danmakuList])
				},
				GUARD_BUY: res => {
					const { uid, username, num, guard_level, price } =
						res.data
					total += price / 100
					const user = (
						<span className="color-red font-bold text-lg">
							{username}
						</span>
					)
					danmakuList.push({
						type: CMD.GUARD_BUY,
						uid,
						content: (
							<span>
								{`重大通知! 监测到用户${user} 在本直播间开通了 ${
									guard_level === 1
										? '舰长'
										: guard_level === 2
										? '提督'
										: guard_level === 3
										? '总督'
										: ''
								} * ${num}个月!`}
								<br />
								<span>CN: ¥{price / 100}</span>
							</span>
						),
						name: username,
						time: new Date().getTime(),
						money: price / 100,
						total,
					})
				},
				POPULARITY_RED_POCKET_NEW: res => {
					const { uid, uname, price, num, gift_name } =
						res.data

					const totalPrice = (
						<span className="text-lg color-yellow">
							{price / 100}
						</span>
					)
					const gift = (
						<span className="color-yellow font-semibold">
							{gift_name}
						</span>
					)
					const number = (
						<span className="color-green">{num}</span>
					)
					danmakuList.push({
						type: CMD.POPULARITY_RED_POCKET_NEW,
						content: (
							<span className="color-white">
								<span className="text-lg color-yellow">{`${uname}`}</span>
								{` 送出了 ${gift} * ${number}!`}
								<br />
								<span>总价值: {`${totalPrice} 电池`}</span>
							</span>
						),
						time: new Date().getTime(),
						uid,
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
		// axios
		// 	.get(
		// 		`https://api.codetabs.com/v1/proxy/?quest=https://api.live.bilibili.com/room/v1/Room/room_init?id=${location.state.roomId}`
		// 	)
		// 	.then(({ data }) => {
		// 		console.log(data)
		// 		if (data.code === 0) {
		// 			const { room_id, uid } = data.data
		// 			console.log('room_id', room_id)
		// 			console.log('uid', uid)
		// 			// setRoomId(parseInt(room_id))
		// 			// setAnchor(parseInt(uid))
		// 			live = createLiveConnect(
		// 				{
		// 					roomId: room_id,
		// 					token:
		// 						'sbFxKVT5fjUtrDtzm69W9tOFJkev-txejSXRTu1wMvLtY57GRBHz02ZDLegugbQTWr4ij1ZnlCApj3CPVdWiqeSYxe9xPZ4k9xI7FEOnd2eKujdehPDh4pRLkEB8POFICEjKm5tv8iBzkRJfAal1grE=',
		// 					uid,
		// 					// uid: anchor,
		// 				},
		// 				{
		// 					INTERACT_WORD: res => {
		// 						const { uname } = res.data
		// 						danmakuList.push({
		// 							type: CMD.INTERACT_WORD,
		// 							name: uname,
		// 							content: (
		// 								<span>
		// 									欢迎
		// 									{`${uname}`} 进入直播间!
		// 								</span>
		// 							),
		// 							time: new Date().getTime(),
		// 							total,
		// 						})
		// 						setList([...danmakuList])
		// 					},
		// 					SEND_GIFT: res => {
		// 						const {
		// 							uid,
		// 							face,
		// 							giftName,
		// 							receive_user_info,
		// 							uname,
		// 							action,
		// 							total_coin,
		// 							num,
		// 						} = res.data

		// 						const { uname: name } = receive_user_info
		// 						if (giftName !== '辣条') {
		// 							total += total_coin / 100
		// 						} else {
		// 							total += 0
		// 						}

		// 						danmakuList.push({
		// 							uid,
		// 							avatar: face,
		// 							name: uname,
		// 							type: CMD.SEND_GIFT,
		// 							money: total_coin / 100,
		// 							content: (
		// 								<span className="text-white font-bold font-lg">
		// 									<AvatarImg avatar={face} />
		// 									<span className="color-yellow">{`[${uname}]`}</span>
		// 									{`${action}给[${[name]}]`}
		// 									<br />
		// 									<span className="color-blue">
		// 										<span className="color-yellow">{`${giftName}`}</span>
		// 										{`  * ${num}`}
		// 									</span>
		// 									<br />
		// 									<span className="color-yellow">
		// 										<span className="color-white">
		// 											总价值:
		// 										</span>
		// 										{`${
		// 											giftName !== '辣条'
		// 												? total_coin / 100 + '电池'
		// 												: total_coin + '银瓜子'
		// 										} `}
		// 									</span>
		// 								</span>
		// 							),
		// 							time: new Date().getTime(),
		// 							total,
		// 						})

		// 						setList([...danmakuList])
		// 					},
		// 					ENTRY_EFFECT: res => {
		// 						const { face, uid, copy_writing } = res.data
		// 						const name = /<%(.*?)%>/g.exec(
		// 							copy_writing
		// 						)?.[1]
		// 						danmakuList.push({
		// 							uid,
		// 							avatar: face,
		// 							name: '[自动触发]',
		// 							type: CMD.ENTRY_EFFECT,
		// 							content: (
		// 								<span className="text-white font-bold font-lg">
		// 									欢迎用户 <AvatarImg avatar={face} />
		// 									<span className="color-yellow">
		// 										{name}
		// 									</span>{' '}
		// 									进入直播间!
		// 								</span>
		// 							),
		// 							time: new Date().getTime(),
		// 							total,
		// 						})
		// 						setList([...danmakuList])
		// 					},
		// 					DANMU_MSG: res => {
		// 						// 如果弹幕超过300,则清空弹幕,释放空间
		// 						if (danmakuList.length >= 400) {
		// 							message.success(
		// 								'当前弹幕过多，已进行重制'
		// 							)
		// 							reset()
		// 						}

		// 						const { info } = res
		// 						const content = info[1]
		// 						const name = info[2][1]
		// 						danmakuList.push({
		// 							type: CMD.DANMU_MSG,
		// 							content: handleContent(name, content),
		// 							name,
		// 							time: new Date().getTime(),
		// 							total,
		// 						})
		// 						setList([...danmakuList])
		// 					},
		// 					SUPER_CHAT_MESSAGE: res => {
		// 						const {
		// 							price,
		// 							background_color,
		// 							background_price_color,
		// 							message,
		// 							user_info,
		// 							end_time,
		// 							uid,
		// 						} = res.data

		// 						danmakuList.push({
		// 							type: CMD.SUPER_CHAT_MESSAGE,
		// 							uid,
		// 							avatar: user_info.face,
		// 							content: (
		// 								<span
		// 									style={{
		// 										color: 'white',
		// 										background: background_color,
		// 									}}
		// 								>
		// 									{`${user_info.uname}留言说: ${message}`}
		// 								</span>
		// 							),
		// 							name: user_info.uname,
		// 							time: new Date().getTime(),
		// 							money: price,
		// 							background_price_color,
		// 							end_time,
		// 							total,
		// 						})
		// 						setList([...danmakuList])
		// 					},
		// 					// LIVE_INTERACTIVE_GAME: res => {
		// 					// 	const { data } = res
		// 					// 	const content = data.msg
		// 					// 	const name = data.uname
		// 					// 	const uid = data.uid
		// 					// 	danmakuList.push({
		// 					// 		type: CMD.LIVE_INTERACTIVE_GAME,
		// 					// 		content,
		// 					// 		name,
		// 					// 		time: new Date().getTime(),
		// 					// 		uid,
		// 					// 	})
		// 					// 	setList([...danmakuList])
		// 					// },
		// 				}
		// 			)
		// 			setLive(live)
		// 		}
		// 		// console.log('dat', res)
		// 		// console.log(code)
		// 		// if (code === 0) {
		// 		// 	setRoomId(parseInt(room_id))
		// 		// 	setAnchor(parseInt(uid))
		// 		// 	live = createLiveConnect(
		// 		// 		{
		// 		// 			// roomId: 1007329,
		// 		// 			// roomId: 22021613,
		// 		// 			roomId: Number(
		// 		// 				roomId || location.state.roomId
		// 		// 			),
		// 		// 			uid: anchor,
		// 		// 			// authBody: {
		// 		// 			// 	uid: 34646754,
		// 		// 			// },
		// 		// 			// },
		// 		// 			// uid: 186887073,
		// 		// 			// token:
		// 		// 			// 	'8322c9db%2C1710483592%2C037eb%2A91CjBu7raIrUGvuXJ1ic9WM6qc-BHwXMwV4PoLjox9gx9vzLIjAmv-AplczSvFkrcNK9QSVldpRGZKdGFka3UtV1dGcmJiSEV1T1A5enNkVWlTdjVDckdLdEJ5d1Q1ZjRDckZVOUFnTnJZbzBrUXQwVWZId1puMkhRcHNZOXVFNXRwZVFFRDV6MTdRIIEC',
		// 		// 			// buvid:
		// 		// 			// 	'1033A822-8255-C314-E3B6-DA1F57D058EE59545infoc',
		// 		// 		},
		// 		// 		{
		// 		// 			INTERACT_WORD: res => {
		// 		// 				const { uname } = res.data
		// 		// 				danmakuList.push({
		// 		// 					type: CMD.INTERACT_WORD,
		// 		// 					name: uname,
		// 		// 					content: (
		// 		// 						<span>
		// 		// 							欢迎
		// 		// 							{`${uname}`} 进入直播间!
		// 		// 						</span>
		// 		// 					),
		// 		// 					time: new Date().getTime(),
		// 		// 					total,
		// 		// 				})
		// 		// 				setList([...danmakuList])
		// 		// 			},
		// 		// 			SEND_GIFT: res => {
		// 		// 				const {
		// 		// 					uid,
		// 		// 					face,
		// 		// 					giftName,
		// 		// 					receive_user_info,
		// 		// 					uname,
		// 		// 					action,
		// 		// 					total_coin,
		// 		// 					num,
		// 		// 				} = res.data

		// 		// 				const { uname: name } = receive_user_info
		// 		// 				if (giftName !== '辣条') {
		// 		// 					total += total_coin / 100
		// 		// 				} else {
		// 		// 					total += 0
		// 		// 				}

		// 		// 				danmakuList.push({
		// 		// 					uid,
		// 		// 					avatar: face,
		// 		// 					name: uname,
		// 		// 					type: CMD.SEND_GIFT,
		// 		// 					money: total_coin / 100,
		// 		// 					content: (
		// 		// 						<span className="text-white font-bold font-lg">
		// 		// 							<AvatarImg avatar={face} />
		// 		// 							<span className="color-yellow">{`[${uname}]`}</span>
		// 		// 							{`${action}给[${[name]}]`}
		// 		// 							<br />
		// 		// 							<span className="color-blue">
		// 		// 								<span className="color-yellow">{`${giftName}`}</span>
		// 		// 								{`  * ${num}`}
		// 		// 							</span>
		// 		// 							<br />
		// 		// 							<span className="color-yellow">
		// 		// 								<span className="color-white">
		// 		// 									总价值:
		// 		// 								</span>
		// 		// 								{`${
		// 		// 									giftName !== '辣条'
		// 		// 										? total_coin / 100 + '电池'
		// 		// 										: total_coin + '银瓜子'
		// 		// 								} `}
		// 		// 							</span>
		// 		// 						</span>
		// 		// 					),
		// 		// 					time: new Date().getTime(),
		// 		// 					total,
		// 		// 				})

		// 		// 				setList([...danmakuList])
		// 		// 			},
		// 		// 			ENTRY_EFFECT: res => {
		// 		// 				const { face, uid, copy_writing } = res.data
		// 		// 				const name = /<%(.*?)%>/g.exec(
		// 		// 					copy_writing
		// 		// 				)?.[1]
		// 		// 				danmakuList.push({
		// 		// 					uid,
		// 		// 					avatar: face,
		// 		// 					name: '[自动触发]',
		// 		// 					type: CMD.ENTRY_EFFECT,
		// 		// 					content: (
		// 		// 						<span className="text-white font-bold font-lg">
		// 		// 							欢迎用户 <AvatarImg avatar={face} />
		// 		// 							<span className="color-yellow">
		// 		// 								{name}
		// 		// 							</span>{' '}
		// 		// 							进入直播间!
		// 		// 						</span>
		// 		// 					),
		// 		// 					time: new Date().getTime(),
		// 		// 					total,
		// 		// 				})
		// 		// 				setList([...danmakuList])
		// 		// 			},
		// 		// 			DANMU_MSG: res => {
		// 		// 				// 如果弹幕超过300,则清空弹幕,释放空间
		// 		// 				if (danmakuList.length >= 400) {
		// 		// 					message.success(
		// 		// 						'当前弹幕过多，已进行重制'
		// 		// 					)
		// 		// 					reset()
		// 		// 				}

		// 		// 				const { info } = res
		// 		// 				const content = info[1]
		// 		// 				const name = info[2][1]
		// 		// 				danmakuList.push({
		// 		// 					type: CMD.DANMU_MSG,
		// 		// 					content: handleContent(name, content),
		// 		// 					name,
		// 		// 					time: new Date().getTime(),
		// 		// 					total,
		// 		// 				})
		// 		// 				setList([...danmakuList])
		// 		// 			},
		// 		// 			SUPER_CHAT_MESSAGE: res => {
		// 		// 				const {
		// 		// 					price,
		// 		// 					background_color,
		// 		// 					background_price_color,
		// 		// 					message,
		// 		// 					user_info,
		// 		// 					end_time,
		// 		// 					uid,
		// 		// 				} = res.data

		// 		// 				danmakuList.push({
		// 		// 					type: CMD.SUPER_CHAT_MESSAGE,
		// 		// 					uid,
		// 		// 					avatar: user_info.face,
		// 		// 					content: (
		// 		// 						<span
		// 		// 							style={{
		// 		// 								color: 'white',
		// 		// 								background: background_color,
		// 		// 							}}
		// 		// 						>
		// 		// 							{`${user_info.uname}留言说: ${message}`}
		// 		// 						</span>
		// 		// 					),
		// 		// 					name: user_info.uname,
		// 		// 					time: new Date().getTime(),
		// 		// 					money: price,
		// 		// 					background_price_color,
		// 		// 					end_time,
		// 		// 					total,
		// 		// 				})
		// 		// 				setList([...danmakuList])
		// 		// 			},
		// 		// 			// LIVE_INTERACTIVE_GAME: res => {
		// 		// 			// 	const { data } = res
		// 		// 			// 	const content = data.msg
		// 		// 			// 	const name = data.uname
		// 		// 			// 	const uid = data.uid
		// 		// 			// 	danmakuList.push({
		// 		// 			// 		type: CMD.LIVE_INTERACTIVE_GAME,
		// 		// 			// 		content,
		// 		// 			// 		name,
		// 		// 			// 		time: new Date().getTime(),
		// 		// 			// 		uid,
		// 		// 			// 	})
		// 		// 			// 	setList([...danmakuList])
		// 		// 			// },
		// 		// 		}
		// 		// 	)
		// 		// ready.value = true
		// 		// } else {
		// 		// 	// errMsg.value = msg
		// 		// }
		// 	})
		// 	.catch(() => {
		// 		message.error('获取房间信息失败')
		// 		// errMsg.value = '获取房间信息失败'
		// 		// if (canCORS)
		// 		// 	errMsg.value +=
		// 		// 		'，请检查是否正确禁用了浏览器的 web security 以允许直接跨域'
		// 	})
	}

	useEffect(() => {
		connect()
		message.success(
			`弹幕连接成功: 房间号${location.state.roomId}`
		)
	}, [])

	function disConnect() {
		live.close()
		reset()
	}

	// console.log(`Electron ${process.versions.electron}!`)

	// async function getInfo() {
	// 	const { url, qrcode_key } = await getQrCodeInfo()
	// 	setUrl(url)
	// 	setCodeKey(qrcode_key)
	// }

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

			{/* <Button onClick={() => live.close()}>断开连接</Button>
			<Button
				onClick={() => {
					setList([])
					danmakuList.length = 0
				}}
			>
				清空弹幕
			</Button> */}

			{/* <Speech /> */}

			<DanmakuList
				total={list[list.length - 1]?.total || 0}
				danmakuList={list}
			/>

			{/* <Space className="items-center mt-2rem">
				<InputNumber
					className="flex w-300px"
					placeholder="限制弹幕的数量,默认300"
					// defaultValue={4245963}
					// defaultValue={23271282}
					onBlur={e => {
						setLimit(Number(e.target.value))
						message.success(
							`弹幕数量限制更改成功,当前弹幕上限为:${limit}`
						)
					}}
				/>

				<span className="color-white">
					当前弹幕上限:{' '}
					<span className="color-red font-bold text-lg">
						{limit}
					</span>
					<br />
					当前弹幕数:{' '}
					<span className="color-yellow font-boild text-lg">
						{list.length}
					</span>
				</span>
			</Space> */}

			<Space
				size={16}
				className="w-600px mt-2rem justify-center"
			>
				<Button
					onClick={() => {
						disConnect()
						navigate('/')
						message.success('已自动断开弹幕连接')
					}}
				>
					<span className="color-white">返回</span>
				</Button>

				<Button
					onClick={() => {
						// disConnect()
						live.close()
						message.success('已断开弹幕连接')
					}}
				>
					<span className="color-white">断开弹幕连接</span>
				</Button>

				<Button
					onClick={() => {
						danmakuList.length = 0
						message.success('已清空弹幕')
						setList([])
					}}
				>
					<span className="color-white">清空弹幕</span>
				</Button>
			</Space>

			{/* <img src={url} /> */}
		</>
	)
}

export default App
