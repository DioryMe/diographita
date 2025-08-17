import { IDioryObject } from "@diograph/diograph/types";
import { useEffect, useState } from "react";

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "10px",
  padding: "10px",
};
const itemStyle = {
  position: "relative",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "4px",
  overflow: "hidden",
};

const ArchiveGrid = () => {
  const [dioryArray, setDioryArray] = useState<IDioryObject[]>([]);

  useEffect(() => {
    // Vehoniemi
    const filter = {
      latlngStart: "61.412517, 24.144045",
      latlngEnd: "61.402413, 24.169763",
    };

    window.electronAPI.getArchiveDiograph(filter).then((archiveDiograph) => {
      if (archiveDiograph.success && archiveDiograph.data) {
        setDioryArray(archiveDiograph.data);
      }
    });
  }, []);

  return (
    <>
      <div style={gridStyle}>
        {dioryArray.map(({ id: dioryId, image }) => (
          // TODO: Archiven diory linkattaisiin /archive/diory/...
          <a key={dioryId} href={`/archive/diory/${dioryId}`}>
            <div key={dioryId} style={itemStyle as any}>
              <img
                src={image}
                alt={dioryId}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default ArchiveGrid;
