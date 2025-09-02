import React from "react";
import { Card, Typography, Space, Badge } from "antd";
import { EnvironmentOutlined, ShopOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface ResultDisplayProps {
  result: string;
  category: "food" | "place";
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, category }) => {
  return (
    <Card
      style={{
        background: result
          ? "linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%)"
          : "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
        border: "none",
        borderRadius: 20,
        minHeight: 140,
        boxShadow: result ? "0 8px 32px rgba(255, 193, 7, 0.15)" : "0 4px 16px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
      }}
      bodyStyle={{
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 92,
      }}
    >
      {result ? (
        <div style={{ textAlign: "center", width: "100%" }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}
            >
              <Badge
                count={category === "food" ? "🍽️" : "📍"}
                style={{
                  backgroundColor: "transparent",
                  color: "#1890ff",
                  fontSize: 24,
                  border: "none",
                  boxShadow: "none",
                }}
              />
              {category === "food" ? (
                <ShopOutlined style={{ fontSize: 20, color: "#ff7043" }} />
              ) : (
                <EnvironmentOutlined style={{ fontSize: 20, color: "#42a5f5" }} />
              )}
            </div>

            <div>
              <Text
                type="secondary"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                {category === "food" ? "🎯 Kamu harus makan:" : "🎯 Kamu harus ke:"}
              </Text>

              <Title
                level={3}
                style={{
                  margin: 0,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textAlign: "center",
                  lineHeight: 1.3,
                  fontSize: "1.25rem",
                  fontWeight: 700,
                }}
              >
                {result}
              </Title>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <Badge
                status={category === "food" ? "processing" : "success"}
                text={
                  <Text style={{ fontSize: 12, color: "#666" }}>
                    {category === "food" ? "Tempat Makan" : "Destinasi"}
                  </Text>
                }
              />
            </div>
          </Space>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Space direction="vertical" size="middle">
            <div
              style={{
                fontSize: 48,
                marginBottom: 8,
                filter: "grayscale(100%)",
                opacity: 0.6,
              }}
            >
              🤔
            </div>

            <div>
              <QuestionCircleOutlined
                style={{
                  fontSize: 20,
                  color: "#bbb",
                  marginBottom: 8,
                  display: "block",
                }}
              />

              <Text
                type="secondary"
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Klik "Roll Dice!" untuk memulai
              </Text>
            </div>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default ResultDisplay;
