import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import CodingTimer from "@/components/CodingTimer";
import QuickAddModal from "@/components/QuickAddModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DevTrack - Smart Study & Coding Tracker",
    description:
        "Track your daily study progress, coding problems solved, and notes.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <div className="flex min-h-screen">
                        <Sidebar />
                        {/* Main content area with sidebar offset */}
                        <main className="flex-1 md:ml-64 pt-28 md:pt-0">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {children}
                            </div>
                        </main>
                    </div>
                    <CodingTimer />
                    <QuickAddModal />
                </ThemeProvider>
            </body>
        </html>
    );
}
