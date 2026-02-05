import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
		dts({
			tsconfigPath: './tsconfig.app.json',
			insertTypesEntry: true,
			exclude: ['src/playground', 'src/App.vue', 'src/main.ts'],
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'vlite3',
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			// Externalize deps that should not be bundled
			external: (id) => {
				const externals = [
					'vue',
					'v-tooltip-lite',
					'v-datepicker-lite',
					'v-notion-editor',
					'vue-carousel-lite',
					'@vueuse/core',
					'@iconify/vue',
					'vue-router',
					'@formkit/drag-and-drop',
					'@jaames/iro',
					'iconify-icon-picker',
				]
				// Check exact match or start with for scoped packages if needed
				// For simple behavior, we can check if the id starts with the external name
				return externals.some(
					(ext) => id === ext || id.startsWith(ext + '/'),
				)
			},
			output: {
				preserveModules: true,
				preserveModulesRoot: 'src',
				entryFileNames: '[name].js',
				exports: 'named',
				assetFileNames: 'style.[ext]',
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
})
