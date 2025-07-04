import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
<<<<<<< HEAD
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wordle from "./pages/Wordle";
import WordleLevelsPage from "./pages/Wordle/WordleLevelsPage";
import DailyWordle from "./pages/DailyWordle";
import WordleInstruction from "./pages/WordleInstruction"
import ChessInstructions from "./pages/Chess/ChessInstruction";
// import FlowFreeApp from "./pages/FlowFree/App";
import SimonGame from "./pages/Simon/SimonGame";
import SimonInstruction from "./pages/Simon/SimonInstruction";
import Game2048Instructions from "./pages/2048/2048Instructions";

=======

import Home from "./pages/Home/Home";

import Wordle from "./pages/Wordle/Wordle";
import WordleLevelsPage from "./pages/Wordle/WordleLevelsPage";
import DailyWordle from "./pages/Wordle/DailyWordle"; // New import for Daily Challenge
import DailyLeaderboard from "./pages/Wordle/DailyLeaderboard";
import ChessGame from "./pages/ChessGame/ChessGame";
// import SimonGame from "./pages/SimonGame/SimonGame";
import Flow2048 from "./pages/Flow2048/Flow2048";
import Gamelisting from "./pages/Gamelisting/Gamelisting";
import LoginRegister from "./pages/LoginRegister/LoginRegister";




// import NotFound from "./pages/NotFound"; // Recommended for 404 handling
>>>>>>> f2ef577c6b881e157a2acfc76638506b1b044130

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<Home />} />
<<<<<<< HEAD
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wordle" element={<Wordle />} />
        <Route path="/wordle-levels" element={<WordleLevelsPage />} />
        <Route path="/daily-wordle" element={<DailyWordle />} />
        <Route path="/wordleinstruction" element={<WordleInstruction />}/> 
        <Route path="/chessinstruction" element={<ChessInstructions />}/> 
        <Route path="/2048instruction" element={<Game2048Instructions />}/> 

        {/* New Route for Flow Free */}
        {/* <Route path="/flowfree" element={<FlowFreeApp />} /> */}
        <Route path="/simon" element={<SimonGame />}/> 
        <Route path="/simoninstruction" element={<SimonInstruction />}/> 
       

        {/* Redirects */}
=======
     
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
 {/* <Route path="/simon-game" element={<SimonGame/>}/> */}

<Route path="/flow2048" element={<Flow2048/>} />

        {/* Legacy Route Redirects */}

>>>>>>> f2ef577c6b881e157a2acfc76638506b1b044130
        <Route path="/play" element={<Navigate to="/wordle" replace />} />
        <Route path="/level" element={<Navigate to="/wordle-levels" replace />} />
      </Routes>
    </BrowserRouter>
  );
}