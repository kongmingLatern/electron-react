import React from 'react'
import { Button, Space, Form, Input } from 'antd'

const onFinish = (values: any) => {
	console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
	console.log('Failed:', errorInfo)
}

type FieldType = {
	roomId: string
	username?: string
	password?: string
	remember?: string
}

const App: React.FC = () => (
	<Form
		className="p-5 pb-0"
		name="basic"
		labelCol={{ span: 8 }}
		wrapperCol={{ span: 16 }}
		style={{ maxWidth: 600 }}
		onFinish={onFinish}
		onFinishFailed={onFinishFailed}
		autoComplete="off"
	>
		<Form.Item<FieldType>
			labelAlign="left"
			wrapperCol={{ pull: 3 }}
			label="直播间Id"
			name="roomId"
		>
			<Input />
		</Form.Item>

		<Form.Item<FieldType>
			labelAlign="left"
			wrapperCol={{ pull: 3 }}
			label="认证密钥"
			name="password"
		>
			<Input.Password />
		</Form.Item>

		<Form.Item wrapperCol={{ offset: 7, span: 20 }}>
			<Space size={24}>
				<Button type="default" htmlType="submit">
					注册
				</Button>
				<Button type="default" htmlType="submit">
					连接
				</Button>
			</Space>
		</Form.Item>
	</Form>
)

export default App
