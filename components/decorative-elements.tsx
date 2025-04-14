"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function DecorativeElements() {
  return (
    <>
      {/* Top left blob */}
      <motion.div
        className="decorative-blob w-64 h-64 -top-20 -left-20"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
          borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 50% 50%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />

      {/* Bottom right circle */}
      <motion.div
        className="decorative-circle w-80 h-80 bottom-0 right-0"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />

      {/* Middle square */}
      <motion.div
        className="decorative-square w-40 h-40 top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: [45, 90, 45],
          scale: [1, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />

      {/* Small floating circles */}
      <motion.div
        className="decorative-circle w-16 h-16 top-1/4 right-1/4"
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />

      <motion.div
        className="decorative-circle w-10 h-10 bottom-1/4 left-1/3"
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
      />

      <motion.div
        className="decorative-blob w-20 h-20 top-1/3 right-1/3"
        animate={{
          scale: [1, 1.3, 1],
          borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 50% 50%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 2 }}
      />
    </>
  )
}

export function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <div
        className="parallax-layer parallax-layer-0 opacity-30"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
          background: "radial-gradient(circle at 20% 20%, rgba(255, 107, 129, 0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="parallax-layer parallax-layer-1 opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
          background: "radial-gradient(circle at 80% 40%, rgba(165, 94, 234, 0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="parallax-layer parallax-layer-2 opacity-25"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          background: "radial-gradient(circle at 40% 80%, rgba(112, 161, 255, 0.15) 0%, transparent 70%)",
        }}
      />
    </>
  )
}

export function ScrollAnimationObserver({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".fade-in-up, .fade-in-left, .fade-in-right")

    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return <>{children}</>
}

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isHoverable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("card-hover-effect")

      setIsHovering(isHoverable)
    }

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mouseover", updateHoverState)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mouseover", updateHoverState)
    }
  }, [])

  return (
    <div
      className={`custom-cursor ${isHovering ? "hover" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  )
}
