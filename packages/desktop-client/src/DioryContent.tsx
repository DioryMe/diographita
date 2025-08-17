import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { FiImage, FiVideo } from "react-icons/fi";
import { useEffect, useState } from "react";

export const DioryContent = () => {
  const { focusDiory: diory } = useSelector(
    (state: RootState) => state.diory.focus
  );

  useEffect(() => {
    if (diory && diory.image) {
      setSrcUrl(diory.image);
    }
  }, [diory]);

  const [srcUrl, setSrcUrl] = useState(diory?.image || "");
  const [contentLoaded, setContentLoaded] = useState(false);

  const mimeType =
    diory && diory.data && diory.data[0] && diory.data[0].encodingFormat;
  const isVideo = mimeType ? mimeType.startsWith("video") : null;

  const mediaElement =
    isVideo && mimeType && contentLoaded ? (
      <video controls loop style={{ maxHeight: "90vh", width: "100%" }}>
        <source src={srcUrl} type={mimeType} />
        <track kind="captions" />
      </video>
    ) : (
      <img src={srcUrl} style={{ width: "100%" }} />
    );

  const handleLoadContent = () => {
    const contentUrl =
      diory && diory.data && diory.data[0] && diory.data[0].contentUrl;
    if (contentUrl) {
      setSrcUrl(`app://video`);
      // setSrcUrl(`app://abcdefghijklmn`);
      // setSrcUrl(`app://${contentUrl}`);
      setContentLoaded(true);
    } else {
      alert("NOT FOUND");
    }
  };

  return (
    <div style={{ cursor: "grab", position: "relative" }}>
      <div className="swiper-zoom-container" style={{ position: "relative" }}>
        {mediaElement}
        {/* Show an overlay icon of contentType & change to content on click */}
        <div
          onClick={handleLoadContent}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          {isVideo ? <FiVideo size={48} /> : <FiImage size={48} />}
        </div>
      </div>
    </div>
  );
};
