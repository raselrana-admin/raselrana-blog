// Raw font variables. globals.css maps them to the --font-display /
// --font-body / --font-mono theme tokens that components use.
// Poppins is the brand typeface (headings and text); Plex Mono is kept for
// small labels, dates and tags.
import { IBM_Plex_Mono, Poppins } from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});
