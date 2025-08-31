import { useNavigate } from "react-router-dom";

import { fetchDioryInfo } from "./store/diorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useEffect } from "react";
import "./MyDioryHome.css";

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
    <div className="my-diory-home">
      <div className="story-grid">
        {focus.storyDiories.map((story) => (
          <div
            key={story.id}
            className="story-card"
            onClick={() => handleStoryClick(story.id)}
          >
            <img src={story.image} alt={story.text} />
            <h3>{story.text}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDioryHome;
