import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import axios from "axios";
import { AuthProvider } from "./contexts/authContext.tsx";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
