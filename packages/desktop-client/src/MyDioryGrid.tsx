import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RootState, AppDispatch } from "./store/store";
import { fetchDioryInfo } from "./store/diorySlice";
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
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("storyId");

  const { focus } = useSelector((state: RootState) => state.diory);

  useEffect(() => {
    if (dioryId) {
      dispatch(
        fetchDioryInfo({
          focusId: dioryId,
          storyId: storyId || undefined,
        })
      );
    }
  }, [dispatch, dioryId, storyId]);

  const handleStorySelect = (selectedStoryId: string) => {
    navigate(`/my-diory/${focus.focusId}/grid?storyId=${selectedStoryId}`);
  };

  const handleDioryClick = (clickedDiory: IDioryObject) => {
    navigate(`/my-diory/${clickedDiory.id}/grid?storyId=${focus.storyId}`);
  };

  const handleEnlargedImageClick = () => {
    navigate(`/my-diory/${focus.focusId}/content?storyId=${focus.storyId}`);
  };

  const focusDiory = focus.focusDiory;

  return (
    <>
      <GridHeader
        story={focus.storyDiory || focus.storyDiories[0]}
        stories={focus.stories}
        handleStorySelect={handleStorySelect}
      />
      {/* Enlarged selected item with fixed height container for stable layout */}
      {focusDiory && (
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
          <div onClick={handleEnlargedImageClick}>
            <div style={{ position: "relative" }}>
              {focusDiory.text && (
                <div style={badgeStyle as any}>{focusDiory.text}</div>
              )}
              <img
                src={focusDiory.image}
                alt={focusDiory.id}
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
        {focus.storyLinkedDiories.map((diory) => (
          <div
            key={diory.id}
            onClick={() => handleDioryClick(diory)}
            style={{
              position: "relative", // added for dot indicator positioning
              border: diory.id === focus.focusId ? "2px solid blue" : "none",
              aspectRatio: "1", // square cell
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {diory.links && diory.links.length > 0 && (
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
              src={diory.image}
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
