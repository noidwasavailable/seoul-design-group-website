import type { CollectionEntry } from "astro:content";
import satori from "satori";
import backgroundSvgRaw from "@/assets/background.svg?raw";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

const backgroundSvgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(backgroundSvgRaw)}`;

const formatDate = (dateLike: string | number | Date) => {
	if (!dateLike) return "";
	const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleDateString("ko-KR");
};

const toAbsoluteAssetUrl = (src: string) => {
	if (/^https?:\/\//i.test(src)) return src;
	const base = SITE.website.replace(/\/+$/, "");
	const path = src.startsWith("/") ? src : `/${src}`;
	return `${base}${path}`;
};

export default async (event: CollectionEntry<"events">["data"]) => {
	const title = event.title ?? "Seoul Design Group Event";
	const type = event.type.toLocaleUpperCase();

	const leftMeta = formatDate(event.date);
	const rightMeta = event.location ? `Hosted by ${event.location}` : "";

	const fontText = `${title} ${type} ${leftMeta} ${rightMeta} ${SITE.title}`;

	const image = event.cover?.src
		? toAbsoluteAssetUrl(event.cover.src)
		: undefined;
	return satori(
		{
			type: "div",
			props: {
				style: {
					width: "100%",
					height: "100%",
					display: "flex",
					position: "relative",
					color: "#111111",
					backgroundColor: "#FDFCFB",
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								width: "100%",
								height: "100%",
								display: "flex",
								backgroundColor: "#FDFCFB",
								backgroundImage: `url("${backgroundSvgDataUrl}")`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								backgroundRepeat: "no-repeat",
								filter: "blur(100px)",
							},
						},
					},
					{
						type: "div",
						props: {
							style: {
								position: "absolute",
								top: "28px",
								left: "28px",
								right: "28px",
								bottom: "56px",
								display: "flex",
								flexDirection: "column",
							},
							children: [
								{
									type: "div",
									props: {
										style: {
											border: "2px solid #111111",
											backgroundColor: "#FDFCFB",
											display: "flex",
											flexDirection: "column",
										},
										children: {
											type: "div",
											props: {
												style: {
													margin: "28px",
													display: "flex",
													flexDirection: "column",
													justifyContent: "space-between",
													height: "85%",
												},
												children: [
													{
														type: "div",
														props: {
															style: {
																display: "flex",
																justifyContent: "space-between",
																alignItems: "center",
															},
															children: [
																{
																	type: "span",
																	props: {
																		style: {
																			border: "2px solid #111111",
																			borderRadius: "999px",
																			fontSize: "24px",
																			fontWeight: 700,
																			paddingLeft: "16px",
																			paddingRight: "16px",
																			paddingTop: "8px",
																			paddingBottom: "8px",
																		},
																		children: type,
																	},
																},
																{
																	type: "span",
																	props: {
																		style: {
																			fontSize: "24px",
																			fontWeight: 700,
																		},
																		children: SITE.title,
																	},
																},
															],
														},
													},
													{
														type: "div",
														props: {
															style: {
																display: "flex",
																gap: "0px",
																marginTop: "20px",
																marginBottom: "20px",
																flex: 1,
																minHeight: "0px",
																width: "100%",
																justifyContent: "space-between",
															},
															children: [
																{
																	type: "div",
																	props: {
																		style: {
																			width: "64%",
																			display: "flex",
																			alignItems: "center",
																		},
																		children: {
																			type: "h1",
																			props: {
																				style: {
																					fontSize: "78px",
																					lineHeight: 1.05,
																					fontWeight: 700,
																					margin: "0px",
																					letterSpacing: "-1px",
																					lineClamp: 3,
																				},
																				children: title,
																			},
																		},
																	},
																},
																{
																	type: "div",
																	props: {
																		style: {
																			width: "36%",
																			border: "2px solid #111111",
																			overflow: "hidden",
																			backgroundColor: "#ECEAE6",
																			display: "flex",
																			alignItems: "center",
																			justifyContent: "center",
																		},
																		children: image
																			? {
																					type: "img",
																					props: {
																						src: image,
																						alt: `${title} cover`,
																						style: {
																							width: "100%",
																							height: "100%",
																							objectFit: "cover",
																						},
																					},
																				}
																			: null,
																	},
																},
															],
														},
													},
												],
											},
										},
									},
								},
								{
									type: "div",
									props: {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-end",
											marginBottom: "4px",
											paddingTop: "12px",
											gap: "16px",
										},
										children: [
											{
												type: "p",
												props: {
													style: {
														margin: "0px",
														fontSize: "30px",
														fontWeight: 400,
														maxWidth: "63%",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap",
														overflow: "hidden",
													},
													children: leftMeta,
												},
											},
											{
												type: "p",
												props: {
													style: {
														margin: "0px",
														fontSize: "30px",
														fontWeight: 700,
														maxWidth: "37%",
														textAlign: "right",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap",
														overflow: "hidden",
													},
													children: rightMeta,
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			embedFont: true,
			fonts: await loadGoogleFonts(fontText),
		},
	);
};
