import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  axes: ["wdth"],
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
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="is-loading min-h-full">{children}</body>
    </html>
  );
}
