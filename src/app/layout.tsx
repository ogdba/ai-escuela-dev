import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/content/es";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.description,
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: SITE.name,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50 font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
