"use client";

import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { Flex, Button, Card } from "antd";
import { MessageOutlined } from "@ant-design/icons";

const PixelPal: React.FC = () => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [bubbleCurrentSize, setCurrentBubbleSize] = useState({
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const nodeRef = useRef<HTMLButtonElement>(null);
  const buttonSize = 50;
  const chatBubbleSize = { width: 250, height: 150 };
  const animationDuration = 300;

  const handleDrag = (_: any, data: any) => {
    setIsDragging(true);
    setPosition({ x: data.x, y: data.y });
  };

  const handleStop = () => {
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleClick = () => {
    if (isDragging) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const corners = [
      { x: 10, y: 10 },
      { x: windowWidth - buttonSize - 10, y: 10 },
      { x: 10, y: windowHeight - buttonSize - 10 },
      { x: windowWidth - buttonSize - 10, y: windowHeight - buttonSize - 10 },
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
          (isOpen ? 0 - prevSize.width : chatBubbleSize.width - prevSize.width) * progress,
        height:
          prevSize.height +
          (isOpen ? 0 - prevSize.height : chatBubbleSize.height - prevSize.height) * progress,
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
          <Card
            style={{
              position: "absolute",
              [isLeftSide ? "left" : "right"]: buttonSize + 10,
              [isTopSide ? "top" : "bottom"]: 0,
              width: bubbleCurrentSize.width,
              height: bubbleCurrentSize.height,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <p>Chat content goes here...</p>
          </Card>
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
