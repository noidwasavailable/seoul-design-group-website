import { Resvg } from "@resvg/resvg-js";
import eventOgImage from "./og-templates/event";

const svgBufferToPngBuffer = (svg: string) => {
  const resvg = new Resvg(svg);
  return resvg.render().asPng();
};

export const generateOgImagesForEvent = async () => {
  const svg = await eventOgImage();
  return svgBufferToPngBuffer(svg);
};
