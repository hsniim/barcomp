import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Barcomp",
  description: "Leading provider of web development, mobile apps, and digital transformation services",
  icons: {
    icon: [
      {
        url: "/barcomp_favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        url: "/barcomp_favicon.ico",
        type: "image/x-icon",
      },
      {
      url: "/barcomp_favicon.png",
      sizes: "32x32",
      type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}