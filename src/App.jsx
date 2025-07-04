import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<Home />} />
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
        <Route path="/play" element={<Navigate to="/wordle" replace />} />
        <Route path="/level" element={<Navigate to="/wordle-levels" replace />} />
      </Routes>
    </BrowserRouter>
  );
}