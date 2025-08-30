import { IDioryObject } from "@diograph/diograph/types";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const GridHeader = ({
  story,
  stories,
  handleStorySelect,
}: {
  story: IDioryObject;
  stories: IDioryObject[];
  handleStorySelect: (value: string) => void;
}) => {
  const navigate = useNavigate();

  const storyLength = stories.length ? " (" + stories.length + ")" : "";

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
      <div>{story.text}</div>
      <select
        value={story.id || ""}
        onChange={(e) => handleStorySelect(e.target.value)}
      >
        {/* <option value="">{"Select a story" + storyLength}</option> */}
        {stories.map((story) => (
          <option key={story.id} value={story.id}>
            {story.text + storyLength}
          </option>
        ))}
      </select>
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
