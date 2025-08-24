import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useNavigate } from "react-router-dom";
import GridHeader from "./GridHeader";

export const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "10px",
  padding: "10px",
  marginTop: "30px",
};

const badgeStyle = {
  position: "absolute",
  top: "5px",
  left: "5px",
  padding: "2px 4px",
  backgroundColor: "grey",
  color: "#fff",
  fontSize: "12px",
  borderRadius: "2px",
};

const MyDioryGrid: React.FC = () => {
  const navigate = useNavigate();
  const { storyDiories, focusId } = useSelector(
    (state: RootState) => state.diory.focus
  );

  const selectedItem = storyDiories[0];

  return (
    <>
      <GridHeader />
      {/* Enlarged selected item with fixed height container for stable layout */}
      {selectedItem && (
        <div
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            height: "300px", // fixed height
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            // onClick={() => focusSelected(selectedItem.id)}
            onClick={() => navigate("/my-diory/content")}
          >
            <div style={{ position: "relative" }}>
              {selectedItem.text && (
                <div style={badgeStyle as any}>{selectedItem.text}</div>
              )}
              <img
                src={selectedItem.image}
                alt={selectedItem.id}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                  margin: "auto",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid of items with square cells, centered content, and a gray dot if item has links */}
      <div style={gridStyle}>
        {storyDiories.map(({ id, image, links }) => (
          <div
            key={id}
            // onClick={() => focusSelected(id)}
            style={{
              position: "relative", // added for dot indicator positioning
              border:
                id === "e606fdb9-71b8-4734-82b0-079a695463a1"
                  ? "2px solid blue"
                  : "none",
              aspectRatio: "1", // square cell
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {links && links.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "5px",
                  left: "5px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "grey",
                }}
              />
            )}
            <img
              src={image}
              alt={id}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default MyDioryGrid;
