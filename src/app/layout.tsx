import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Journt | Minimalist Travel Planner",
  description: "Plan your perfect trip in seconds with Journt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
          <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
            <span className="font-bold text-xl tracking-tight text-primary">Journt</span>
            <ul className="flex gap-6 text-base font-medium">
              <li><a href="/" className="hover:text-primary transition">Home</a></li>
              <li><a href="/blog" className="hover:text-primary transition">Blog</a></li>
              <li><a href="/store" className="hover:text-primary transition">Store</a></li>
            </ul>
          </nav>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
        {/* Footer */}
        <footer className="w-full border-t border-gray-200 bg-white/80 py-4 text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()} Journt. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
