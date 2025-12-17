'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/[username]/page"
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Routes that should NOT have the sidebar/navbar
  const noLayoutRoutes = ["/signin", "/signup","/profile","/"];

  const isNoLayout = noLayoutRoutes.some(route => pathname.startsWith(route));

  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {isNoLayout ? (
            // Render without sidebar
            children
          ) : (
            // Normal layout
            <AppSidebar>{children}</AppSidebar>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}

