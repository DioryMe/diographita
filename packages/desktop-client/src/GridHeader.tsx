import { IDioryObject } from "@diograph/diograph/types";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./GridHeader.css";

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
    <div className="grid-header">
      <button onClick={() => navigate(`/my-diory`)}>
        <FiHome size={24} />
      </button>
      <div>{story.text}</div>
      <select
        value={story.id || ""}
        onChange={(e) => handleStorySelect(e.target.value)}
      >
        {stories.map((story) => (
          <option key={story.id} value={story.id}>
            {story.text + storyLength}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GridHeader;
