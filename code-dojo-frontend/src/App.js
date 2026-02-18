import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Survival from "./Pages/survival"
import Signup from "./Pages/Signup"
import Login from "./Pages/Login"
import Goodbye from "./components/ByePage/Goodbye";
import Arena from "./Pages/Arena"
import ArenaHome from "./Pages/ArenaHome"
import WaitingRoom from "./Pages/WaitingRoom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/challenge/:runId" element={<Survival />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/goodbye" element={<Goodbye />} />
        <Route path="/arena" element={<ArenaHome />} />
        <Route path="/arena/fight" element={<Arena />} />
        <Route path="/arena/waiting" element={<WaitingRoom />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
