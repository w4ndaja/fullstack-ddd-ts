"use server";
import React from "react";
import "./globals.css";
import PublicPageLayout from "../views/public-layout/public-layouts";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return <PublicPageLayout children={children} />;
}
