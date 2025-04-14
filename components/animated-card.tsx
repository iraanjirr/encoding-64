"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { CardProps } from "@/components/ui/card"

interface AnimatedCardProps extends CardProps {
  children: React.ReactNode
  hoverEffect?: boolean
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "none"
  delay?: number
}

export function AnimatedCard({
  children,
  hoverEffect = true,
  animation = "fadeIn",
  delay = 0,
  className,
  ...props
}: AnimatedCardProps) {
  const getInitialAnimation = () => {
    switch (animation) {
      case "slideUp":
        return { opacity: 0, y: 50 }
      case "slideLeft":
        return { opacity: 0, x: 50 }
      case "slideRight":
        return { opacity: 0, x: -50 }
      case "scale":
        return { opacity: 0, scale: 0.8 }
      case "none":
        return {}
      case "fadeIn":
      default:
        return { opacity: 0 }
    }
  }

  const getAnimateAnimation = () => {
    switch (animation) {
      case "slideUp":
        return { opacity: 1, y: 0 }
      case "slideLeft":
        return { opacity: 1, x: 0 }
      case "slideRight":
        return { opacity: 1, x: 0 }
      case "scale":
        return { opacity: 1, scale: 1 }
      case "none":
        return {}
      case "fadeIn":
      default:
        return { opacity: 1 }
    }
  }

  return (
    <motion.div
      initial={getInitialAnimation()}
      animate={getAnimateAnimation()}
      transition={{
        duration: 0.5,
        delay,
        type: animation === "scale" ? "spring" : "tween",
        stiffness: animation === "scale" ? 100 : undefined,
        damping: animation === "scale" ? 10 : undefined,
      }}
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
    >
      <Card className={`${hoverEffect ? "card-hover-effect" : ""} ${className || ""}`} {...props}>
        {children}
      </Card>
    </motion.div>
  )
}
