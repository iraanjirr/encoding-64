"use client"

import { motion } from "framer-motion"

interface AnimatedTextProps {
  text: string
  className?: string
  animation?: "fadeIn" | "typewriter" | "wordByWord" | "letterByLetter" | "none"
  delay?: number
  duration?: number
  type?: "heading" | "paragraph" | "span"
  textEffect?: "gradient" | "glow" | "gradientPurple" | "gradientBlue" | "glowPurple" | "glowBlue" | "none"
}

export function AnimatedText({
  text,
  className = "",
  animation = "fadeIn",
  delay = 0,
  duration = 0.5,
  type = "span",
  textEffect = "none",
}: AnimatedTextProps) {
  const getTextEffectClass = () => {
    switch (textEffect) {
      case "gradient":
        return "gradient-text"
      case "gradientPurple":
        return "gradient-text-purple"
      case "gradientBlue":
        return "gradient-text-blue"
      case "glow":
        return "glow-text"
      case "glowPurple":
        return "glow-text-purple"
      case "glowBlue":
        return "glow-text-blue"
      case "none":
      default:
        return ""
    }
  }

  // Simple fade in animation
  if (animation === "fadeIn" || animation === "none") {
    const Component = type === "heading" ? "h1" : type === "paragraph" ? "p" : "span"

    return (
      <motion.div
        initial={animation === "none" ? {} : { opacity: 0 }}
        animate={animation === "none" ? {} : { opacity: 1 }}
        transition={{ duration, delay }}
      >
        <Component className={`${getTextEffectClass()} ${className}`}>{text}</Component>
      </motion.div>
    )
  }

  // Typewriter effect
  if (animation === "typewriter") {
    const Component = type === "heading" ? "h1" : type === "paragraph" ? "p" : "span"

    return (
      <Component className={`${getTextEffectClass()} ${className}`}>
        <motion.span
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: duration * 2, delay, ease: "easeInOut" }}
          style={{ display: "inline-block", whiteSpace: "nowrap", overflow: "hidden" }}
        >
          {text}
        </motion.span>
      </Component>
    )
  }

  // Word by word animation
  if (animation === "wordByWord") {
    const words = text.split(" ")
    const Component = type === "heading" ? "h1" : type === "paragraph" ? "p" : "span"

    return (
      <Component className={`${className}`}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className={`inline-block ${getTextEffectClass()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay: delay + i * 0.1 }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </Component>
    )
  }

  // Letter by letter animation
  if (animation === "letterByLetter") {
    const letters = text.split("")
    const Component = type === "heading" ? "h1" : type === "paragraph" ? "p" : "span"

    return (
      <Component className={`${className}`}>
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            className={`inline-block ${getTextEffectClass()}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration / 2, delay: delay + i * 0.03 }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </Component>
    )
  }

  return null
}
