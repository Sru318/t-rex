import GameCanvas from "./components/GameCanvas"
import { Routes, Route } from "react-router-dom";
import DashBoard from "./components/DashBoard";
function App() {

  return (
    <>
      
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/gamecanvas" element={<GameCanvas/>} />
      </Routes>

    </>
  )
}

export default App
