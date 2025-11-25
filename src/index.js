import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Player from "./Player";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <h1 align="center">Intentando conectar a la Api de Azviz</h1>
    <Player />
  </React.StrictMode>
);
