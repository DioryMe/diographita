import React, { useEffect, useState } from "react";
import "./Settings.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
// import {
//   fetchSettings,
//   updateSettings,
//   fetchArchiveRooms,
//   addArchiveRoom,
//   removeArchiveRoom,
// } from "../store/settingsSlice";

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const { settings, archiveRooms, loading, error } = useSelector(
  //   (state: RootState) => state.settings
  // );

  // const [newRoomPath, setNewRoomPath] = useState("");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [archiveRooms, setArchiveRooms] = useState<any[]>([]);

  useEffect(() => {
    //   dispatch(fetchSettings());
    //   dispatch(fetchArchiveRooms());
    window.electronAPI.getArchiveRooms().then(({ data }) => {
      setArchiveRooms(data || []);
    });
  }, [dispatch]);

  const handleAddRoom = async () => {
    // if (newRoomPath.trim()) {
    //   await dispatch(addArchiveRoom(newRoomPath.trim()));
    //   setNewRoomPath("");
    //   setShowAddRoom(false);
    // }
  };

  const handleRemoveRoom = async (roomId: string) => {
    // if (confirm("Are you sure you want to remove this archive room?")) {
    //   await dispatch(removeArchiveRoom(roomId));
    // }
  };

  const handleSelectFolder = async () => {
    window.electronAPI.selectFolder();
  };

  // if (loading)
  //   return <div className="settings-loading">Loading settings...</div>;
  // if (error) return <div className="settings-error">Error: {error}</div>;
  // if (!settings) return <div>No settings loaded.</div>;

  return (
    <div className="settings-container">
      <h1>Settings</h1>

      {/* Archive Rooms */}
      <section className="settings-section">
        <h2>Archive Rooms</h2>

        <button onClick={handleSelectFolder}>Select folder</button>
        <div className="archive-rooms-list">
          {archiveRooms.map((room) => (
            <div key={room.id} className="archive-room-item">
              <div className="room-info">
                <label>
                  <span className="room-name">{room.name}</span>
                </label>
                <span className="room-path">{room.path}</span>
              </div>
              <button
                onClick={() => handleRemoveRoom(room.id)}
                className="remove-room-btn"
                aria-label="Remove room"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {showAddRoom ? (
          <div className="add-room-form">
            <input
              type="text"
              placeholder="Enter path to diograph.json file"
              className="add-room-input"
            />
            <div className="add-room-buttons">
              <button onClick={handleAddRoom}>Add Room</button>
              <button onClick={() => setShowAddRoom(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddRoom(true)} className="add-room-btn">
            + Add Archive Room
          </button>
        )}
      </section>
    </div>
  );
};

export default Settings;
