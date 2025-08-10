import React, { useEffect, useState } from "react";
import { DioryContent } from "./DioryContent";
import DioryGrid from "./DioryGrid";
import { setFocus } from "./store/diorySlice";
import { useDispatch } from "react-redux";

const App: React.FC = () => {
  const dispatch = useDispatch();

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
