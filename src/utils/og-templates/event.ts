import type { CollectionEntry } from "astro:content";
import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

const formatDate = (dateLike: string | number | Date) => {
	if (!dateLike) return "";
	const date = dateLike instanceof Date ? dateLike : new Date(dateLike);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleDateString("ko-KR");
};

export default async (event: CollectionEntry<"events">["data"]) => {
	const title = event.title ?? "Seoul Design Group Event";
	const type = event.type.toLocaleUpperCase();

	const leftMeta = formatDate(event.date);
	const rightMeta = event.location ? `Hosted by ${location}` : "";

	const fontText = `${title} ${type} ${leftMeta} ${rightMeta} ${SITE.title}`;

	return satori(
		{
			type: "div",
			props: {
				style: {
					width: "100%",
					height: "100%",
					display: "flex",
					position: "relative",
					backgroundColor: "#F9F8F6",
					color: "#111111",
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								position: "absolute",
								top: "0px",
								left: "0px",
								right: "0px",
								bottom: "0px",
								backgroundImage:
									"linear-gradient(135deg, #F9F8F6 0%, #F2F0EC 55%, #ECEAE6 100%)",
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
								bottom: "28px",
								border: "2px solid #111111",
								borderRadius: "18px",
								backgroundColor: "#FDFCFB",
								display: "flex",
								flexDirection: "column",
							},
							children: {
								type: "div",
								props: {
									style: {
										margin: "34px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										height: "100%",
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
													flexDirection: "column",
													gap: "14px",
													marginTop: "20px",
													marginBottom: "20px",
												},
												children: [
													{
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
												],
											},
										},
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													justifyContent: "space-between",
													alignItems: "flex-end",
													borderTop: "2px solid #111111",
													paddingTop: "16px",
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
