import { Cinzel, Michroma } from "next/font/google";
import "./globals.css";

// Closest free match to the logo's carved, flared lettering — used across the whole page.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

// Wide technical face matching the logo's "WHERE WARRIORS ARE MADE" tagline — small labels only.
const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Legion Fitness — Where Warriors Are Made",
  description:
    "Legion Fitness gym: strength training, coaching and conditioning built for people who want to train harder and live stronger.",
};

export const viewport = {
  themeColor: "#0b0b0c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${michroma.variable} h-full antialiased`}>
      <body className="is-loading min-h-full">{children}</body>
    </html>
  );
}
