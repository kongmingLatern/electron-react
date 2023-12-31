import Card from '@/components/Card'
import { mapperEmo } from '../emo'
import Wa from '@/assets/wa.png'
import Eval from 'expr-eval'
import { getFormatTime } from '@/utils'
const Parser = Eval.Parser

export function handleContent(
	name: string,
	content: string
) {
	// TODO: 根据内容进行劫持,例如:匹配到指定词组后展示某个表情
	let emoj

	// const url = isBilibilEmoj(content)

	emoj = matchBasicContent(content)

	const { emoj: Emoj, result } = orderContent(content, name)

	return (
		<span className="inline-flex items-center">
			{result !== content ? (
				<Card
					cover={Emoj || Wa}
					name="触发特殊指令"
					content={result}
				/>
			) : (
				<span>{content}</span>
			)}
			{emoj && (
				<img
					src={emoj}
					width={'18%'}
					height={'18%'}
					style={{
						display: 'inline-block',
					}}
				/>
			)}
		</span>
	)
}

// TODO: B站表情映射
// function isBilibilEmoj(content: string) {
// 	const target = mapperEmoji()
// 	target.some(i => {
// 		if(/\[(.*)\]/g.exec(i.emoji))
// 	})
// }

function matchBasicContent(content: string) {
	let emoj = ''
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
	} else if (
		content.includes('?') ||
		content.includes('？')
	) {
		emoj = mapperEmo['问号']
	}
	return emoj
}

function orderContent(content: string, name: string) {
	let result = content
	const reg = {
		ACTION: /> *(\w+)/,
		// >calc 1+1+2+3
		CALC: />(.*?) (.+)/,
		// NOTE: /80 1232123
		TRANSFORM: /\/(.*?) (.+)/,
		// NOTE: @san something
		COMMON: /@(.*?) (.+)/,
		// NOTE: @san --action something
		SPEC: /@(.*?) --action ([^ ]+) (.+)/,
	}

	if (content.includes('--') && reg.SPEC.test(content)) {
		// NOTE: @xxx --action 拍 hahaha => name拍了拍xxx,说 xxx
		result =
			name + content.replace(reg.SPEC, '$2了$2$1,说$3')
	} else if (
		content.startsWith('/') &&
		reg.TRANSFORM.test(content)
	) {
		// TODO: /表情 哈哈哈
		// NOTE: /80 123 => Img + 123
		const emo = reg.TRANSFORM.exec(content)?.[1]
		const emoj = matchBasicContent(emo as string)
		result = content.replace(reg.TRANSFORM, '$2')
		return {
			emoj,
			result,
		}
	} else if (
		content.startsWith('@') &&
		reg.COMMON.test(content)
	) {
		// NOTE: @xxx hahaha => name@了xxx,说xxx
		result =
			name + content.replace(reg.COMMON, ' @了 $1 ,说 $2 ')
	} else if (content.startsWith('>')) {
		// 先获取到 > 后面操作码
		let action = reg.ACTION.exec(content)?.[1]
		let info

		if (reg.CALC.test(content)) {
			info = reg.CALC.exec(content)?.[2]
		}

		switch (action) {
			case 'welcome':
				result = '欢迎大家来到三月直播间哦!'
				break
			case 'calc':
				result = `${info} 的计算结果为: ${calculateMathExpression(
					info!
				)}`
				break
			case 'time':
				result = `当前时间: ${getFormatTime(
					new Date().getTime()
				)}`
				break
		}
	}

	return {
		emoj: '',
		result,
	}
}
function calculateMathExpression(expression) {
	const parser = new Parser()
	const ast = parser.parse(expression)
	const result = ast.evaluate({})
	return result
}
