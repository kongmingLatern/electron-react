import { CMD } from '@/module/connect/const'
import { ItemProps } from '@/pages/DanmakuList'
import '@/assets/animation.scss'
import Card from './Card'
import Avatar from '@/assets/avatar.jpeg'
import Call from '@/assets/call.png'
import Love from '@/assets/love.png'

export default function Item(props: Partial<ItemProps>) {
	const { type, avatar, name, time, content } = props
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

	return (
		<li className="max-w-[500px] flex flex-col slide-up-animation">
			{type === CMD.ENTRY_EFFECT && (
				<Card
					{...{
						...props,
						name: '[三月] 直播间舰长专属弹幕',
						avatar: Call,
					}}
				/>
			)}
			{type === CMD.SEND_GIFT && (
				<Card
					{...{
						...props,
						name: '感谢礼物',
						avatar: Love,
					}}
				/>
			)}
			{type === CMD.DANMU_MSG && (
				<div className="chat chat-start">
					<div className="chat-image avatar">
						<div className="w-10 rounded-full">
							<img src={Avatar} />
						</div>
					</div>
					<div className="chat-header">
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
						className={`chat-bubble max-w-[500px] flex flex-wrap`}
						style={handleType()}
					>
						{content}
					</div>
				</div>
			)}
		</li>
	)
}
