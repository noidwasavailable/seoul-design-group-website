import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { sdgEventSchema } from "./types";

export const EVENTS_PATH = "src/data/events";

const events = defineCollection({
	loader: glob({ base: `./${EVENTS_PATH}`, pattern: "**/[^_]*.md" }),
	schema: sdgEventSchema,
});

export const collections = { events };
