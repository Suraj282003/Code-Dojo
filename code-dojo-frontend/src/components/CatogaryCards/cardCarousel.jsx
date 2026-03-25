"use client"

import { useState, useEffect } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../Navigation/NavBar"
import { useAuth } from "../../context/AuthContext"

// 🌿 Bamboo / Nature themed stacked carousel
const CardCarousel = () => {
  const [index, setIndex] = useState(0)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories")
      setCategories(res.data)
    }
    fetchCategories()
  }, [])

  const next = () => setIndex((i) => (i + 1) % categories.length)
  const prev = () => setIndex((i) => (i - 1 + categories.length) % categories.length)

  const startRun = async (categoryId) => {
    const res = await api.post("/challenge/start", {
        categoryId,
        userId: user.id,
      });
    navigate(`/challenge/${res.data.runId}`)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
          
    {/* 🥷 Navbar */}
    <div className="absolute top-0 left-0 w-full z-50">
      <Navbar />
    </div>

      {/* 🌿 Bamboo background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* 🎋 Bamboo pitcher overlay */}
      <img
        src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b"
        className="absolute bottom-0 right-10 h-[70%] opacity-30 pointer-events-none"
        alt="bamboo"
      />

      {/* 🍃 Floating leaves (denser & clearer) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute top-[-10%] text-green-200 opacity-60 animate-leaf"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              fontSize: `${14 + Math.random() * 18}px`,
            }}
          >
            🍃
          </span>
        ))}
      </div>

      {/* 🎴 Stacked cards */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="relative w-[420px] h-[520px]">
          {categories.map((cat, i) => {
            const offset = (i - index + categories.length) % categories.length
            if (offset > 2) return null

            const isFront = offset === 0
            const translateX = offset * 70
            const scale = isFront ? 1 : 0.95
            const opacity = isFront ? 1 : 0.8
            const zIndex = 50 - offset * 10

            return (
              <div
                key={cat._id}
                onClick={() => isFront && startRun(cat._id)}
                className="absolute left-0 top-0 transition-all duration-700 ease-out cursor-pointer"
                style={{
                  transform: `translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
              >
                <div className="h-[26rem] w-[20rem] rounded-3xl bg-gradient-to-br from-emerald-500/90 to-green-700/90 p-8 shadow-2xl border border-white/30 backdrop-blur">
                  <h2 className="mb-3 text-3xl font-bold text-white">
                    {cat.name}
                  </h2>
                  <p className="mb-6 text-white/80 text-sm">
                    {cat.description}
                  </p>

                  <div className="mt-auto">
                    <div className="h-2 w-full rounded-full bg-white/30">
                      <div className="h-full w-2/3 rounded-full bg-white" />
                    </div>
                    <p className="mt-3 text-xs text-white/70">
                      Time: {cat.initialTime}s
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ⬅️ ➡️ Controls */}
      <button
        onClick={prev}
        className="absolute left-10 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-4 text-white backdrop-blur hover:bg-white/30"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-10 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-4 text-white backdrop-blur hover:bg-white/30"
      >
        ›
      </button>

      {/* ✨ Animations */}
      <style>{`
        @keyframes leaf {
          0% { transform: translateY(-10%) rotate(0deg); opacity: 0 }
          10% { opacity: .6 }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0 }
        }
        .animate-leaf {
          animation: leaf 12s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default CardCarousel
