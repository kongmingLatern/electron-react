export default function AvatarImg(props) {
	const { avatar } = props
	return (
		<img
			className="inline-block"
			src={`https://api.codetabs.com/v1/proxy/?quest=${avatar}`}
			width={30}
			height={30}
			style={{
				borderRadius: '50%',
			}}
		/>
	)
}
