"use client";

import { Sour_Gummy } from "next/font/google";

const pageFont = Sour_Gummy({ subsets: ["latin"] });

import dynamic from "next/dynamic";
import { ConfigProvider } from "antd";

const PixelPal = dynamic(() => import("./components/PixelPal/PixelPal"), {
  ssr: false,
});
const HtmlRenderer = dynamic(
  () => import("./components/HtmlRenderer/HtmlRenderer"),
  { ssr: false }
);

const introductionPageHtml = `<body style="font-family: Arial, sans-serif; text-align: center; background-color: #fef8ff; padding: 50px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #ff69b4;">✨ Welcome to PixelPal! ✨</h1>
        <p style="font-size: 18px; color: #555;">Your friendly AI buddy that turns ideas into websites!</p>
        <img src="/pixelpal/happy.png" alt="PixelPal" style="width: 100px; height: 100px; margin: 20px 0;">
        <p style="font-size: 16px; color: #666;">Tell me your vision, and I'll bring it to life with code. Whether it's a personal blog, portfolio, or business site – PixelPal is here to help! 💡</p>
        <a href="#" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: white; background-color: #ff69b4; text-decoration: none; border-radius: 8px; box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);">Get Started</a>
    </div>
</body>`;

export default function Home() {
  return (
    <main className={pageFont.className}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: pageFont.style.fontFamily,
          },
        }}
      >
        <PixelPal />
        <HtmlRenderer htmlString={introductionPageHtml} />
      </ConfigProvider>
    </main>
  );
}
