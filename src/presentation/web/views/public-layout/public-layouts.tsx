import React from 'react'
// import wingHonda from "@web/assets/wing-honda.png";
// import Image from "next/image";
import Link from "next/link";
export default function PublicPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-gray-400">
        <div className="flex justify-center h-[64px] bg-gray-200">
          <div className="container items-center flex gap-10">
            {/* <Image alt="Wing Honda" src={wingHonda} width={50} height={(wingHonda.height * wingHonda.width) / 50} /> */}
            <div className="flex-1 flex gap-2 justify-end">
              {/* <Link className="border px-4 py-2 text-red-500" href={`/`}>
                Home
              </Link>
              <Link className="border px-4 py-2 text-red-500" href={`/about`}>
                About
              </Link> */}
              <Link className="border px-4 py-2 text-red-500" href={`/user`}>
                User
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col">{children}</div>
      </body>
    </html>
  );
}
