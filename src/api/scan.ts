import { message } from 'antd'
import { toDataURL } from 'qrcode'
import { get } from './get'

interface QrCodeInfoType {
	code: number
	data: Record<'qrcode_key', string> & Record<'url', string>
	message: string
	ttl: number
}

export async function getQrCodeInfo() {
	let url = ''
	const res = await get<QrCodeInfoType>('/getQrcode').catch(
		(e: Record<string, any>) => {
			message.error(e.message)
		}
	)
	toDataURL(
		(res as QrCodeInfoType).data.url,
		{},
		(err, dataURL) => {
			if (err) {
				console.error(err)
				return
			}
			url = dataURL
		}
	)
	return {
		url,
		qrcode_key: (res as QrCodeInfoType).data.qrcode_key,
	}
}
