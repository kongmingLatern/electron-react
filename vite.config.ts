import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import pkg from './package.json'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
	rmSync('dist-electron', { recursive: true, force: true })

	const isServe = command === 'serve'
	const isBuild = command === 'build'
	const sourcemap = isServe || !!process.env.VSCODE_DEBUG

	return {
		resolve: {
			alias: {
				'@': path.join(__dirname, 'src'),
			},
		},
		plugins: [
			react(),
			UnoCSS({
				configFile: './uno.config.ts',
			}),
			electron([
				{
					// Main-Process entry file of the Electron App.
					entry: 'electron/main/index.ts',
					onstart(options) {
						if (process.env.VSCODE_DEBUG) {
							console.log(
								/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'
							)
						} else {
							options.startup()
						}
					},
					vite: {
						build: {
							sourcemap,
							minify: isBuild,
							outDir: 'dist-electron/main',
							rollupOptions: {
								external: Object.keys(
									'dependencies' in pkg
										? pkg.dependencies
										: {}
								),
							},
						},
					},
				},
				{
					entry: 'electron/preload/index.ts',
					onstart(options) {
						// Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
						// instead of restarting the entire Electron App.
						options.reload()
					},
					vite: {
						build: {
							sourcemap: sourcemap ? 'inline' : undefined, // #332
							minify: isBuild,
							outDir: 'dist-electron/preload',
							rollupOptions: {
								external: Object.keys(
									'dependencies' in pkg
										? pkg.dependencies
										: {}
								),
							},
						},
					},
				},
			]),
			// Use Node.js API in the Renderer-process
			renderer(),
		],
		server: {
			port: 8000,
			origin: 'http://localhost:8000',
			proxy: {
				'/x': {
					// 这里配置要代理的路径前缀
					target: 'https://passport.bilibili.com', // 设置目标地址
					changeOrigin: true, // 将请求头中的host设置为target的域名
					secure: false, // 如果目标是https，需要设置为false
					rewrite: path => path.replace(/^\/x/, ''), // 可选，重写路径，例如去掉前缀
				},
			},
		},
		// process.env.VSCODE_DEBUG &&
		// (() => {
		// 	const url = new URL(
		// 		pkg.debug.env.VITE_DEV_SERVER_URL
		// 	)
		// 	return {
		// 		host: url.hostname,
		// 		port: +url.port,
		// 	}
		// })(),
		clearScreen: false,
	}
})
