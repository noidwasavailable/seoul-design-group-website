import { SITE } from "@/config";

type LumaApiUser = {
	api_id: string;
	avatar_url: URL;
	bio_short: string;
	first_name: string;
	last_name: string;
	instagram_handle: string | null;
	is_verified: boolean;
	last_online_at: string | null;
	linkedin_handle: string | null;
	name: string;
	tiktok_handle: string | null;
	timezone: string;
	twitter_handle: string | null;
	username: string | null;
	website: URL | null;
	youtube_handle: string | null;
};

type LumaApiLocalizedAddress = {
	short_address?: string | null;
	full_address?: string | null;
};

type LumaApiGeoAddressInfo = {
	type?: "google" | string | null;
	region?: string;
	address?: string | null;
	country: string;
	place_id?: string | null;
	short_address?: string | null;
	full_address?: string | null;
	localized?: {
		ko?: LumaApiLocalizedAddress | null;
	} | null;
	description?: string | null;
};

type LumaApiEvent = {
	api_id: string;
	calendar_api_id: string;
	cover_url?: string | null;
	end_at?: string | null;
	name?: string | null;
	start_at?: string | null;
	timezone?: string | null;
	url?: string | null;
	geo_address_info?: LumaApiGeoAddressInfo | null;
	waitlist_enabled?: boolean | null;
	waitlist_status?: "active" | "inactive" | null;
};

type LumaApiTicketInfo = {
	price?: number | null;
	is_free: boolean;
	max_price?: number | null;
	is_sold_out: boolean;
	spots_remaining: number;
	is_near_capacity: boolean;
	require_approval: boolean;
	currency_info?: string | null;
};

type LumaApiEntry = {
	api_id?: string | null;
	event?: LumaApiEvent | null;
	start_at?: string | null;
	hosts?: LumaApiUser[] | null;
	guest_count?: number | null;
	ticket_count?: number | null;
	ticket_info?: LumaApiTicketInfo | null;
	featured_guests?: LumaApiUser[] | null;
	waitlist_active?: boolean | null;
	calendar_api_id?: string | null;
};

type LumaApiResponse = {
	entries?: LumaApiEntry[] | null;
	has_more?: boolean;
};

export type LumaEvent = {
	apiId: string;
	calendarApiId: string;
	name: string;
	startAt: string;
	endAt: string | null;
	timezone: string | null;
	url: string;
	coverUrl: string | null;
	locationText: string | null;
	isFree: boolean | null;
	isSoldOut: boolean | null;
	waitlistActive: boolean | null;
	guestCount: number | null;
	googleMapsUrl: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const toStringOrNull = (value: unknown): string | null =>
	typeof value === "string" && value.trim().length > 0 ? value : null;

const toBooleanOrNull = (value: unknown): boolean | null =>
	typeof value === "boolean" ? value : null;

const toNumberOrNull = (value: unknown): number | null =>
	typeof value === "number" && Number.isFinite(value) ? value : null;

const getLocationText = (
	geo: LumaApiGeoAddressInfo | null | undefined,
): string | null => {
	if (!geo) return null;

	return (
		geo.localized?.ko?.short_address ??
		geo.short_address ??
		geo.localized?.ko?.full_address ??
		geo.full_address ??
		geo.address ??
		null
	);
};

const buildGoogleMapsUrl = (
	queryStr: string | null | undefined,
	placeId: string | null | undefined,
) => {
	// https://www.google.com/maps/search/?api=1&query=MARU180&query_place_id=ChIJ5ViS3VShfDURsAR63pWAiOA
	if (!queryStr || !placeId) return null;

	const baseUrl = "https://www.google.com/maps/search/";
	const url = new URL(baseUrl);
	url.searchParams.set("api", "1");
	url.searchParams.set("query", queryStr);
	url.searchParams.set("query_place_id", placeId);
	return url.toString();
};

const buildEventUrl = (eventUrl: string): string => {
	const trimmed = eventUrl.trim();
	const withoutDomain = trimmed.replace(/^https?:\/\/(www\.)?lu\.ma\//i, "");
	const normalizedPath = withoutDomain.replace(/^\/+/, "");
	return `${SITE.luma.LUMA_API_BASE_URL}/${normalizedPath}`;
};

const normalizeEntry = (entry: LumaApiEntry): LumaEvent | null => {
	const event = entry.event;
	if (!event) return null;

	const apiId = toStringOrNull(event.api_id);
	const calendarApiId = toStringOrNull(event.calendar_api_id);
	const name = toStringOrNull(event.name);
	const startAt = toStringOrNull(event.start_at);
	const eventUrl = toStringOrNull(event.url);
	const waitlistActive = toBooleanOrNull(entry.waitlist_active);

	if (!apiId || !name || !startAt || !eventUrl || !calendarApiId) {
		return null;
	}

	return {
		apiId,
		calendarApiId,
		name,
		startAt,
		waitlistActive,
		endAt: toStringOrNull(event.end_at),
		timezone: toStringOrNull(event.timezone),
		url: buildEventUrl(eventUrl),
		coverUrl: toStringOrNull(event.cover_url),
		locationText: getLocationText(event.geo_address_info),
		isFree: toBooleanOrNull(entry.ticket_info?.is_free),
		isSoldOut: toBooleanOrNull(entry.ticket_info?.is_sold_out),
		guestCount: toNumberOrNull(entry.guest_count),
		googleMapsUrl: buildGoogleMapsUrl(
			event.geo_address_info?.address,
			event.geo_address_info?.place_id,
		),
	};
};

const isLumaApiResponse = (value: unknown): value is LumaApiResponse => {
	return isRecord(value) && Array.isArray(value.entries);
};

export async function getLumaUpcomingEvents(
	limit = SITE.luma.MAX_UPCOMING_EVENT_COUNT,
): Promise<LumaEvent[]> {
	if (!SITE.luma.LUMA_CALENDAR_API_ID) return [];

	const endpoint = new URL("/calendar/get-items", SITE.luma.LUMA_API_BASE_URL);
	endpoint.searchParams.set("calendar_api_id", SITE.luma.LUMA_CALENDAR_API_ID);
	endpoint.searchParams.set("pagination_limit", String(limit));
	endpoint.searchParams.set("period", "future");

	try {
		const response = await fetch(endpoint.toString(), {
			headers: { Accept: "application/json" },
		});

		if (!response.ok) return [];

		const payload: LumaApiResponse = await response.json();
		if (!isLumaApiResponse(payload) || !payload.entries) return [];

		return payload.entries
			.map(normalizeEntry)
			.filter((event): event is LumaEvent => event !== null)
			.sort((a, b) => {
				const aTs = Date.parse(a.startAt);
				const bTs = Date.parse(b.startAt);
				if (Number.isNaN(aTs) && Number.isNaN(bTs)) return 0;
				if (Number.isNaN(aTs)) return 1;
				if (Number.isNaN(bTs)) return -1;
				return aTs - bTs;
			});
	} catch {
		return [];
	}
}
