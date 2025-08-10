import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

interface DioryGridProps {}

const DioryGrid: React.FC<DioryGridProps> = () => {
  const { stories: diories } = useSelector(
    (state: RootState) => state.diory.focus
  );

  useEffect(() => {
    console.log("diories", diories);
  }, [diories]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px",
        padding: "16px",
      }}
    >
      {diories.map((diory) => (
        <div
          key={diory.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            backgroundColor: "#fff",
          }}
        >
          {diory.image && (
            <img
              src={diory.image}
              alt={diory.text || "Diory image"}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "4px",
                marginBottom: "8px",
              }}
            />
          )}
          {diory.text && (
            <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
              {diory.text}
            </p>
          )}
          {diory.date && (
            <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
              {diory.date}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DioryGrid;
