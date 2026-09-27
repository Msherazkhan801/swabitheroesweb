import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "../context/DataContext";
import { AdminAuthProvider } from "../context/AdminAuthContext";

export const metadata: Metadata = {
  title: "Swabi Heroes | Emergency Blood Donation & SOS Network (صوابۍ وینه بخښونکي)",
  description: "Official blood donation network for Swabi district (Swabi, Topi, Razzar, Chota Lahor). Find donors and connect with BKMC, DHQ Swabi, and THQ emergency services.",
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png' }
    ]
  },
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-red-600 selection:text-white">
        <DataProvider>
          <AdminAuthProvider>
            {children}
          </AdminAuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
