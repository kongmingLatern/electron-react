import Item from '@/components/Item'

export default function DanmakuList(props) {
	const Items = [
		{
			avatar:
				'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
			name: '凤之兮原',
			time:
				new Date().getHours() +
				':' +
				new Date().getMinutes(),
			content: '啦啦啦',
		},
		{
			avatar:
				'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
			name: '凤之兮原',
			time:
				new Date().getHours() +
				':' +
				new Date().getMinutes(),
			content: '啦啦啦',
		},
		{
			avatar:
				'https://xsgames.co/randomusers/avatar.php?g=pixel&key=1',
			name: '凤之兮原',
			time:
				new Date().getHours() +
				':' +
				new Date().getMinutes(),
			content: '啦啦啦',
		},
	]

	return (
		<ul>
			{props.danmakuList.map((i, index) => (
				<Item key={index} {...i} />
			))}
		</ul>
	)
}
