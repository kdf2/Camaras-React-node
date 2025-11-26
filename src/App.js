import { useState } from "react";
import CameraGrid from "./CameraGrid";
import Player from "./Player";

export default function App() {
  const [selectedCamera, setSelectedCamera] = useState(null);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      {!selectedCamera ? (
        <CameraGrid onSelectCamera={(cam) => setSelectedCamera(cam)} />
      ) : (
        <Player camera={selectedCamera} onBack={() => setSelectedCamera(null)} />
      )}
    </div>
  );
}

