import { mapperEmo } from '../emo'

export function handleContent(
	name: string,
	content: string
) {
	// TODO: 根据内容进行劫持,例如:匹配到指定词组后展示某个表情
	let emoj
	let text

	emoj = matchBasicContent(content, emoj)

	text = orderContent(content, name)

	return (
		<span>
			{emoj && <img src={emoj} />}
			{!emoj && <span>{text}</span>}
		</span>
	)
}
function matchBasicContent(content: string, emoj: any) {
	if (content === '爱你') {
		emoj = mapperEmo['爱你']
	} else if (content.includes('call')) {
		emoj = mapperEmo['call']
	} else if (content === '哇') {
		emoj = mapperEmo['wa']
	} else if (content === '80') {
		emoj = mapperEmo['80']
	} else if (content === '摸摸') {
		emoj = mapperEmo['摸']
	} else if (content === '赞') {
		emoj = mapperEmo['赞']
	} else if (content.includes('???')) {
		emoj = mapperEmo['问号']
	}
	return emoj
}

function orderContent(content: string, name: string) {
	let result = content

	if (content.includes('--')) {
		// NOTE: 对于特定格式的弹幕,例如: @[xxx] --action 拍 hahaha => transform: [name]拍了拍xxx,说 xxx
		result =
			name +
			content.replace(
				/@\[(.*?)\] --action ([^ ]+) (.+)/,
				'$2了$2$1,说$3'
			)
	} else if (content.includes('@')) {
		// NOTE: 对于特定格式的弹幕,例如: @[xxx] hahaha => transform: [name]@了xxx,说xxx
		result =
			name +
			content.replace(/@\[(.*?)\] (.+)/, ' @了 $1 ,说 $2 ')
	}

	return result
}
