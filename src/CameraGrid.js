import { useEffect, useState } from "react";
import "./CameraGrid.css";

export default function CameraGrid({ onSelectCamera }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("http://localhost:3000/cameras");
        const data = await r.json();
        console.log("📷 Datos recibidos:", data);

        setCameras(data || []); // <- data es un array, no data.data
      } catch (err) {
        console.error("❌ Error cargando cámaras:", err);
        setCameras([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Cargando cámaras...</p>;
  if (!cameras.length) return <p>No hay cámaras disponibles</p>;

  return (
    <div>
      <h1>Mis Cámaras</h1>

      <div className="camera-grid">
        {cameras.map((cam) => (
          <div className="camera-card" key={cam.serial}>
            <h3 className="camera-title">{cam.name || "Sin nombre"}</h3>

            <p>
              Estado:{" "}
              <span className={cam.online ? "status-online" : "status-offline"}>
                {cam.online ? "Online" : "Offline"}
              </span>
            </p>
            <button
              className="camera-button"
              onClick={() =>
                onSelectCamera({
                  serial: cam.serial,
                  name: cam.name,
                  encrypted: cam.encrypted,
                })
              }
            >
              Ver Cámara
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
