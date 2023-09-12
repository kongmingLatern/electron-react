import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
	presets: [
		presetUno(),
		presetAttributify({}),
		presetIcons(),
	],
	shortcuts: {
		'absolute-center':
			'absolute left-50% top-50% translate-x-[-50%] translate-y-[-50%]',
	},
})
