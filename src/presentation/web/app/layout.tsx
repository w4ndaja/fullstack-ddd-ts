// "use server";
import React from "react";
import "./globals.css";
import PublicPageLayout from "./_components/public-layout/public-layouts";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <PublicPageLayout children={children} />;
}
