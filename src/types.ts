import { z } from "astro/zod";

const sdgEventTypeSchema = z.enum(["meetup"]);

const httpUrl = z.url({
	protocol: /^https?$/,
	hostname: z.regexes.domain,
});

export const sdgEventSchema = z.object({
	title: z.string(),
	type: sdgEventTypeSchema,
	date: z.coerce.date(),
	author: z.string(),
	authorLink: httpUrl.optional(),
	location: z.string().optional(),
	mapLink: httpUrl.optional(),
});

type SDGEventType = z.infer<typeof sdgEventTypeSchema>;

export type SDGEvent = z.infer<typeof sdgEventSchema>;
