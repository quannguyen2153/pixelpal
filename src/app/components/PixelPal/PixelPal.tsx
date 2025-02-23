"use client";

import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { Flex, Button, Card } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatBox, { Message } from "../ChatBox/ChatBox";

const PixelPal: React.FC = () => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [bubbleCurrentSize, setCurrentBubbleSize] = useState({
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const nodeRef = useRef<HTMLButtonElement>(null);
  const buttonSize = 50;
  const chatBubbleSize = {
    width: window.innerWidth / 2 - 2 * buttonSize,
    height: window.innerHeight - 20,
  };
  const animationDuration = 300;

  const handleDrag = (_: any, data: any) => {
    setIsDragging(true);
    setPosition({ x: data.x, y: data.y });

    let startTime: number | null = null;
    if (isOpen) {
      const animateMove = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / animationDuration,
          1
        );

        setCurrentBubbleSize((prevSize) => ({
          width:
            prevSize.width +
            (isOpen
              ? 0 - prevSize.width
              : chatBubbleSize.width - prevSize.width) *
              progress,
          height:
            prevSize.height +
            (isOpen
              ? 0 - prevSize.height
              : chatBubbleSize.height - prevSize.height) *
              progress,
        }));

        if (progress < 1) {
          requestAnimationFrame(animateMove);
        } else {
          setIsOpen(false);
        }
      };
      requestAnimationFrame(animateMove);
    }
  };

  const handleStop = () => {
    setTimeout(() => setIsDragging(false), 100); // Small delay to prevent immediate click triggering
  };

  const handleClick = () => {
    if (isDragging) return; // Prevent triggering when dragging

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const corners = [
      { x: 10, y: 10 }, // Top-left
      { x: windowWidth - buttonSize - 10, y: 10 }, // Top-right
      { x: 10, y: windowHeight - buttonSize - 10 }, // Bottom-left
      { x: windowWidth - buttonSize - 10, y: windowHeight - buttonSize - 10 }, // Bottom-right
    ];

    const getDistance = (p1: any, p2: any) =>
      Math.hypot(p1.x - p2.x, p1.y - p2.y);
    const nearestCorner = corners.reduce((prev, curr) =>
      getDistance(position, curr) < getDistance(position, prev) ? curr : prev
    );

    if (!isOpen) {
      setIsOpen(true);
    }

    let startTime: number | null = null;

    const animateMove = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / animationDuration, 1);

      setPosition((prevPosition) => ({
        x: prevPosition.x + (nearestCorner.x - prevPosition.x) * progress,
        y: prevPosition.y + (nearestCorner.y - prevPosition.y) * progress,
      }));

      setCurrentBubbleSize((prevSize) => ({
        width:
          prevSize.width +
          (isOpen
            ? 0 - prevSize.width
            : chatBubbleSize.width - prevSize.width) *
            progress,
        height:
          prevSize.height +
          (isOpen
            ? 0 - prevSize.height
            : chatBubbleSize.height - prevSize.height) *
            progress,
      }));

      if (progress < 1) {
        requestAnimationFrame(animateMove);
      } else {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    requestAnimationFrame(animateMove);
  };

  const handleSend = (message: string) => {
    const newMessage: Message = { id: Date.now(), text: message, role: "user" };
    setMessages([
      ...messages,
      newMessage,
      { id: Date.now() + 1, text: "AI response", role: "ai" },
    ]);
  };

  const isLeftSide = position.x < window.innerWidth / 2;
  const isTopSide = position.y < window.innerHeight / 2;

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLButtonElement>}
      position={position}
      onDrag={handleDrag}
      onStop={handleStop}
    >
      <Flex ref={nodeRef} style={{ position: "fixed", zIndex: 1000 }}>
        {isOpen && (
          <ChatBox
            title="PixelPal"
            messages={messages}
            style={{
              position: "absolute",
              [isTopSide ? "top" : "bottom"]: 0,
              [isLeftSide ? "left" : "right"]: buttonSize + 10,
              width: bubbleCurrentSize.width,
              height: bubbleCurrentSize.height,
              transition: "opacity 0.3s ease-in-out",
            }}
            onSend={handleSend}
          />
        )}
        <Button
          icon={<MessageOutlined />}
          onClick={handleClick}
          style={{ width: buttonSize, height: buttonSize }}
        />
      </Flex>
    </Draggable>
  );
};

export default PixelPal;
