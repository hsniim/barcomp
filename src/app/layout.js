import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
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
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}