"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
  hoverEffect?: "shine" | "scale" | "bounce" | "none"
}

export function AnimatedButton({ children, hoverEffect = "shine", className, ...props }: AnimatedButtonProps) {
  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case "scale":
        return {
          scale: 1.05,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }
      case "bounce":
        return {
          y: -5,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }
      case "none":
        return {}
      case "shine":
      default:
        return {}
    }
  }

  return (
    <motion.div whileHover={getHoverAnimation()} whileTap={{ scale: 0.98 }}>
      <Button className={`${hoverEffect === "shine" ? "btn-hover-effect" : ""} ${className || ""}`} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}
