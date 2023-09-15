import { KeepLiveWS } from 'bilibili-live-ws'
import { ConnectProps } from './type'

interface Methods<T> {
	open: (args?: T) => any
	live: (args?: T) => any
	msg: (args?: T) => any
	close: (args?: T) => any
	DANMU_MSG: (args?: T) => any
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
	live.on('DANMU_MSG', data => {
		console.log('弹幕', data)
		options.DANMU_MSG?.(data)
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
