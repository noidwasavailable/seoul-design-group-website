import satori from "satori";
import loadGoogleFonts from "../loadGoogleFont";

export default async () => {
  return satori(
    {
      type: "div",
      props: {
        children: "hello, world",
        style: { color: "black" },
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: await loadGoogleFonts("Hello world"),
    },
  );
};
