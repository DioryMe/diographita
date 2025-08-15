import React, { useEffect, useState } from "react";
import { DioryContent } from "./DioryContent";
import DioryGrid from "./DioryGrid";
import { fetchDioryInfo } from "./store/diorySlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [content, setContent] = useState("-");
  const [folderPath, setFolderPath] = useState("-");

  const handleSelectFolder = async () => {
    window.electronAPI.selectFolder().then((result) => {
      setFolderPath(
        (result.success === true ? result.data : result.error) || "undefined"
      );
    });
  };

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.helloWorld().then((result: any) => {
        setContent(result);
      });
    }
  }, []);

  useEffect(() => {
    dispatch(fetchDioryInfo({ focusId: "/" }));
  }, [dispatch]);

  return (
    <div>
      <div>{content}</div>
      <div>{folderPath}</div>
      <button onClick={handleSelectFolder}>Select folder</button>
      <DioryGrid onClick={(focusId) => dispatch(fetchDioryInfo({ focusId }))} />
      <DioryContent />
    </div>
  );
};

export default App;
