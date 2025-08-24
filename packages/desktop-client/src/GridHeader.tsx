import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const GridHeader = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginBottom: "10px",
        height: "70px",
      }}
    >
      <button onClick={() => navigate(`/my-diory`)}>
        <FiHome size={24} />
      </button>

      <button>Stories here</button>
      {/* {stories.find((story) => story.id === storyId)?.text}
      {selectedHasMultipleStories &&
        otherStories.map((otherStory) => (
          <button
            key={otherStory.id}
            onClick={() => {
              dispatch(setFocus({ focusId: focusId, storyId: otherStory.id }));
              navigate(`/diory/${focusId}/grid?storyId=${otherStory.id}`);
            }}
          >
            {`${otherStory.text}`}
          </button>
        ))} */}
    </div>
  );
};

export default GridHeader;
