import { CMD } from '@/module/connect/const'
import { ItemProps } from '@/pages/DanmakuList'

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
		<li>
			<div className="chat chat-start">
				<div className="chat-image avatar">
					<div className="w-10 rounded-full">
						<img src={avatar} />
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
				<div className={`chat-bubble`} style={handleType()}>
					{content}
				</div>
			</div>
		</li>
	)
}
