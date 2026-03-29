import type { FontStyle, FontWeight } from "satori";

async function loadGoogleFont(
	font: string,
	text: string,
	weight: FontWeight,
): Promise<ArrayBuffer> {
	const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`;

	const css = await (
		await fetch(API, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
			},
		})
	).text();

	const resource = css.match(
		/src: url\((.+?)\) format\('(opentype|truetype)'\)/,
	);

	if (!resource) throw new Error("Failed to download dynamic font");

	const res = await fetch(resource[1]);

	if (!res.ok) {
		throw new Error(`Failed to download dynamic font. Status: ${res.status}`);
	}

	return res.arrayBuffer();
}

async function loadGoogleFonts(text: string): Promise<
	Array<{
		name: string;
		data: ArrayBuffer;
		weight: FontWeight;
		style: FontStyle;
	}>
> {
	const fontName = "EB Garamond";
	const fontsConfig = [
		{
			name: fontName,
			font: fontName.replaceAll(" ", "+"),
			weight: 400 satisfies FontWeight,
			style: "normal" satisfies FontStyle,
		},
		{
			name: fontName,
			font: fontName.replaceAll(" ", "+"),
			weight: 700 satisfies FontWeight,
			style: "normal" satisfies FontStyle,
		},
	];

	const fonts = await Promise.all(
		fontsConfig.map(async ({ name, font, weight, style }) => {
			const data = await loadGoogleFont(font, text, weight as FontWeight);
			return { name, data, weight, style } as {
				name: string;
				data: ArrayBuffer;
				weight: FontWeight;
				style: FontStyle;
			};
		}),
	);

	return fonts;
}

export default loadGoogleFonts;
