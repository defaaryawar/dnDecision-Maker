import React from "react";
import { Typography, Space, Badge, Button } from "antd";
import { StarOutlined, ThunderboltOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

interface HeaderProps {
  isSecretMode?: boolean;
  onSecretToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSecretMode = false, onSecretToggle }) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "24px 16px",
        textAlign: "center",
        borderBottomLeftRadius: "24px",
        borderBottomRightRadius: "24px",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Secret Button - Invisible di pojok kanan bawah */}
      {onSecretToggle && (
        <Button
          type="text"
          onClick={onSecretToggle}
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 60,
            height: 40,
            padding: 0,
            border: "none",
            background: "transparent",
            color: "transparent",
            borderRadius: 8,
            zIndex: 10,
            cursor: "pointer",
          }}
          className="invisible-secret-button"
        />
      )}

      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          background: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          filter: "blur(15px)",
        }}
      />
      <Space direction="vertical" size="small" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <StarOutlined
            style={{
              color: "#ffd700",
              fontSize: 24,
              animation: "pulse 2s ease-in-out infinite alternate",
            }}
          />
          <Title
            level={2}
            style={{
              color: "white",
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            dnDecision Maker
          </Title>
          <ThunderboltOutlined
            style={{
              color: "#ffd700",
              fontSize: 24,
              animation: "pulse 2s ease-in-out infinite alternate-reverse",
            }}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <Badge
            count="🎲"
            style={{
              backgroundColor: "transparent",
              color: "white",
              fontSize: 16,
              border: "none",
              boxShadow: "none",
            }}
          />
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 14,
              fontWeight: 500,
              marginLeft: 8,
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Bingung mau makan/kemana? Biar kami yang tentukan!
          </Text>
        </div>
        <div style={{ marginTop: 4 }}>
          <Badge
            status="processing"
            text={
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                Powered by {isSecretMode ? "dnAI" : "AI"} & Random Magic ✨
              </Text>
            }
          />
        </div>
      </Space>
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .header-secret-button:hover {
          opacity: 0.6 !important;
          transform: rotate(45deg) !important;
        }

        .invisible-secret-button:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default Header;
