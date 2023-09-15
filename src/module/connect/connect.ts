import { KeepLiveWS } from 'bilibili-live-ws'
import { ConnectProps } from './type'

export function createLiveConnect(
	props: ConnectProps,
	options = {
		open: (args?) => {},
		live: (args?) => {},
		msg: (args?) => {},
		close: (args?) => {},
		heartbeat: (args?) => {},
	}
) {
	const live = new KeepLiveWS(props?.roomId as number, {
		uid: props.uid,
	})

	live.on('open', () => {
		console.log('已连接直播弹幕服务器')
		options.open()
		// addInfoDanmaku('已连接直播弹幕服务器')
	})
	live.on('live', () => {
		console.log('已连接直播间', props.roomId)
		options.live()
		// addInfoDanmaku(`已连接直播间 ${props.room}`)
	})
	live.on('msg', data => {
		console.log('收到消息', data)
		options.msg(data)
		// addInfoDanmaku(`已连接直播间 ${props.room}`)
	})
	live.on('close', () => {
		console.log('已断开与直播弹幕服务器的连接')
		options.close()
	})
	live.on('heartbeat', online => {
		console.log('当前人气值', online)
		options.heartbeat()
	})

	return live
}
