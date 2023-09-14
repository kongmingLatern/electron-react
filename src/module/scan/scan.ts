import { message } from 'antd'
import { toDataURL } from 'qrcode'
import { get } from '../../api/get'

type ScanCode = 0 | 86038 | 86090 | 86101

interface QrCodeInfoType {
	code: ScanCode
	data: Record<'qrcode_key', string> & Record<'url', string>
	message: string
	ttl: number
}

interface ScanDataType {
	code: ScanCode
	message: string
	refresh_token: string
	sessionData: string
	timestamp: string
	url: string
}

interface ScanReturnType {
	code: ScanCode
	msg: string
	data: ScanDataType
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

export const scanQrCode = async (qrcode_key: string) => {
	const res = await get<ScanReturnType>('/scan', {
		qrcode_key,
	})
	sessionStorage.setItem('SESSDATA', res.data.sessionData)
	return res
}
