"use client";

import dynamic from "next/dynamic";

const PixelPal = dynamic(() => import("./components/PixelPal/PixelPal"), { ssr: false });

export default function Home() {
  return (
    <div>
      <PixelPal />
      <h1>Home</h1>
    </div>
  );
}
