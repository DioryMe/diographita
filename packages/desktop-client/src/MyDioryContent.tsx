import { useNavigate } from "react-router-dom";
import { DioryContent } from "./DioryContent";
import DioryHeader from "./DioryHeader";
import { DioryInfo } from "./DioryInfo";
import { useState } from "react";

const MyDioryContent = () => {
  const [contentSide, setContentSide] = useState(true);

  const navigate = useNavigate();
  return (
    <>
      <DioryHeader contentSide={contentSide} setContentSide={setContentSide} />
      {contentSide ? <DioryContent /> : <DioryInfo />}
    </>
  );
};

export default MyDioryContent;
