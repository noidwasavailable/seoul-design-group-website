const LUMA_BASE_URL = "https://luma.com";
const LUMA_API_BASE_URL = "https://api2.luma.com";
// const LUMA_CALENDAR_API_ID = "cal-AnCgGC7F1FV6z5Z"; // dev-korea's for testing
const LUMA_CALENDAR_API_ID = "cal-2e5leJwucrlzWzm"; // ours

const DISCORD_INVITE_URL = "https://discord.gg/z7cbnpKXU";

export const SITE = {
	website: "https://seouldesigngroup.pages.dev/",
	desc: "A group of cool designers based in Seoul",
	contactEmail: "spur-hazy-nutshell@duck.com",
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
	discord: {
		DISCORD_INVITE_URL,
	},
} as const;
