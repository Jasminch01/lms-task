import type { Metadata } from "next";
import "./globals.css";
import AppBar from "@/Components/Appbar";
import Footer from "@/Components/Footer";


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
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
      </head>
      <body
        className={``}
      >
        <AppBar />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
