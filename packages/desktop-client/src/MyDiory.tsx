import React, { useEffect } from "react";
import { DioryContent } from "./DioryContent";
import DioryGrid from "./DioryGrid";
import { fetchDioryInfo } from "./store/diorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";

const MyDiory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSelectFolder = async () => {
    window.electronAPI.selectFolder();
  };

  useEffect(() => {
    dispatch(fetchDioryInfo({ focusId: "/" }));
  }, [dispatch]);

  return (
    <div>
      <button onClick={handleSelectFolder}>Select folder</button>
      <DioryGrid onClick={(focusId) => dispatch(fetchDioryInfo({ focusId }))} />
      <DioryContent />
    </div>
  );
};

export default MyDiory;
