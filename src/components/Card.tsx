export default function Card(props) {
	const {
		type,
		avatar,
		name = '[三月] 直播间舰长专属弹幕',
		time,
		content,
	} = props
	return (
		<div className="ml-0.5rem overflow-hidden card w-96 bg-base-100 shadow-xl bg-red-500 mb-2">
			<header className="bg-red-800 color-white text-center font-bold">
				{name}
			</header>
			<figure>
				<img src={avatar} alt={'头像'} width={100} />
			</figure>
			<div className="card-body">
				{/* <h2 className="card-title">进场特效: {name}</h2> */}
				<p className="text-center">{content}</p>
				{/* <div className="card-actions justify-end">
					<button className="btn btn-warning">80 TA</button>
				</div> */}
			</div>
		</div>
	)
}
