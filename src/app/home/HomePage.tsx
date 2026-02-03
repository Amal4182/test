'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence } from 'framer-motion'
import { Heart, User, Menu, LogOut, Users, MessageCircle, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "next-auth/react"
import PartnerCard from "./Partnercard"
import axios from 'axios'
import { Partner } from '@/types/partner'
import { ResponseData } from "@/types/responseData"
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();

  const normalizePhotoSrc = (src?: string) => {
    if (!src) return "/placeholder.svg"
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src
    return `/${src}`
  }

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get<ResponseData>("/api/users");
        setPartners(response.data.data);
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const nextPartner = () => {
    setDirection('left')
    setCurrentPartnerIndex((prevIndex) => (prevIndex + 1) % partners.length)
  }

  const prevPartner = () => {
    setDirection('right')
    setCurrentPartnerIndex((prevIndex) => (prevIndex - 1 + partners.length) % partners.length)
  }

  const handleSelectPartner = (partner: Partner) => {
    const index = partners.findIndex(p => p.email === partner.email)
    if (index !== -1) {
      setCurrentPartnerIndex(index)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute top-40 -right-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 px-4 pt-6 pb-4 md:px-10">
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <Link href="/home" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">Hey DUK</span>
            <Heart className="text-pink-500 w-5 h-5" />
          </Link>
          <nav className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => router.push("/updateprofile")}
            >
              <User className="mr-2" /> Profile
            </Button>
            <Button
              className="bg-white/10 hover:bg-white/20 text-white"
              onClick={() => signOut({ redirectTo: "/login" })}
            >
              <LogOut className="mr-2" /> Logout
            </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white/80">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-zinc-950 text-white">
              <nav className="flex flex-col space-y-4 mt-6">
                <Button variant="ghost" onClick={() => router.push("/updateprofile")}>
                  <User className="mr-2" /> Profile
                </Button>
                <Button onClick={() => signOut({ redirectTo: "/login" })}>
                  <LogOut className="mr-2" /> Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 pb-44 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
          <section className="order-2 lg:order-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-semibold">Discover</h2>
                  <p className="text-sm text-white/60">Opposite gender profiles nearby</p>
                </div>
                <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
                  {partners.length} nearby
                </span>
              </div>
              {isLoading ? (
                <div className="text-sm text-white/60">Loading profiles...</div>
              ) : partners.length === 0 ? (
                <div className="text-sm text-white/60">No profiles available yet.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {partners.map((partner, index) => (
                    <button
                      key={partner.email}
                      onClick={() => handleSelectPartner(partner)}
                      className={`group relative overflow-hidden rounded-2xl border transition ${
                        index === currentPartnerIndex
                          ? "border-pink-500 ring-2 ring-pink-500/50"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="relative h-20 w-full sm:h-24">
                        <Image
                          src={normalizePhotoSrc(partner.photos?.[0])}
                          alt={`${partner.name} preview`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="px-2 py-2 text-left bg-black/60">
                        <p className="text-xs font-semibold text-white truncate">{partner.name}</p>
                        <p className="text-[10px] text-white/60 truncate">{partner.course}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="mx-auto max-w-md">
              <div className="mb-4 flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center backdrop-blur sm:flex-row sm:justify-between">
                <span className="text-sm ml-3 text-white/75">See who likes you</span>
                <button
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-black shadow-md shadow-pink-500/20"
                  onClick={() => router.push("/likes")}
                >
                  <i className="ri-poker-hearts-fill text-base"></i>
                  Likes
                </button>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                {partners.length > 0 && (
                  <PartnerCard
                    key={partners[currentPartnerIndex].email}
                    partner={partners[currentPartnerIndex]}
                    onNext={nextPartner}
                    onPrev={prevPartner}
                  />
                )}
              </AnimatePresence>
              {!isLoading && partners.length === 0 && (
                <div className="mt-6 text-center text-sm text-white/60">
                  No matches found yet. Check back later or update your profile preferences.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <nav className="fixed bottom-3 left-1/2 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
        <div
          className="grid grid-cols-3 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/80 shadow-2xl shadow-black/40 backdrop-blur-xl"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <button
            onClick={() => router.push("/home")}
            className="flex flex-col items-center gap-1 text-white"
          >
            <Users className="h-5 w-5" />
            People
          </button>
          <button
            onClick={() => router.push("/chats")}
            className="flex flex-col items-center gap-1 hover:text-white"
          >
            <MessageCircle className="h-5 w-5" />
            Chats
          </button>
          <button
            onClick={() => router.push("/confessions")}
            className="flex flex-col items-center gap-1 hover:text-white"
          >
            <Activity className="h-5 w-5" />
            Confess
          </button>
        </div>
      </nav>

    </div>
  )
}
