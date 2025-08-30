import { useNavigate } from "react-router-dom";

import { fetchDioryInfo } from "./store/diorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useEffect } from "react";

export function MyDioryHome() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { focus } = useSelector((state: RootState) => state.diory);

  useEffect(() => {
    dispatch(fetchDioryInfo({ focusId: "/", storyId: null }));
  }, [dispatch]);

  const handleStoryClick = async (storyId: string) => {
    navigate(`/my-diory/story?storyId=${storyId}`);
  };

  return (
    <div>
      <h2>HOME</h2>
      {/* Two-column grid container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {focus.storyDiories.map((story) => (
          <div
            onClick={() => handleStoryClick(story.id)}
            key={story.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "300hw", // Adjust height as needed
            }}
          >
            {/* Image container to center the image vertically */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                src={story.image}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  cursor: "pointer",
                }}
              />
            </div>
            {/* Text container always at the bottom */}
            <div style={{ marginBottom: "8px" }}>
              <p style={{ margin: 0 }}>{story.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDioryHome;
