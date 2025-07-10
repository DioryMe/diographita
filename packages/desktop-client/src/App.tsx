import React from "react";

const App: React.FC = () => {
  let content = "J667";
  let error = "123";

  console.log("asdddd", window.electronAPI);

  window.electronAPI
    .helloWorld()
    .then((result: any) => {
      content = result;
    })
    .catch((e) => {
      console.log("e", e);
      error = e;
    });

  return (
    <div>
      <div>{error}</div>
      <div>{content}</div>
    </div>
  );
};

export default App;
