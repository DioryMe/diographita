import React, { useEffect, useState } from "react";
import { DioryContent } from "./DioryContent";
import DioryGrid from "./DioryGrid";
import { fetchDioryInfo, setFocus } from "./store/diorySlice";
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
    dispatch(setFocus({ focusId: "asdf" }));
    dispatch(
      fetchDioryInfo({ focusId: "e07c2f1d-5f5a-488a-a505-34f7b9f55105" })
    );
  }, [dispatch]);

  return (
    <div>
      <div>{content}</div>
      <div>{folderPath}</div>
      <button onClick={handleSelectFolder}>Select folder</button>
      <DioryGrid />
      <DioryContent />
    </div>
  );
};

export default App;
