import React from "react";
import { Card, Typography, Space, Badge, Statistic, Divider } from "antd";
import { EnvironmentOutlined, ShopOutlined, DatabaseOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface InfoSectionProps {
  category: "food" | "place";
  foodCount: number;
  placeCount: number;
}

const InfoSection: React.FC<InfoSectionProps> = ({ category, foodCount, placeCount }) => {
  return (
    <div style={{ marginTop: 16 }}>
      <Card
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)",
          border: "1px solid #e8f4f8",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
        bodyStyle={{ padding: "16px 20px" }}
      >
        <Space direction="vertical" size="small" style={{ width: "100%", textAlign: "center" }}>
          {/* Location Info */}
          <div>
            <Badge
              count="📍"
              style={{
                backgroundColor: "transparent",
                fontSize: 14,
                border: "none",
                boxShadow: "none",
              }}
            />
            <Text
              style={{
                color: "#666",
                fontSize: 13,
                fontWeight: 500,
                marginLeft: 8,
              }}
            >
              Khusus area Bekasi & Bintaro
            </Text>
          </div>

          <Divider style={{ margin: "8px 0", borderColor: "#d1e7dd" }} />

          {/* Category Statistics */}
          <Space size="large" style={{ justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <Badge
                color={category === "food" ? "#52c41a" : "#1890ff"}
                dot
                style={{ marginBottom: 4 }}
              />
              <Statistic
                title={
                  <Space size="small">
                    <ShopOutlined style={{ color: "#ff7043" }} />
                    <Text style={{ fontSize: 12, color: "#888" }}>Makanan</Text>
                  </Space>
                }
                value={foodCount}
                valueStyle={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: category === "food" ? "#52c41a" : "#666",
                }}
              />
            </div>

            <Divider type="vertical" style={{ height: 40, borderColor: "#d1e7dd" }} />

            <div style={{ textAlign: "center" }}>
              <Badge
                color={category === "place" ? "#52c41a" : "#1890ff"}
                dot
                style={{ marginBottom: 4 }}
              />
              <Statistic
                title={
                  <Space size="small">
                    <EnvironmentOutlined style={{ color: "#42a5f5" }} />
                    <Text style={{ fontSize: 12, color: "#888" }}>Tempat</Text>
                  </Space>
                }
                value={placeCount}
                valueStyle={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: category === "place" ? "#52c41a" : "#666",
                }}
              />
            </div>
          </Space>

          {/* Active Category Info */}
          <div style={{ marginTop: 8 }}>
            <Badge
              status={category === "food" ? "processing" : "success"}
              text={
                <Text style={{ fontSize: 12, color: "#666" }}>
                  {category === "food"
                    ? `${foodCount} pilihan makanan tersedia`
                    : `${placeCount} pilihan tempat tersedia`}
                </Text>
              }
            />
          </div>

          {/* Database Info */}
          <div style={{ marginTop: 4, opacity: 0.7 }}>
            <DatabaseOutlined style={{ fontSize: 12, color: "#aaa", marginRight: 4 }} />
            <Text style={{ fontSize: 11, color: "#aaa", fontStyle: "italic" }}>
              Database terupdate • {new Date().toLocaleDateString("id-ID")}
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default InfoSection;
