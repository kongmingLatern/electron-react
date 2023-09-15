import { useEffect, useRef, useState } from 'react'
import Item from '@/components/Item'
import { CMD } from '@/module/connect/const'

export interface ItemProps {
	type?: CMD
	uid: string
	avatar: string
	name: string
	time: number
	content: string | React.ReactNode
}

export default function DanmakuList(props) {
	const containerRef = useRef(null)
	const [isOverflow, setIsOverflow] = useState(false)
	const [mouseOver, setMouseOver] = useState(false)
	let timer

	useEffect(() => {
		const container: any = containerRef.current

		// 检测是否内容超过容器高度
		function checkOverflow() {
			if (container) {
				setIsOverflow(
					container.scrollHeight > container.clientHeight
				)
			}
		}

		// 每当内容有变化时检测是否内容超过容器高度
		checkOverflow()

		// 监听内容变化
		const observer = new MutationObserver(checkOverflow)
		observer.observe(container! as Node, {
			childList: true,
			subtree: true,
		})

		// 清理观察者
		return () => {
			observer.disconnect()
		}
	}, [])

	useEffect(() => {
		const container: any = containerRef.current
		if (mouseOver && isOverflow) {
			clearInterval(timer)
		} else if (!mouseOver && isOverflow) {
			timer = intervalScroll(container)
		} else {
			// 自动滚动到底部
			if (container && isOverflow) {
				clearInterval(timer)
				timer = intervalScroll(container)
			}
		}

		return () => clearInterval(timer)
	}, [isOverflow, mouseOver])

	return (
		<div
			ref={containerRef}
			className={`max-h-[700px] min-h-[700px] border ${
				isOverflow ? 'overflow-y-scroll' : ''
			}`}
			onMouseOver={() => {
				setMouseOver(true)
			}}
			onMouseLeave={() => {
				setMouseOver(false)
			}}
		>
			<ul
				className="p-0 m-0"
				style={{
					transition: 'all .5s',
				}}
			>
				{props.danmakuList.map(
					(i: Partial<ItemProps>, index) => (
						<Item key={index} {...i} />
					)
				)}
			</ul>
		</div>
	)

	function intervalScroll(container: any) {
		return setInterval(() => {
			container.scrollTop = container.scrollHeight
		}, 0)
	}
}
