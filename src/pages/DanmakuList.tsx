import Item from '@/components/Item'

export interface ItemProps {
	uid: string
	avatar: string
	name: string
	time: number
	content: string
}

export default function DanmakuList(props) {
	return (
		<ul>
			{props.danmakuList.map(
				(i: Partial<ItemProps>, index) => (
					<Item key={index} {...i} />
				)
			)}
		</ul>
	)
}
