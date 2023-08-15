import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "@/components/App";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/lib/firebase.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
