import { generateApiSignature } from '@/api/appKey'
import axios from 'axios'

const { appKey, sign } = generateApiSignature()

const api = axios.create({
	baseURL: 'http://localhost:3000',
	timeout: 20000,
})

api.interceptors.request.use(config => {
	return config
})

api.interceptors.response.use((response: any) => {
	return response.data
})

export { api as axios }
