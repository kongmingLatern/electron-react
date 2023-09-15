export default function Item(props) {
	const { avatar, name, time, content } = props
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
					<time className="text-xs opacity-50">{time}</time>
				</div>
				<div className="chat-bubble">{content}</div>
			</div>
		</li>
	)
}
