export default function RankHeader(props) {
	const { total } = props

	return (
		<div className="sticky flex white-nownap overflow-x-scroll top-0 left-0 z-10 bg-white">
			<button className="btn">
				<span>今日收到礼物总价值:</span>
				<div className="badge">{total}</div>
				电池
			</button>
		</div>
	)
}
