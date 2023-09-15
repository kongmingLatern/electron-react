import { KeepLiveWS } from 'bilibili-live-ws'
import { ConnectProps } from './type'
import { CMD } from './const'

interface Methods<T> {
	open: (args?: T) => any
	live: (args?: T) => any
	msg: (args?: T) => any
	close: (args?: T) => any
	DANMU_MSG: (args?: T) => any
	ENTRY_EFFECT: (args?: T) => any
	SEND_GIFT: (args?: T) => any
	LIVE_INTERACTIVE_GAME: (args?: T) => any
	heartbeat: (args?: T) => any
}

export function createLiveConnect(
	props: ConnectProps,
	options: Partial<Methods<any>>
) {
	const live = new KeepLiveWS(props?.roomId as number, {
		uid: props.uid,
	})

	live.on('open', () => {
		console.log('已连接直播弹幕服务器')
		options.open?.()
		// addInfoDanmaku('已连接直播弹幕服务器')
	})
	live.on('live', () => {
		console.log('已连接直播间', props.roomId)
		options.live?.()
		// addInfoDanmaku(`已连接直播间 ${props.room}`)
	})
	live.on('msg', data => {
		console.log('收到消息', data)
		options.msg?.(data)
		// addInfoDanmaku(`已连接直播间 ${props.room}`)
	})
	live.on(CMD.SEND_GIFT, data => {
		options.SEND_GIFT?.(data)
	})
	live.on('ENTRY_EFFECT', data => {
		console.log('进场特效', data)
		options.ENTRY_EFFECT?.(data)
	})

	live.on('DANMU_MSG', data => {
		console.log('弹幕', data)
		options.DANMU_MSG?.(data)
	})

	live.on('LIVE_INTERACTIVE_GAME', data => {
		console.log('INTERACTIVE_GAME', data)
		options.LIVE_INTERACTIVE_GAME?.(data)
	})

	live.on('close', () => {
		console.log('已断开与直播弹幕服务器的连接')
		options.close?.()
	})
	live.on('heartbeat', online => {
		console.log('当前人气值', online)
		options.heartbeat?.()
	})

	return live
}
