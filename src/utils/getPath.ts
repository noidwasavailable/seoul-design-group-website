import { EVENTS_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/events` in return value
 * @returns blog post path
 */
export function getPath(
	id: string,
	filePath: string | undefined,
	includeBase = true,
) {
	const pathSegments = filePath
		?.replace(EVENTS_PATH, "")
		.split("/")
		.filter((path) => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
		.filter((path) => !path.startsWith("_")) // exclude directories start with underscore "_"
		.slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
		.map((segment) => slugifyStr(segment)); // slugify each segment path

	const basePath = includeBase ? "/events" : "";

	// Making sure `id` does not contain the directory
	// and extract the slug from the last segment of the id
	const blogId = id.split("/");
	const lastIdSegment = blogId.length > 0 ? blogId.at(-1) : id;
	const slug = slugifyStr(lastIdSegment || "");

	// If the file is index.md or the slug matches the parent directory,
	// don't append the slug to pathSegments (which already contains the parent directory)
	if (
		pathSegments &&
		pathSegments.length > 0 &&
		(slug === "index" || pathSegments.at(-1) === slug)
	) {
		return [basePath, ...pathSegments].join("/");
	}

	// If not inside a sub-dir, return the base path + slug
	if (!pathSegments || pathSegments.length < 1) {
		return [basePath, slug].join("/");
	}

	return [basePath, ...pathSegments, slug].join("/");
}
