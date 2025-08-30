import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RootState, AppDispatch } from "./store/store";
import { fetchDioryInfo, selectStoryDiory } from "./store/diorySlice";
import GridHeader from "./GridHeader";
import { IDioryObject } from "@diograph/diograph/types";

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

export function MyDioryGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { dioryId } = useParams<{ dioryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const storyId = searchParams.get("storyId");

  const { focus, loading } = useSelector((state: RootState) => state.diory);

  useEffect(() => {
    if (dioryId) {
      const decodedDioryId = decodeURIComponent(dioryId);
      dispatch(
        fetchDioryInfo({
          focusId: decodedDioryId,
          storyId: storyId || undefined,
        })
      );
    }
  }, [dispatch, dioryId, storyId]);

  const handleStorySelect = (selectedStoryId: string) => {
    // Update URL with selected story
    setSearchParams({ storyId: selectedStoryId });
    // Update store selection
    if (dioryId) {
      dispatch(
        selectStoryDiory({
          focusId: decodeURIComponent(dioryId),
          storyId: selectedStoryId,
        })
      );
    }
  };

  const handleGridStoryClick = (clickedStory: IDioryObject) => {
    navigate(`/my-diory/${clickedStory.id}/grid`);
  };

  const handleEnlargedImageClick = () => {
    // Navigate to content view
    const currentStoryId = focus.storyId || focus.focusId;
    navigate(
      `/my-diory/${encodeURIComponent(
        dioryId!
      )}/content?storyId=${currentStoryId}`
    );
  };

  if (loading || !focus.focusDiory) return <div>Loading...</div>;

  const selectedStory = focus.focusDiory;

  return (
    <>
      <GridHeader
        story={focus.storyDiory || focus.storyDiories[0]}
        stories={focus.storyDiories}
        handleStorySelect={handleStorySelect}
      />
      {/* Enlarged selected item with fixed height container for stable layout */}
      {selectedStory && (
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
              {selectedStory.text && (
                <div style={badgeStyle as any}>{selectedStory.text}</div>
              )}
              <img
                src={selectedStory.image}
                alt={selectedStory.id}
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
        {focus.storyDiories.map((storyDiory) => (
          <div
            key={storyDiory.id}
            onClick={() => handleGridStoryClick(storyDiory)}
            style={{
              position: "relative", // added for dot indicator positioning
              border:
                storyDiory.id === focus.focusId ? "2px solid blue" : "none",
              aspectRatio: "1", // square cell
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {storyDiory.links && storyDiory.links.length > 0 && (
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
              src={storyDiory.image}
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
}

export default MyDioryGrid;
