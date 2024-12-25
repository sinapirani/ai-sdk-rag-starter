import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
const vazirmatn = Vazirmatn({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: "چت بات سکو",
  description: "سکو LLM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${vazirmatn.className}`}>
        {children}
        <Toaster/>
        </body>
    </html>
  );
}
