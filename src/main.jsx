import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./App";
import { Toaster } from "react-hot-toast";

function mount(id, dataKey) {
  const el = document.getElementById(id);
  if (!el) return;

  const props = (window)[dataKey] || {};

  ReactDOM.createRoot(el).render(
    <>
      <Toaster position="top-right" containerStyle={{
        zIndex: 10008,
      }} />
      <App {...props} />
    </>
  );
}

mount("editor-root", "__EDITOR_DATA__");
mount("editor-stats", "__EDITOR_STATS__");