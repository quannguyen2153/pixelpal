"use client";

import React, { useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Flex, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatBox, { Message } from "../ChatBox/ChatBox";

const PixelPal: React.FC = () => {
  const buttonSize = 50;
  const chatBubbleSize = {
    width: window.innerWidth / 2 - 2 * buttonSize,
    height: window.innerHeight - 20,
  };
  const animationDuration = 500;

  const [position, setPosition] = useState({
    x: window.innerWidth - buttonSize - 10,
    y: window.innerHeight - buttonSize - 10,
  });
  const [bubbleCurrentSize, setCurrentBubbleSize] = useState({
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const nodeRef = useRef<HTMLButtonElement>(null);

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    setIsDragging(true);
    setPosition({ x: data.x, y: data.y });

    setIsAnimating(true);

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
          setIsAnimating(false);
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

    const corners = [
      { x: 10, y: 10 }, // Top-left
      { x: window.innerWidth - buttonSize - 10, y: 10 }, // Top-right
      { x: 10, y: window.innerHeight - buttonSize - 10 }, // Bottom-left
      {
        x: window.innerWidth - buttonSize - 10,
        y: window.innerHeight - buttonSize - 10,
      }, // Bottom-right
    ];

    const getDistance = (
      p1: { x: number; y: number },
      p2: { x: number; y: number }
    ) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
    const nearestCorner = corners.reduce((prev, curr) =>
      getDistance(position, curr) < getDistance(position, prev) ? curr : prev
    );

    if (!isOpen) {
      setIsOpen(true);
    }

    setIsAnimating(true);

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
        setIsAnimating(false);
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
            isLoading={isAnimating}
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
          onClick={handleClick}
          style={{ width: buttonSize, height: buttonSize, padding: 0 }}
        >
          <img
            src="/pixelpal/joy.png"
            alt="PixelPal"
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
          />
        </Button>
      </Flex>
    </Draggable>
  );
};

export default PixelPal;
