import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "./store/store";
import { closeArchiveOverlay } from "./store/archiveSlice";

function ArchiveContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedDiory, isOverlayOpen } = useSelector(
    (state: RootState) => state.archive
  );

  const handleClose = () => {
    dispatch(closeArchiveOverlay());
    navigate("/archives"); // Remove overlay query param
  };

  if (!isOverlayOpen || !selectedDiory) {
    return null;
  }

  return (
    <div className="archive-overlay">
      <div className="overlay-backdrop" onClick={handleClose} />
      <div className="overlay-content">
        {/* Close button */}
        <button className="close-btn" onClick={handleClose}>
          ✕
        </button>

        {/* Enlarged diory image */}
        <div className="enlarged-archive-image">
          <img src={selectedDiory.image} alt={selectedDiory.text} />
        </div>

        {/* Diory information */}
        <div className="archive-diory-info">
          <h2>{selectedDiory.text}</h2>
          {selectedDiory.date && (
            <div className="date">{selectedDiory.date}</div>
          )}
          {selectedDiory.latlng && (
            <div className="location">{selectedDiory.latlng}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArchiveContent;
