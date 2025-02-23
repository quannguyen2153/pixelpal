"use client";
import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";

const DraggableButton: React.FC = () => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const buttonSize = 50;

  const handleDrag = (_: any, data: any) => {
    setIsDragging(true);
    setPosition({ x: data.x, y: data.y });
  };

  const handleStop = () => {
    setTimeout(() => setIsDragging(false), 100); // Small delay to prevent immediate click triggering
  };

  const moveToNearestCorner = () => {
    if (isDragging) return; // Prevent triggering when dragging
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const corners = [
      { x: 10, y: 10 }, // Top-left
      { x: windowWidth - buttonSize - 10, y: 10 }, // Top-right
      { x: 10, y: windowHeight - buttonSize - 10 }, // Bottom-left
      { x: windowWidth - buttonSize - 10, y: windowHeight - buttonSize - 10 }, // Bottom-right
    ];

    const getDistance = (p1: any, p2: any) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
    const nearestCorner = corners.reduce((prev, curr) =>
      getDistance(position, curr) < getDistance(position, prev) ? curr : prev
    );

    let startTime: number | null = null;
    const duration = 300; // Animation duration in ms

    const animateMove = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setPosition(prevPosition => ({
        x: prevPosition.x + (nearestCorner.x - prevPosition.x) * progress,
        y: prevPosition.y + (nearestCorner.y - prevPosition.y) * progress,
      }));
      if (progress < 1) {
        requestAnimationFrame(animateMove);
      }
    };
    requestAnimationFrame(animateMove);
  };

  return (
    <Draggable 
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>} 
      position={position} 
      onDrag={handleDrag} 
      onStop={handleStop}
    >
      <div ref={nodeRef} style={{ position: "fixed", zIndex: 1000 }}>
        <Button 
          icon={<MessageOutlined />} 
          onClick={moveToNearestCorner} 
          style={{ width: buttonSize, height: buttonSize }}
        />
      </div>
    </Draggable>
  );
};

export default DraggableButton;
