"use client";

import { Sour_Gummy } from "next/font/google";

import dynamic from "next/dynamic";
import { ConfigProvider } from "antd";
import { useState } from "react";

import { Message } from "./api/generate/route";

const PixelPal = dynamic(() => import("./components/PixelPal/PixelPal"), {
  ssr: false,
});
const HtmlRenderer = dynamic(
  () => import("./components/HtmlRenderer/HtmlRenderer"),
  { ssr: false }
);

const pageFont = Sour_Gummy({ subsets: ["latin"] });

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [htmlString, setHtmlString] = useState(introductionPageHtml);

  const extractHtmlContent = (content: string): string[] => {
    const regex = /```html([\s\S]*?)```/g; // Matches content between ```html and ```
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1].trim()); // Extract HTML content and trim whitespace
    }

    return matches;
  };

  const onSend = async (message: string) => {
    const newMessage: Message = { role: "user", content: message };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }

      const htmlContent = extractHtmlContent(
        data.messages[data.messages.length - 1].content
      ).at(-1);

      console.log(htmlContent);
      if (htmlContent) {
        setHtmlString(htmlContent);
      }
    } catch (error) {
      console.error("Error fetching assistant response:", error);
    }
  };

  return (
    <main className={pageFont.className}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: pageFont.style.fontFamily,
          },
        }}
      >
        <PixelPal messages={messages} onSend={onSend} />
        <HtmlRenderer htmlString={htmlString} />
      </ConfigProvider>
    </main>
  );
}
