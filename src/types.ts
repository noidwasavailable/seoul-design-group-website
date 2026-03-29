import { z } from "astro/zod";

const sdgEventTypeSchema = z.enum(["meetup"]);

const httpUrl = z.url({
	protocol: /^https?$/,
	hostname: z.regexes.domain,
});

const sdgContributorSchema = z.object({
	name: z.string(),
	link: httpUrl.optional(),
});

export const sdgEventSchema = z.object({
	title: z.string(),
	type: sdgEventTypeSchema,
	date: z.coerce.date(),
	authors: z.array(sdgContributorSchema),
	photographers: z.array(sdgContributorSchema).optional(),
	location: z.string().optional(),
	mapLink: httpUrl.optional(),
});

export type SDGEventType = z.infer<typeof sdgEventTypeSchema>;

export type SDGContributor = z.infer<typeof sdgContributorSchema>;

export type SDGEvent = z.infer<typeof sdgEventSchema>;
