import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home";

import Wordle from "./pages/Wordle/Wordle";
import WordleLevelsPage from "./pages/Wordle/WordleLevelsPage";
import DailyWordle from "./pages/Wordle/DailyWordle"; // New import for Daily Challenge
import DailyLeaderboard from "./pages/Wordle/DailyLeaderboard";
import ChessGame from "./pages/ChessGame/ChessGame";
import SimonGame from "./pages/SimonGame/SimonGame";
import Flow2048 from "./pages/Flow2048/Flow2048";
import Gamelisting from "./pages/Gamelisting/Gamelisting";
import LoginRegister from "./pages/LoginRegister/LoginRegister";




// import NotFound from "./pages/NotFound"; // Recommended for 404 handling

export default function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
     
        <Route path="/login" element={<LoginRegister/>} />
      
           <Route path="/Games" element={<Gamelisting/>} />

        {/* Wordle Game Routes */}
        <Route path="/wordle" element={<Wordle />} />
        <Route path="/wordle-levels" element={<WordleLevelsPage />} />
        <Route path="/daily-wordle" element={<DailyWordle />} />
    <Route path="/daily-leaderboard" element={<DailyLeaderboard />} />
    {/* ChessGame Routes */}
 <Route path="/Chess-game" element={<ChessGame/>} />

 {/* FlowFree Game */}
 <Route path="/simon-game" element={<SimonGame/>}/>

<Route path="/flow2048" element={<Flow2048/>} />

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