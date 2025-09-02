import React from "react";
import { Button, Card, Space} from "antd";
import { ReloadOutlined, ThunderboltOutlined } from "@ant-design/icons";

// Custom Dice Icons as SVG components
const DiceIcons = {
  1: () => (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  ),
  2: () => (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  3: () => (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  4: () => (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  5: () => (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  6: () => (
    <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="8" cy="7" r="1.5" fill="currentColor" />
      <circle cx="16" cy="7" r="1.5" fill="currentColor" />
      <circle cx="8" cy="12" r="1.5" fill="currentColor" />
      <circle cx="16" cy="12" r="1.5" fill="currentColor" />
      <circle cx="8" cy="17" r="1.5" fill="currentColor" />
      <circle cx="16" cy="17" r="1.5" fill="currentColor" />
    </svg>
  ),
};

interface DiceRollerProps {
  diceIconIndex: number;
  isRolling: boolean;
  onRoll: () => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ diceIconIndex, isRolling, onRoll }) => {
  const DiceComponent = DiceIcons[(diceIconIndex + 1) as keyof typeof DiceIcons] || DiceIcons[1];

  return (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <Card
        style={{
          background: "linear-gradient(135deg, #f6f8fc 0%, #e9ecef 100%)",
          border: "none",
          borderRadius: 20,
          marginBottom: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
        bodyStyle={{
          padding: "32px 24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#6c757d",
            transition: "all 0.3s ease",
            transform: isRolling ? "rotateY(180deg) scale(1.1)" : "rotateY(0deg) scale(1)",
            animation: isRolling ? "bounce 0.6s ease-in-out infinite alternate" : "none",
          }}
        >
          <DiceComponent />
        </div>
      </Card>

      <Button
        type="primary"
        size="large"
        onClick={onRoll}
        disabled={isRolling}
        icon={isRolling ? <ReloadOutlined spin /> : <ThunderboltOutlined />}
        style={{
          height: 50,
          borderRadius: 25,
          fontSize: 16,
          fontWeight: 600,
          background: isRolling
            ? "linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)"
            : "linear-gradient(135deg, #e91e63 0%, #f06292 100%)",
          border: "none",
          boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
          transition: "all 0.3s ease",
          minWidth: 140,
        }}
        className="dice-roll-button"
      >
        <Space>{isRolling ? "Rolling..." : "Roll Dice!"}</Space>
      </Button>

      <style>{`
        @keyframes bounce {
          0% {
            transform: rotateY(0deg) translateY(0px) scale(1);
          }
          100% {
            transform: rotateY(360deg) translateY(-10px) scale(1.05);
          }
        }

        .dice-roll-button:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(233, 30, 99, 0.4) !important;
        }

        .dice-roll-button:active {
          transform: translateY(0px) !important;
        }
      `}</style>
    </div>
  );
};

export default DiceRoller;
