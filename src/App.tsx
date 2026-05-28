import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfileInputPage from "./pages/ProfileInputPage";
import RecommendationPage from "./pages/RecommendationPage";
import TaskPage from "./pages/TaskPage";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfileInputPage />} />
      <Route path="/recommendations" element={<RecommendationPage />} />
      <Route path="/task/:jobId?" element={<TaskPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
