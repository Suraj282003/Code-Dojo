import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Survival from "./Pages/survival"
import Signup from "./Pages/Signup"
import Login from "./Pages/Login"
import Goodbye from "./components/ByePage/Goodbye";
import Arena from "./Pages/Arena"
import ArenaHome from "./Pages/ArenaHome"
import WaitingRoom from "./Pages/WaitingRoom"
import BattelResult from "./Pages/BattleResult"
import Catagories from "./Pages/catogories"
import Profile from "./Pages/Profile"
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminGenerate from "./Pages/AdminGenerate";
import AdminProblems from "./Pages/AdminProblems";
import AdminCategories from "./Pages/AdminCategories";
import AdminUsers from "./Pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catogaries" element={<Catagories />} />
        <Route path="/challenge/:runId" element={<Survival />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/goodbye" element={<Goodbye />} />
        <Route path="/arena" element={<ArenaHome />} />
        <Route path="/arena/fight" element={<Arena />} />
        <Route path="/arena/waiting" element={<WaitingRoom />} />
        <Route path="/battle-result" element={<BattelResult />} />
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/generate" element={<AdminLayout><AdminGenerate /></AdminLayout>} />
        <Route path="/admin/problems" element={<AdminLayout><AdminProblems /></AdminLayout>} />
        <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
        <Route
          path="/admin/users"
          element={<AdminLayout><AdminUsers /></AdminLayout>}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
