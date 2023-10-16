import { CMD } from '@/module/connect/const'
import { getFormatTime } from '@/utils'
import { ItemProps } from '@/pages/DanmakuList'
import '@/assets/animation.scss'
import '@/assets/item.scss'
import Card from './Card'
import Call from '@/assets/call.png'
import Love from '@/assets/love.png'
import Wa from '@/assets/wa.png'
import Zan from '@/assets/zan.png'
import wa from '@/assets/wa.gif'
import Bat from '@/assets/bat.gif'
import Avatar from '@/assets/avatar.webp'

export default function Item(props: Partial<ItemProps>) {
	const { uid, type, avatar, name, time, content } = props

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
		<li className="max-w-[500px] enter-cover flex flex-col slide-up-animation cover">
			{type === CMD.ENTRY_EFFECT && (
				<Card
					{...{
						...props,
						name: '[三月] 直播间进场特效弹幕',
						cover: Call,
					}}
				/>
			)}
			{(type === CMD.SEND_GIFT ||
				type === CMD.POPULARITY_RED_POCKET_NEW) && (
				<Card
					{...{
						...props,
						avatar,
						name: '感谢礼物',
						cover: Love,
					}}
				/>
			)}
			{type === CMD.SUPER_CHAT_MESSAGE && (
				<Card
					{...{
						...props,
						avatar,
						name: '醒目留言',
						cover: Wa,
						background: '#a40052',
						headerBackground: 'yellow',
						headerColor: 'black',
					}}
				/>
			)}
			{type === CMD.DANMU_MSG && (
				<div className="chat chat-start pl-[0.5rem]">
					<div className="chat-image avatar">
						<div className="w-[3rem]">
							<img src={avatar} className="rounded-full" />
							<img
								src={Avatar}
								style={{
									width: 70,
									height: 70,
									minWidth: 70,
								}}
								className="absolute top-[-12px] left-[-10px]"
							/>
						</div>
					</div>
					<div className="color-white chat-header">
						{name}{' '}
						<time className="text-xs opacity-50">
							{getFormatTime(time)}
						</time>
					</div>
					<div
						className={`relative max-w-[600px] min-w-[300px] px-20px color-white rounded-15px min-h-40px lh-40px flex flex-wrap background popup`}
						style={handleType()}
					>
						{content}

						{/* <div className="absolute right-[-10px] top-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
							<img
								src={Pank}
								width={40}
								height={40}
								style={{
									transform: 'rotate(0deg)',
								}}
							/>
						</div> */}
						<div className="absolute left-[200px] bottom-[5px] z-10 slide-up-reverse">
							<img
								src={Bat}
								width={50}
								height={50}
								style={{
									transform: 'rotate(45deg)',
								}}
							/>
						</div>

						<div className="absolute right-[-15px] bottom-[5px] z-11 slide-up">
							<img
								src={Bat}
								width={50}
								height={50}
								style={{
									transform: 'rotate(-45deg)',
								}}
							/>
						</div>
						<div className="absolute right-[-20px] top-[-30px] z-10">
							<img
								src={wa}
								width={50}
								height={50}
								style={{
									transform: 'rotate(35deg)',
								}}
							/>
						</div>
					</div>
				</div>
			)}
			{type === CMD.LIKE_INFO_V3_CLICK && (
				<Card
					{...{
						...props,
						name: '收到点赞信息',
						cover: Zan,
						// background: '#052083',
						background: '#293a79',
						headerBackground: '#511482e0720f',
					}}
				/>
			)}
			{type === CMD.GUARD_BUY && (
				<Card
					{...{
						...props,
						name: '上舰通知',
						cover: Wa,
						background:
							'linear-gradient( 135deg, #5EFCE8 10%, #736EFE 100%);',
						headerBackground: 'crimson',
					}}
				/>
			)}
			{type === CMD.INTERACT_WORD && (
				<div className="chat chat-start ">
					<div
						className={`chat-bubble max-w-[500px] px-20px color-white rounded-15px min-h-40px overflow-hidden flex flex-wrap background`}
						style={handleType()}
					>
						{content}
					</div>
				</div>
			)}
		</li>
	)
}
