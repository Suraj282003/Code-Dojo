"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navigation/NavBar"

function getRankAura(rank) {
  switch (rank) {
    case "Bronze":
      return "bg-amber-700/40"
    case "Silver":
      return "bg-gray-400/40"
    case "Gold":
      return "bg-yellow-400/40"
    case "Platinum":
      return "bg-purple-500/40"
    case "Diamond":
      return "bg-blue-500/40"
    case "Master":
      return "bg-red-600/50"
    default:
      return "bg-white/20"
  }
}

function getRankStyle(rank) {
  switch (rank) {
    case "Bronze":
      return "border-amber-700 text-amber-400 shadow-[0_0_20px_rgba(180,83,9,0.8)]"
    case "Silver":
      return "border-gray-400 text-gray-300 shadow-[0_0_20px_rgba(200,200,200,0.8)]"
    case "Gold":
      return "border-yellow-500 text-yellow-400 shadow-[0_0_25px_rgba(255,215,0,0.9)]"
    case "Platinum":
      return "border-purple-500 text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.9)]"
    case "Diamond":
      return "border-blue-500 text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.9)]"
    case "Master":
      return "border-red-600 text-red-500 shadow-[0_0_30px_rgba(220,38,38,1)]"
    default:
      return "border-white text-white"
  }
}

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login")
    }
  }, [loading, isAuthenticated, navigate])

  if (loading || !user) return null

  const firstLetter = user.name?.charAt(0).toUpperCase()
  // const joinedDate = new Date(user.signUpAt).toLocaleDateString()

  return (
  <div className="relative min-h-screen bg-black text-white overflow-hidden perspective">

    <Navbar />

    {/* 🔴🔵 DIAGONAL CYBER BACKGROUND */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/50 via-black to-blue-900/50" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/30 blur-[180px] rounded-full rotate-12" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-blue-600/30 blur-[180px] rounded-full -rotate-12" />
    </div>

    <div className="relative z-10 pt-32 px-12">

      {/* MAIN SECTION */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* LEFT — AVATAR SECTION */}
<div className="flex-1 flex justify-center">
  <div className="relative w-[520px] h-[420px] flex items-center justify-center">

    {/* 🔥 Rank Aura Behind Badge */}
    <div
      className={`absolute w-[420px] h-[420px] rounded-full blur-[120px] ${getRankAura(user.rank)}`}
    />

    {/* Subtle rotating cyber glow */}
    <div className="absolute w-[450px] h-[450px] rounded-full border border-white/10 animate-slow-spin" />

    {/* Badge Image */}
    <img
      src="/Image/profile-badge.png"
      alt="Warrior Badge"
      className="relative w-full h-full object-contain"
    />

    {/* Center Letter */}
    <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-semibold text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]">
      {firstLetter}
    </div>

    {/* Name in Banner */}
    <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 text-3xl font-semibold italic tracking-wide">
      {user.name}
    </div>

  </div>
</div>
{/* RIGHT — 3D RATING WITH LIGHT SWEEP */}
<div className="flex-1 flex flex-col items-center">

  <div className="relative w-80 h-80 flex items-center justify-center perspective overflow-hidden">

    {/* Background Glow */}
    <div className="absolute w-60 h-60 bg-blue-500/20 blur-3xl rounded-full" />

    {/* Rotating Number Container */}
    <div className="relative text-7xl font-black text-white animate-number-rotate drop-shadow-[0_0_40px_rgba(0,200,255,1)]">

      {user.rating}

      {/* 🔥 Light Sweep Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="light-sweep" />
      </div>

    </div>

  </div>

  <p className="mt-6 text-gray-400 text-lg">ELO Rating</p>

  <div className={`mt-6 px-8 py-3 rounded-full font-semibold border ${getRankStyle(user.rank)}`}>
    {user.rank}
  </div>

</div>
      </div>

      {/* STATS SECTION */}
        <div className="mt-24 max-w-6xl mx-auto">

          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-widest bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
              BATTLE STATISTICS
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto mt-4 rounded-full" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard title="Wins" value={user.wins} color="text-green-400" glow="shadow-green-500/30" />
            <StatCard title="Losses" value={user.losses} color="text-red-400" glow="shadow-red-500/30" />
            <StatCard title="Draws" value={user.draws} color="text-yellow-400" glow="shadow-yellow-500/30" />
            <StatCard title="Total Matches" value={user.totalMatches} color="text-blue-400" glow="shadow-blue-500/30" />
          </div>

          {/* Win Rate Bar */}
          <WinRateBar wins={user.wins} total={user.totalMatches} />

          {/* Arena CTA */}
          <ArenaBlock />
        </div>

    </div>

    {/* 3D + Animations */}
    <style>{`
      .perspective {
  perspective: 1000px;
}

/* 3D Rotation */
@keyframes numberRotate {
  0%   { transform: rotateY(-15deg); }
  50%  { transform: rotateY(15deg); }
  100% { transform: rotateY(-15deg); }
}

.animate-number-rotate {
  animation: numberRotate 6s ease-in-out infinite;
  transform-style: preserve-3d;
}

/* 🔥 Vertical Light Sweep */
@keyframes sweepUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  30% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120%);
    opacity: 0;
  }
}

.light-sweep {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60%;
  background: linear-gradient(
    to top,
    rgba(0, 200, 255, 0.8),
    rgba(0, 200, 255, 0.4),
    transparent
  );
  filter: blur(12px);
  animation: sweepUp 3s linear infinite;
}
  @keyframes slowSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-slow-spin {
  animation: slowSpin 20s linear infinite;
}
    `}
    
    </style>

  </div>
)
}
function StatCard({ title, value, color, glow }) {
  return (
    <div className={`relative bg-gradient-to-br from-neutral-900 to-black border border-white/10 rounded-2xl p-6 text-center shadow-xl hover:scale-105 transition duration-300 hover:${glow}`}>

      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />

      <p className="text-gray-400 text-sm tracking-wide">{title}</p>
      <p className={`mt-3 text-3xl font-black ${color} drop-shadow-lg`}>
        {value}
      </p>
    </div>
  )
}
function WinRateBar({ wins, total }) {
  const percentage = total > 0 ? Math.round((wins / total) * 100) : 0

  return (
    <div className="mt-16 max-w-3xl mx-auto">

      <div className="flex justify-between mb-2 text-sm text-gray-400">
        <span>Win Rate</span>
        <span>{percentage}%</span>
      </div>

      <div className="w-full h-4 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  )
}

function ArenaBlock() {
  const navigate = useNavigate()

  return (
    <div className="mt-24 relative">

      <div className="relative bg-gradient-to-r from-red-600/20 to-blue-600/20 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-xl overflow-hidden">

        {/* Glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/30 blur-3xl rounded-full" />

        <h3 className="text-3xl font-bold tracking-wider">
          READY FOR YOUR NEXT BATTLE?
        </h3>

        <p className="text-gray-400 mt-4">
          Step back into the arena and prove your dominance.
        </p>

        <button
          onClick={() => navigate("/arena")}
          className="mt-8 px-12 py-4 text-lg font-bold rounded-full bg-gradient-to-r from-red-500 to-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(255,0,0,0.6)]"
        >
          ⚔ ENTER ARENA
        </button>

      </div>
    </div>
  )
}