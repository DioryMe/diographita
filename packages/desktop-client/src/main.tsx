import { helloWorld } from "@diographita/core";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div>{helloWorld()}</div>
  </React.StrictMode>
);
