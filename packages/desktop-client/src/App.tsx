import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./Header";
import MyDiory from "./MyDiory";
import Archives from "./Archives";
import Settings from "./Settings";
import MyDioryContent from "./MyDioryContent";
import MyDioryGrid from "./MyDioryGrid";
import StoryRedirect from "./StoryRedirect";
// import { ArchiveContent } from "./ArchiveContent";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/my-diory" replace />} />
            <Route path="/my-diory" element={<MyDiory />} />
            <Route path="/my-diory/story" element={<StoryRedirect />} />
            <Route
              path="/my-diory/:dioryId/content"
              element={<MyDioryContent />}
            />
            <Route path="/my-diory/:dioryId/grid" element={<MyDioryGrid />} />
            <Route path="/archives" element={<Archives />} />
            {/* <Route path="/archives/diory/" element={<ArchiveContent />} /> */}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
