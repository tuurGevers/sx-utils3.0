import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from "path";

export default defineConfig({
	plugins: [sveltekit()],
	server:{
		fs: {
			// Add the directory you want Vite to serve here:
			allow: [path.resolve(__dirname, './sx-static')]
		}
	},
});
