import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronLeft,
  FiInfo,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "./store/store";

const DioryHeader = ({ contentSide, setContentSide }) => {
  const navigate = useNavigate();
  const headerItemStyle = { display: "inline-block", marginRight: "20px" };

  const { focus } = useSelector((state: RootState) => state.diory);

  const swipeLeft = () => {
    /*
    if (!prevId) return;
    navigate(`/diory/${prevId}/content?storyId=${storyId}`);
    dispatch(setFocus({ focusId: prevId, storyId }));
    if (prevId && !slides.includes(prevId)) {
      setSlides((slides) => [prevId, ...slides]);
      swiper.slideTo(swiper.activeIndex + 1, 0, false);
    }
    */
  };

  const swipeRight = () => {
    /*
    if (!nextId) return;
    navigate(`/diory/${nextId}/content?storyId=${storyId}`);
    if (nextId && !slides.includes(nextId)) {
      setSlides((slides) => [...slides, nextId]);
    }
    dispatch(setFocus({ focusId: nextId, storyId }));
    */
  };

  return (
    <div>
      <div
        style={headerItemStyle}
        onClick={() =>
          navigate(`/my-diory/${focus.focusId}/grid/?storyId=${focus.storyId}`)
        }
      >
        <FiChevronLeft size={48} style={{ cursor: "pointer" }} />
      </div>
      <div
        style={headerItemStyle}
        onClick={() => {
          setContentSide(!contentSide);
        }}
      >
        <FiInfo
          size={48}
          style={{ cursor: "pointer" }}
          fill={contentSide ? "white" : "grey"}
        />
        {/* <FiInfo size={48} style={{ cursor: "pointer" }} fill="grey" /> */}
      </div>
      {contentSide ? (
        <>
          <div style={headerItemStyle} onClick={swipeLeft}>
            <FiArrowLeft size={48} style={{ cursor: "pointer" }} />
          </div>
          <div style={headerItemStyle} onClick={swipeRight}>
            <FiArrowRight size={48} style={{ cursor: "pointer" }} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DioryHeader;
