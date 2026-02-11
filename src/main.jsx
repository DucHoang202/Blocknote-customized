import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const el = document.getElementById("editor-root");

if (el) {
  const props = window.__EDITOR_DATA__ || {};

  ReactDOM.createRoot(el).render(<App {...props} />);
}

const stats = document.getElementById("editor-stats");

if (stats) {
  const props = window.__EDITOR_STATS__ || {};

  ReactDOM.createRoot(stats).render(<App {...props} />);
}