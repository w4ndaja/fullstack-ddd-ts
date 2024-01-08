import React from "react";
export default function PublicPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col">{children}</body>
    </html>
  );
}
