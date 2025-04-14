"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export type NotificationType = "success" | "error" | "info" | "warning"

export type Notification = {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

// Singleton untuk menyimpan notifikasi
class NotificationManager {
  private static instance: NotificationManager
  private listeners: ((notifications: Notification[]) => void)[] = []
  private notifications: Notification[] = []

  private constructor() {}

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  public addNotification(notification: Omit<Notification, "id">): string {
    const id = Math.random().toString(36).substring(2, 9)
    const newNotification = { ...notification, id }
    this.notifications = [...this.notifications, newNotification]
    this.notifyListeners()

    // Auto remove after duration
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(id)
      }, notification.duration)
    }

    return id
  }

  public removeNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.notifyListeners()
  }

  public getNotifications(): Notification[] {
    return [...this.notifications]
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.notifications))
  }
}

// Fungsi helper untuk menambahkan notifikasi
export function notify(type: NotificationType, message: string, duration = 5000) {
  return NotificationManager.getInstance().addNotification({
    type,
    message,
    duration,
  })
}

// Komponen untuk menampilkan notifikasi
export function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const unsubscribe = NotificationManager.getInstance().subscribe(setNotifications)
    return unsubscribe
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-4 rounded-lg shadow-lg flex items-start gap-2 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                  ? "bg-red-500 text-white"
                  : notification.type === "warning"
                    ? "bg-yellow-500 text-white"
                    : "bg-primary text-primary-foreground"
            }`}
          >
            <div className="flex-1">{notification.message}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full bg-transparent hover:bg-white/20"
              onClick={() => NotificationManager.getInstance().removeNotification(notification.id)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Close</span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
