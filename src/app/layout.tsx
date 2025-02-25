import type { Metadata } from "next";
import "./globals.css";
import AppBar from "@/Components/Appbar";
import Footer from "@/Components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "./Context";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <head>
            <link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
          </head>
          <body className={``}>
            <AppBar />
            {children}
            <Footer />
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
