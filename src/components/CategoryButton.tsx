import React from "react";
import { Button, Space, Badge } from "antd";
import { ShopOutlined, EnvironmentOutlined, CheckCircleOutlined } from "@ant-design/icons";

interface CategoryButtonProps {
  icon: "food" | "place";
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  icon,
  label,
  isActive,
  onClick,
  count,
}) => {
  const IconComponent = icon === "food" ? ShopOutlined : EnvironmentOutlined;

  return (
    <Button
      type={isActive ? "primary" : "default"}
      size="large"
      onClick={onClick}
      style={{
        height: 50,
        borderRadius: 16,
        fontWeight: 600,
        fontSize: 14,
        border: isActive ? "none" : "2px solid #f0f0f0",
        background: isActive
          ? "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        color: isActive ? "white" : "#666",
        boxShadow: isActive ? "0 4px 15px rgba(255, 107, 53, 0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        minWidth: 120,
      }}
      className="category-button"
    >
      <Space size="small" style={{ position: "relative", zIndex: 2 }}>
        <IconComponent
          style={{
            fontSize: 16,
            color: isActive ? "white" : icon === "food" ? "#ff7043" : "#42a5f5",
          }}
        />
        <span>{label}</span>
        {isActive && (
          <CheckCircleOutlined
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.9)",
            }}
          />
        )}
      </Space>

      {/* Count Badge */}
      {count && (
        <Badge
          count={count}
          size="small"
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            zIndex: 3,
            backgroundColor: isActive ? "rgba(255,255,255,0.9)" : "#1890ff",
            color: isActive ? "#ff6b35" : "white",
            fontSize: 10,
            fontWeight: 600,
            minWidth: 18,
            height: 18,
            lineHeight: "18px",
            borderRadius: 9,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      )}

      {/* Shine effect for active button */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            animation: "shine 2s ease-in-out infinite",
            zIndex: 1,
          }}
        />
      )}

      <style>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .category-button:hover:not(.ant-btn-primary) {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
          border-color: #d9d9d9 !important;
        }

        .category-button.ant-btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 25px rgba(255, 107, 53, 0.4) !important;
        }

        .category-button:active {
          transform: translateY(0px) !important;
        }
      `}</style>
    </Button>
  );
};

// Usage wrapper component for easier implementation
export const CategoryButtonGroup: React.FC<{
  activeCategory: "food" | "place";
  onCategoryChange: (category: "food" | "place") => void;
  foodCount: number;
  placeCount: number;
}> = ({ activeCategory, onCategoryChange, foodCount, placeCount }) => {
  return (
    <Space size="middle" style={{ width: "100%", justifyContent: "center" }}>
      <CategoryButton
        icon="food"
        label="Makanan"
        isActive={activeCategory === "food"}
        onClick={() => onCategoryChange("food")}
        count={foodCount}
      />
      <CategoryButton
        icon="place"
        label="Tempat"
        isActive={activeCategory === "place"}
        onClick={() => onCategoryChange("place")}
        count={placeCount}
      />
    </Space>
  );
};

export default CategoryButton;
