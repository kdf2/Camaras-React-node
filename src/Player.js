import { useEffect, useRef, useState } from "react";
import EZUIKit from "ezuikit-js";

export default function Player() {
  const [serial] = useState("BD3569899");
  const [token, setToken] = useState("at.761eu9142l14twahdevu0ixq3zz5quhc-2dp564gw2h-0t3kt8i-r7putdqbx");
  const [init, setInit] = useState(false);

  const playerRef = useRef(null);

 const url = `ezopen://open.ezviz.com/${serial}/1.hd.live`;

  useEffect(() => {
    if (!init) return;

    // destruir instancia anterior
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    // inicializar EZUIKitPlayer
    playerRef.current = new EZUIKit.EZUIKitPlayer({
      id: "player-ezviz",
      accessToken: token,
      url: url,
      template: "pcLive",
      audio: 1,
      env: {
        domain: "https://iusopen.ezvizlife.com",
      },
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [init]);

  const startPlayer = () => {
    if (!token) {
      alert("Debes ingresar tu accessToken primero.");
      return;
    }
    setInit(true);
  };

  return (
    <div style={{ padding: 20 }}>
      {!init ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="text"
            placeholder="AccessToken de EZVIZ"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <button onClick={startPlayer}>Iniciar Reproducción</button>
        </div>
      ) : (
        <div id="player-ezviz" style={{ width: "100%", height: 400, background: "#000" }}></div>
      )}
    </div>
  );
}
