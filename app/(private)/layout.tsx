import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./../globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className="font-sans antialiased" suppressHydrationWarning>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
                    <LanguageProvider>
                        {children}
                        <Toaster position="top-right" richColors closeButton />
                        <Analytics />
                    </LanguageProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
