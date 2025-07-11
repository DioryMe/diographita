import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [content, setContent] = useState("-");
  const [error, setError] = useState("-");

  useEffect(() => {
    window.electronAPI
      .helloWorld()
      .then((result: any) => {
        setContent(result);
      })
      .catch((e) => {
        setError(e);
      });
  }, []);

  return (
    <div>
      <div>{content}</div>
      <div>{error}</div>
    </div>
  );
};

export default App;
