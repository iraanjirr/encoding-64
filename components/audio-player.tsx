"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  audioSrc: string
}

export function AudioPlayer({ audioSrc }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)

  // Initialize audio context and analyser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      const bufferLength = analyserRef.current.frequencyBinCount
      dataArrayRef.current = new Uint8Array(bufferLength)

      if (audioRef.current) {
        const source = audioContextRef.current.createMediaElementSource(audioRef.current)
        source.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
      }
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Draw spectrum visualization
  const drawSpectrum = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    analyserRef.current.getByteFrequencyData(dataArrayRef.current)

    ctx.clearRect(0, 0, width, height)

    const barWidth = (width / dataArrayRef.current.length) * 2.5
    let barHeight
    let x = 0

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "rgba(255, 107, 129, 0.8)")
    gradient.addColorStop(0.5, "rgba(165, 94, 234, 0.8)")
    gradient.addColorStop(1, "rgba(112, 161, 255, 0.8)")

    for (let i = 0; i < dataArrayRef.current.length; i++) {
      barHeight = (dataArrayRef.current[i] / 255) * height * 0.8

      ctx.fillStyle = gradient
      ctx.fillRect(x, height - barHeight, barWidth, barHeight)

      x += barWidth + 1
    }

    animationRef.current = requestAnimationFrame(drawSpectrum)
  }

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
      // Resume audio context if it was suspended
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume()
      }
    }
    setIsPlaying(!isPlaying)
  }

  // Handle time update
  useEffect(() => {
    if (!audioRef.current) return

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    }

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate)
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate)
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  // Start/stop visualization based on play state
  useEffect(() => {
    if (isPlaying) {
      drawSpectrum()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isPlaying])

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Handle seek
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      className={`fixed z-30 ${isExpanded ? "bottom-4 right-4 w-80" : "bottom-4 right-4 w-16"} bg-card rounded-lg shadow-lg border border-border overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio ref={audioRef} src={audioSrc} crossOrigin="anonymous" />

      <div className="flex items-center p-2">
        {isExpanded ? (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="text-xs font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
                <div className="w-16">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    className="h-1"
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleExpanded}>
                  <Minimize2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="px-2">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="h-1"
              />
            </div>
            <div className="mt-2 h-24 w-full">
              <canvas ref={canvasRef} width={320} height={96} className="w-full h-full" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleExpanded}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function AudioPlayerButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isOpen ? (
        <AudioPlayer audioSrc="/music/background-music.mp3" />
      ) : (
        <motion.div
          className="fixed bottom-4 right-4 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Button
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg"
            onClick={() => setIsOpen(true)}
          >
            <Music className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </>
  )
}
