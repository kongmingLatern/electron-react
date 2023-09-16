import { CMD } from '@/module/connect/const'
import { getFace } from '@/utils'
import { ItemProps } from '@/pages/DanmakuList'
import '@/assets/animation.scss'
import '@/assets/item.scss'
import Card from './Card'
import Avatar from '@/assets/avatar.jpeg'
import Call from '@/assets/call.png'
import Love from '@/assets/love.png'

export default function Item(props: Partial<ItemProps>) {
	const { uid, type, avatar, name, time, content } = props
	const date = new Date(time as number)
	const hours = date.getHours()
	const mins = date.getMinutes()
	const seconds = date.getSeconds()
	const formatFn = num => {
		if (num < 10) {
			return `0${num}`
		} else {
			return num
		}
	}

	const handleType = () => {
		switch (type) {
			case CMD.DANMU_MSG:
				return undefined
			case CMD.LIVE_INTERACTIVE_GAME:
				return {
					background: 'blue',
				}
			// 进场特效,主要是舰长
			case CMD.ENTRY_EFFECT:
				return {
					background: 'red',
				}
			case CMD.SEND_GIFT:
				return {
					background: 'yellow',
					color: 'red',
					fontWeight: 700,
				}
			default:
				break
		}
	}

	const getImg = () => {
		if (avatar && uid) {
			return getFace(uid)
		}
		return Avatar
	}

	return (
		<li className="max-w-[500px] flex flex-col slide-up-animation ">
			{type === CMD.ENTRY_EFFECT && (
				<Card
					{...{
						...props,
						name: '[三月] 直播间舰长专属弹幕',
						cover: Call,
					}}
				/>
			)}
			{type === CMD.SEND_GIFT && (
				<Card
					{...{
						...props,
						name: '感谢礼物',
						cover: Love,
					}}
				/>
			)}
			{type === CMD.DANMU_MSG && (
				<div className="chat chat-start ">
					<div className="chat-image avatar">
						<div className="w-10 rounded-full">
							<img src={Avatar} />
						</div>
					</div>
					<div className="color-white chat-header">
						{name}{' '}
						<time className="text-xs opacity-50">
							{formatFn(hours) +
								':' +
								formatFn(mins) +
								':' +
								formatFn(seconds)}
						</time>
					</div>
					<div
						className={`max-w-[400px] color-white rounded-15px px-20px h-40px lh-40px overflow-hidden flex flex-wrap background`}
						style={handleType()}
					>
						{content}
					</div>
				</div>
			)}
		</li>
	)
}
