import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skeledle - Anatomy Guessing Game",
  description: "Test your knowledge of human anatomy in this daily puzzle game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
