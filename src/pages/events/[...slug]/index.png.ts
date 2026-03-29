import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { generateOgImageForEvent } from "@/utils/generateOgImages";
import { getPath } from "@/utils/getPath";

export async function getStaticPaths() {
	const posts = await getCollection("events");

	return posts.map((post) => ({
		params: { slug: getPath(post.id, post.filePath, false) },
		props: post,
	}));
}

export const GET: APIRoute = async ({ props }) => {
	const buffer = await generateOgImageForEvent(
		props as CollectionEntry<"events">["data"],
	);
	return new Response(new Uint8Array(buffer), {
		headers: { "Content-Type": "image/png" },
	});
};
