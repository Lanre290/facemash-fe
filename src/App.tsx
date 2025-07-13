import { Routes, Route, Navigate } from "react-router-dom";
import Facemash from "./Pages/FaceMash";
import AuthPage from "./Pages/Auth";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Facemash />} />
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}
