// @ts-check

import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
	site: SITE.website,
	integrations: [sitemap()],

	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
	fonts: SITE.fonts.map((name) => {
		return {
			name,
			cssVariable: `--font-${name.toLowerCase().replaceAll(" ", "-")}`,
			provider: fontProviders.google(),
			fallbacks: ["serif"],
			weights: [300, 400, 500, 600, 700],
			styles: ["normal", "italic"],
			subsets: name === "Gowun Batang" ? ["korean"] : undefined,
		};
	}),
});
