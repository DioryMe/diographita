import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RootState, AppDispatch } from "./store/store";
import { fetchDioryInfo } from "./store/diorySlice";
import GridHeader from "./GridHeader";
import { IDioryObject } from "@diograph/diograph/types";
import "./MyDioryGrid.css";

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
        <div className="enlarged-container">
          <div
            className="enlarged-image-wrapper"
            onClick={handleEnlargedImageClick}
          >
            <div className="enlarged-image-content">
              {focusDiory.text && (
                <div className="diory-badge">{focusDiory.text}</div>
              )}
              <img src={focusDiory.image} alt={focusDiory.id} />
            </div>
          </div>
        </div>
      )}
      {/* Grid of items with square cells, centered content, and a gray dot if item has links */}
      <div className="my-diory-grid">
        {focus.storyLinkedDiories.map((diory) => (
          <div
            className={`grid-item ${
              diory.id === focus.focusId ? "selected" : ""
            }`}
            onClick={() => handleDioryClick(diory)}
            key={diory.id}
          >
            {diory.links && diory.links.length > 0 && (
              <div className="link-indicator" />
            )}
            <img src={diory.image} />
          </div>
        ))}
      </div>
    </>
  );
}

export default MyDioryGrid;
