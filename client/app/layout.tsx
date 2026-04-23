import type { Metadata } from "next";
import { Geist, Lexend } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ToastNotification from "@/features/shared/components/toast/ToastNotifications";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const lexend = Lexend({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
    title: "Los Porteños - FastFood",
    description: "Sitio de administracion de comida rapida.",
    icons: {
        icon: "/icon/favicon.ico",
        shortcut: "/icon/favicon.ico",
        apple: "/icon/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={cn("font-sans", geist.variable)}>
            <body className={`${lexend.className} antialiased text-white`}>
                <div className="relative min-h-screen w-full overflow-hidden">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url(/assets/background.png)",
                            backgroundColor: "#1a1d23",
                        }}
                    />
                    {/* Dark overlay for better contrast */}
                    <div className="absolute inset-0 bg-black/40" />

                    {children}
                    <ToastNotification />
                </div>
            </body>
        </html>
    );
}
