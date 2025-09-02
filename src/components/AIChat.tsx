import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Card,
  Avatar,
  Typography,
  Space,
  Dropdown,
  message as antdMessage,
  Spin,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  CopyOutlined,
  EditOutlined,
  ReloadOutlined,
  MoreOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { AIService } from "../services/ai.service";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  displayedText?: string;
  animate?: boolean;
  isEditing?: boolean;
}

interface AIChatProps {
  result: string;
  category: "food" | "place";
}

const AIChat: React.FC<AIChatProps> = ({ result, category }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingText, setEditingText] = useState("");
  const [prevResult, setPrevResult] = useState<string>("");

  const suggestedQuestions = AIService.getContextualPrompts(result, category);

  // Clear messages and AI memory when result changes (new roll)
  useEffect(() => {
    if (result && result !== prevResult) {
      setMessages([]);
      setIsExpanded(false);
      AIService.onNewRoll(result, category);
      setPrevResult(result);
    }
  }, [result, category, prevResult]);

  const addMessage = (text: string, sender: "user" | "ai", animate: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      displayedText: sender === "ai" && animate ? "" : text,
      animate,
      isEditing: false,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Typing effect
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.sender === "ai" &&
      lastMessage.animate &&
      lastMessage.displayedText !== lastMessage.text
    ) {
      const timer = setInterval(() => {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const message = updatedMessages[updatedMessages.length - 1];
          if (message.displayedText!.length < message.text.length) {
            message.displayedText = message.text.slice(0, message.displayedText!.length + 1);
          } else {
            clearInterval(timer);
          }
          return updatedMessages;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    addMessage(message, "user", false);
    setInputText("");
    setIsLoading(true);

    const context = `User mendapat hasil random: ${result} (kategori: ${
      category === "food" ? "makanan" : "tempat"
    }) di area Bekasi/Bintaro.`;

    try {
      const { content, animate } = await AIService.askAI(message, context, result, category);
      addMessage(content, "ai", animate);
    } catch (error) {
      addMessage("Maaf, terjadi kesalahan. Coba lagi ya!", "ai", false);
    }

    setIsLoading(false);
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    antdMessage.success("Pesan berhasil disalin!");
  };

  const handleEditMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isEditing: true } : msg))
    );

    const message = messages.find((m) => m.id === messageId);
    if (message) {
      setEditingText(message.text);
    }
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editingText.trim()) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, text: editingText, isEditing: false } : msg
      )
    );

    // If user message was edited, regenerate AI response
    const editedMessage = messages.find((m) => m.id === messageId);
    if (editedMessage?.sender === "user") {
      handleSendMessage(editingText);
    }

    setEditingText("");
  };

  const handleCancelEdit = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isEditing: false } : msg))
    );
    setEditingText("");
  };

  const handleRegenerateResponse = async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find((m) => m.sender === "user");
    if (!lastUserMessage) return;

    // Remove last AI response
    setMessages((prev) => prev.filter((_, index) => index !== prev.length - 1));
    setIsLoading(true);

    const context = `User mendapat hasil random: ${result} (kategori: ${
      category === "food" ? "makanan" : "tempat"
    }) di area Bekasi/Bintaro.`;

    try {
      const { content, animate } = await AIService.askAI(
        lastUserMessage.text,
        context,
        result,
        category
      );
      addMessage(content, "ai", animate);
    } catch (error) {
      addMessage("Maaf, terjadi kesalahan. Coba lagi ya!", "ai", false);
    }

    setIsLoading(false);
  };

  const getMessageActions = (message: Message) => {
    const items = [
      {
        key: "copy",
        icon: <CopyOutlined />,
        label: "Copy",
        onClick: () => handleCopyMessage(message.text),
      },
    ];

    if (message.sender === "user") {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => handleEditMessage(message.id),
      });
    }

    if (message.sender === "ai" && messages[messages.length - 1]?.id === message.id) {
      items.push({
        key: "regenerate",
        icon: <ReloadOutlined />,
        label: "Regenerate",
        onClick: handleRegenerateResponse,
      });
    }

    return items;
  };

  if (!result) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <Button
        type="primary"
        size="large"
        block
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          height: 48,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <Space>
          <RobotOutlined />
          {isExpanded ? "Tutup AI Chat" : `Tanya AI tentang ${result}`}
          <MessageOutlined />
        </Space>
      </Button>

      {isExpanded && (
        <Card
          style={{
            marginTop: 12,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "16px 20px",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <Space>
              <Avatar
                icon={<RobotOutlined />}
                style={{ backgroundColor: "#fff", color: "#667eea" }}
              />
              <div>
                <Text strong style={{ color: "#fff", fontSize: 16 }}>
                  dnAI Assistant
                </Text>
                <div>
                  <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                    ✨ Siap membantu dengan {result}
                  </Text>
                </div>
              </div>
            </Space>
          </div>

          {/* Suggested Questions */}
          {messages.length === 0 && (
            <div style={{ padding: 16, background: "#f8f9fa" }}>
              <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: "block" }}>
                💡 Pertanyaan yang bisa kamu tanya:
              </Text>
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <Button
                    key={index}
                    type="dashed"
                    size="small"
                    block
                    onClick={() => handleSendMessage(question)}
                    style={{ textAlign: "left", height: "auto", padding: "8px 12px" }}
                  >
                    <Text style={{ fontSize: 12 }}>{question}</Text>
                  </Button>
                ))}
              </Space>
            </div>
          )}

          {/* Messages */}
          <div
            style={{
              maxHeight: 320,
              overflowY: "auto",
              padding: "16px 20px",
              minHeight: messages.length === 0 ? 0 : 200,
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: "flex",
                    justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  {message.sender === "ai" && (
                    <Avatar
                      icon={<RobotOutlined />}
                      size={24}
                      style={{ backgroundColor: "#667eea", flexShrink: 0 }}
                    />
                  )}

                  <div
                    style={{
                      maxWidth: "80%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: message.sender === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        background:
                          message.sender === "user"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "#f0f2f5",
                        color: message.sender === "user" ? "#fff" : "#333",
                        padding: "12px 16px",
                        borderRadius: 16,
                        position: "relative",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {message.isEditing ? (
                        <div style={{ minWidth: 200 }}>
                          <TextArea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            style={{
                              marginBottom: 8,
                              border: "none",
                              background: "rgba(255,255,255,0.9)",
                            }}
                          />
                          <Space>
                            <Button
                              type="primary"
                              size="small"
                              icon={<CheckOutlined />}
                              onClick={() => handleSaveEdit(message.id)}
                            />
                            <Button
                              size="small"
                              icon={<CloseOutlined />}
                              onClick={() => handleCancelEdit(message.id)}
                            />
                          </Space>
                        </div>
                      ) : (
                        <>
                          <Paragraph
                            style={{
                              margin: 0,
                              color: message.sender === "user" ? "#fff" : "#333",
                              fontSize: 14,
                              lineHeight: 1.5,
                            }}
                          >
                            {message.sender === "ai" && message.animate
                              ? message.displayedText
                              : message.text}
                          </Paragraph>

                          <Dropdown
                            menu={{ items: getMessageActions(message) }}
                            trigger={["hover"]}
                            placement="topRight"
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<MoreOutlined />}
                              style={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                color: message.sender === "user" ? "rgba(255,255,255,0.7)" : "#999",
                                opacity: 0,
                                transition: "opacity 0.2s",
                              }}
                              className="message-actions"
                            />
                          </Dropdown>
                        </>
                      )}
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <Avatar
                      icon={<UserOutlined />}
                      size={24}
                      style={{ backgroundColor: "#52c41a", flexShrink: 0 }}
                    />
                  )}
                </div>
              ))}

              {isLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar
                    icon={<RobotOutlined />}
                    size={24}
                    style={{ backgroundColor: "#667eea" }}
                  />
                  <div
                    style={{
                      background: "#f0f2f5",
                      padding: "12px 16px",
                      borderRadius: 16,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Space>
                      <Spin size="small" />
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        AI sedang berpikir...
                      </Text>
                    </Space>
                  </div>
                </div>
              )}
            </Space>
          </div>

          {/* Input */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #e8e8e8",
              background: "#fafafa",
            }}
          >
            <Input.Search
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanya apa aja tentang pilihan ini..."
              enterButton={
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                  }}
                />
              }
              onSearch={handleSendMessage}
              disabled={isLoading}
              style={{
                borderRadius: "20px",
                overflow: "hidden",
              }}
            />
          </div>
        </Card>
      )}

      <style>{`
        .ant-card:hover .message-actions {
          opacity: 1 !important;
        }

        .ant-dropdown-trigger:hover .message-actions {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default AIChat;
