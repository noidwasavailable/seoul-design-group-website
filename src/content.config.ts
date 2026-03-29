import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const sdgEventTypeSchema = z.enum(["meetup"]);

const httpUrl = z.url({
	protocol: /^https?$/,
	hostname: z.regexes.domain,
});

export const sdgContributorSchema = z.object({
	name: z.string(),
	link: httpUrl.optional(),
});

export const sdgEventSchema = z.object({
	title: z.string(),
	type: sdgEventTypeSchema,
	date: z.coerce.date(),
	authors: z.array(reference("contributors")),
	photographers: z.array(reference("contributors")).optional(),
	location: z.string().optional(),
	mapLink: httpUrl.optional(),
});

export const EVENTS_PATH = "src/data/events";
export const CONTRIBUTORS_PATH = "src/data/contributors";

const contributors = defineCollection({
	loader: glob({ base: `./${CONTRIBUTORS_PATH}`, pattern: "**/*.json" }),
	schema: sdgContributorSchema,
});

const events = defineCollection({
	loader: glob({ base: `./${EVENTS_PATH}`, pattern: "**/[^_]*.md" }),
	schema: sdgEventSchema,
});

export const collections = { contributors, events };
