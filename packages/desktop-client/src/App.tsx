import React, { useEffect } from "react";
import { DioryContent } from "./DioryContent";
import DioryGrid from "./DioryGrid";
import { fetchDioryInfo } from "./store/diorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import ArchiveGrid from "./ArchiveGrid";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSelectFolder = async () => {
    window.electronAPI.selectFolder();
  };

  useEffect(() => {
    dispatch(fetchDioryInfo({ focusId: "/" }));
  }, [dispatch]);

  return (
    <div>
      {/* <video src="app://video" controls style={{ maxWidth: "100%" }} />
      <img src="app://abcdefghijklmn" alt="My image" /> */}
      <button onClick={handleSelectFolder}>Select folder</button>
      <DioryGrid onClick={(focusId) => dispatch(fetchDioryInfo({ focusId }))} />
      <DioryContent />
      <ArchiveGrid />
    </div>
  );
};

export default App;
