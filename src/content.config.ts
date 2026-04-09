import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const sdgEventTypeSchema = z.enum(["meetup"]);

const httpUrl = z.url({
	protocol: /^https?$/,
	hostname: z.regexes.domain,
});

export const EVENTS_PATH = "src/data/events";
export const CONTRIBUTORS_PATH = "src/data/contributors";

const contributors = defineCollection({
	loader: glob({ base: `./${CONTRIBUTORS_PATH}`, pattern: "**/*.json" }),
	schema: z.object({
		name: z.string(),
		link: httpUrl.optional(),
	}),
});

const events = defineCollection({
	loader: glob({ base: `./${EVENTS_PATH}`, pattern: "**/[^_]*.md" }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			cover: image().optional(),
			type: sdgEventTypeSchema,
			date: z.coerce.date(),
			authors: z.array(reference("contributors")),
			photographers: z.array(reference("contributors")).optional(),
			location: z.string().optional(),
			mapLink: httpUrl.optional(),
			lumaLink: httpUrl.optional(),
		}),
});

export const collections = { contributors, events };
