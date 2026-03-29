import type { CollectionEntry } from "astro:content";
import { Resvg } from "@resvg/resvg-js";
import eventOgImage from "./og-templates/event";

const svgBufferToPngBuffer = (svg: string) => {
	const resvg = new Resvg(svg);
	return resvg.render().asPng();
};

export const generateOgImageForEvent = async (
	event: CollectionEntry<"events">["data"],
) => {
	const svg = await eventOgImage(event);
	return svgBufferToPngBuffer(svg);
};
