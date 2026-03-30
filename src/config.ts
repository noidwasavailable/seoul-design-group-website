const LUMA_BASE_URL = "https://luma.com";
const LUMA_API_BASE_URL = "https://api2.luma.com";
// const LUMA_CALENDAR_API_ID = "cal-AnCgGC7F1FV6z5Z";
const LUMA_CALENDAR_API_ID = "cal-2e5leJwucrlzWzm";

export const SITE = {
	website: "https://seouldesigngroup.pages.dev/",
	desc: "A group of cool designers based in Seoul",
	title: "Seoul Design Group",
	postPerPage: 10,
	timezone: "Asia/Seoul",
	fonts: ["EB Garamond", "Gowun Batang"],
	luma: {
		LUMA_BASE_URL,
		LUMA_API_BASE_URL,
		LUMA_CALENDAR_API_ID,
		LUMA_CALENDAR_URL: `${LUMA_BASE_URL}/calendar/${LUMA_CALENDAR_API_ID}`,
		MAX_UPCOMING_EVENT_COUNT: 6,
	},
} as const;
