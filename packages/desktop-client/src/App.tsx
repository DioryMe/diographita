import React, { useEffect, useState } from "react";

const App: React.FC = () => {
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
    window.electronAPI.helloWorld().then((result: any) => {
      setContent(result);
    });
  }, []);

  return (
    <div>
      <div>{content}</div>
      <div>{folderPath}</div>
      <button onClick={handleSelectFolder}>Select folder</button>
    </div>
  );
};

export default App;
