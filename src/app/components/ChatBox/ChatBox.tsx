import React, { useState } from "react";
import { Card, Input, Button, List, Flex, Skeleton } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

import styles from "./ChatBox.module.css";

export interface Message {
  id: number;
  text: string;
  role: "user" | "ai";
}

interface ChatBoxProps {
  title: string;
  isLoading: boolean;
  messages: Message[];
  style: React.CSSProperties;
  onSend: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  title,
  isLoading = false,
  messages = [],
  style,
  onSend,
}) => {
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      onSend?.(input);
      setInput("");
    }
  };

  return (
    <Card title={title} style={style}>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <>
          <List
            size="small"
            bordered
            dataSource={messages}
            renderItem={(item) => (
              <List.Item
                style={{
                  textAlign: item.role === "user" ? "right" : "left",
                  backgroundColor: item.role === "user" ? "#1890ff" : "#f0f0f0",
                  color: item.role === "user" ? "#fff" : "#000",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  margin: "5px 0",
                  alignSelf: item.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                }}
              >
                {item.text}
              </List.Item>
            )}
            style={{
              maxHeight: style.height
                ? parseInt(style.height as string, 10) - 100
                : 300,
              overflowY: "auto",
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
            }}
          />
          <Flex align="center">
            <Input.TextArea
              className={styles.noScrollbar}
              maxLength={100}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Say something..."
              style={{ width: "100%", height: 50, resize: "none" }}
              disabled={isLoading}
            />
            <Button
              type="primary"
              size="small"
              icon={<ArrowUpOutlined />}
              onClick={sendMessage}
              style={{ height: 50 }}
              disabled={isLoading}
            />
          </Flex>
        </>
      )}
    </Card>
  );
};

export default ChatBox;
