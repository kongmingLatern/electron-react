import { getFace } from '@/utils'
import { loadImg } from '@/utils/loadImg'
import { corsGetResp, get } from '@/utils/request'
import { useEffect } from 'react'

export default function Card(props) {
	const {
		uid,
		type,
		avatar,
		cover,
		name = '[三月] 直播间舰长专属弹幕',
		time,
		content,
	} = props

	useEffect(() => {
		async function getImg() {
			console.log('uid', uid)
			if (uid) {
				const res = await getFace(186887073)
				console.log('res', res)
				return res
			} else {
				return ''
			}
		}
		getImg()
	}, [])

	return (
		<div className="mt-1rem rounded-lg ml-0.5rem overflow-hidden card w-96 bg-base-100 shadow-xl bg-red-500 mb-2">
			<header className="bg-red-800 color-white text-center font-bold">
				{name}
			</header>
			<figure className='mt-1rem'>
				<img src={cover} alt={'头像'} width={100} />
			</figure>
			<div className="card-body p-0 my-1rem">
				{/* <h2 className="card-title">进场特效: {name}</h2> */}
				<p className="text-center">{content}</p>
				{/* <div className="card-actions justify-end">
					<button className="btn btn-warning">80 TA</button>
				</div> */}
			</div>
		</div>
	)
}
