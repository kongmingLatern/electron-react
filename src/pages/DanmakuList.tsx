import Item from '@/components/Item'
import { CMD } from '@/module/connect/const'

export interface ItemProps {
	type?: CMD
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
