import { IDioryObject } from "@diograph/diograph/types";
import { useEffect, useState } from "react";
import { fetchArchiveDiories, selectArchiveDiory } from "./store/archiveSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { useNavigate, useSearchParams } from "react-router-dom";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "10px",
  padding: "10px",
};
const itemStyle = {
  position: "relative",
  cursor: "pointer",
  display: "flex",
  borderRadius: "4px",
  overflow: "hidden",
  objectFit: "contain",
  justifyContent: "center",
  alignItems: "center",
};

const ArchiveGrid = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const overlayDioryId = searchParams.get("overlay");

  const { filter, archiveDiories, loading } = useSelector(
    (state: RootState) => state.archive
  );

  useEffect(() => {
    dispatch(fetchArchiveDiories(filter));
  }, [dispatch, filter]);

  useEffect(() => {
    // Handle overlay from URL
    if (overlayDioryId && archiveDiories.length > 0) {
      const selectedDiory = archiveDiories.find((d) => d.id === overlayDioryId);
      if (selectedDiory) {
        dispatch(selectArchiveDiory(selectedDiory));
      }
    }
  }, [overlayDioryId, archiveDiories, dispatch]);

  const handleDioryClick = (diory: IDioryObject) => {
    // Update URL and show overlay
    navigate(`/archives?overlay=${encodeURIComponent(diory.id)}`);
    dispatch(selectArchiveDiory(diory));
  };

  return (
    <>
      <div className="filter-header">
        <div className="filter-display">
          <h3>Current Filter:</h3>
          <div className="filter-details">
            {filter.dateStart && <span>From: {filter.dateStart}</span>}
            {filter.dateEnd && <span>To: {filter.dateEnd}</span>}
            {filter.latlngStart && filter.latlngEnd && (
              <span>
                Location: {filter.latlngStart}, {filter.latlngEnd}
              </span>
            )}
            {Object.keys(filter).length === 0 && <span>No filter applied</span>}
          </div>
        </div>
        <button className="edit-filter-btn">Edit</button>
      </div>
      <div style={gridStyle}>
        {archiveDiories.map((diory) => (
          <div
            key={diory.id}
            style={itemStyle as any}
            onClick={() => handleDioryClick(diory)}
          >
            <img src={diory.image} style={{ width: "100%", height: "auto" }} />
          </div>
        ))}
        {archiveDiories.length === 0 && !loading && (
          <div className="no-results">
            No diories found matching the filter.
          </div>
        )}
      </div>
    </>
  );
};

export default ArchiveGrid;
