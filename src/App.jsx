import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wordle from "./pages/Wordle";
import WordleLevelsPage from "./pages/Wordle/WordleLevelsPage";
import DailyWordle from "./pages/DailyWordle"; // New import for Daily Challenge
// import NotFound from "./pages/NotFound"; // Recommended for 404 handling

export default function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Wordle Game Routes */}
        <Route path="/wordle" element={<Wordle />} />
        <Route path="/wordle-levels" element={<WordleLevelsPage />} />
        <Route path="/daily-wordle" element={<DailyWordle />} />

        {/* Legacy Route Redirects */}
        <Route path="/play" element={<Navigate to="/wordle" replace />} />
        <Route path="/level" element={<Navigate to="/wordle-levels" replace />} />

        {/* Error Handling */}
        {/* <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}