import { useEffect } from "react";
import EZUIKit from "ezuikit-js";
import "./Player.css"; // 🔹 Importamos el CSS

export default function Player({ camera, onBack }) {
  useEffect(() => {
    let player = null;

    async function start() {
      const r = await fetch("http://localhost:3000/token");
      const data = await r.json();
      const token = data.data.accessToken;

      const url = `ezopen://open.ezviz.com/${camera.serial}/1.hd.live`;

      player = new EZUIKit.EZUIKitPlayer({
        id: "player-ezviz",
        accessToken: token,
        url: url,
        template: "pcLive",
        audio: 1,
        language: "en",
        env: { domain: "https://iusopen.ezvizlife.com" },
      });
    }

    start();

    return () => {
      if (player) player.destroy();
    };
  }, [camera]);

  return (
    <div>
      <div className="player-header">
        <button className="player-back-btn" onClick={onBack}>
          ← Regresar
        </button>
        <h2 className="player-title">{camera.name}</h2>
      </div>

      <div
        id="player-ezviz"
        style={{ width: "100%", height:550, background: "black" }}
      ></div>
    </div>
  );
}
