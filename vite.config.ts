import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { addRxPlugin } from 'rxdb'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'

let isDevMode = true

if (isDevMode) {
	addRxPlugin(RxDBDevModePlugin)
}
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()],
})
