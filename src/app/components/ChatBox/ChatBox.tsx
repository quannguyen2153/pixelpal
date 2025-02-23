import React, { useState } from "react";
import { Card, Input, Button, List, Flex, Skeleton } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

import { Message } from "@/app/api/generate/route";
import styles from "./ChatBox.module.css";

interface ChatBoxProps {
  title: string;
  isAnimating: boolean;
  isLoading: boolean;
  messages: Message[];
  style: React.CSSProperties;
  onSend: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  title,
  isAnimating,
  isLoading,
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
      {isAnimating ? (
        <Skeleton active />
      ) : (
        <>
          <List
            className={styles.noScrollbar}
            size="small"
            bordered
            dataSource={
              isLoading
                ? [...messages, { role: "assistant", content: "" }]
                : messages
            }
            renderItem={(item) => (
              <List.Item
                style={{
                  display: "flex",
                  justifyContent:
                    item.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    textAlign: "left",
                    backgroundColor:
                      item.role === "user" ? "#1890ff" : "#f0f0f0",
                    color: item.role === "user" ? "#fff" : "#000",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    margin: "5px 0",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap", // Allows multiline text
                  }}
                >
                  {isLoading && item.content === "" ? (
                    <Skeleton
                      active
                      style={{
                        width: style.width
                          ? (parseInt(style.width as string, 10) / 3) * 2
                          : 300,
                      }}
                    />
                  ) : (
                    item.content
                  )}
                </div>
              </List.Item>
            )}
            style={{
              height: style.height
                ? parseInt(style.height as string, 10) - 175
                : 500,
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
              style={{ height: 50, resize: "none" }}
              disabled={isAnimating}
            />
            <Button
              type="primary"
              size="small"
              icon={<ArrowUpOutlined />}
              onClick={sendMessage}
              style={{ width: 50, height: 50 }}
              disabled={isAnimating}
            />
          </Flex>
        </>
      )}
    </Card>
  );
};

export default ChatBox;
