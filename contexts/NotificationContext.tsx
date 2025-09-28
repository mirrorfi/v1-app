'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Notification } from '@/components/ui/notification'

interface NotificationData {
  title: string
  message: string
  txId?: string
  type?: "success" | "error" | "info"
}

interface NotificationContextType {
  showNotification: (data: NotificationData) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    show: boolean
    title: string
    message: string
    txId?: string
    type?: "success" | "error" | "info"
  }>({
    show: false,
    title: "",
    message: "",
  })

  const showNotification = (data: NotificationData) => {
    setNotification({
      show: true,
      ...data
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }))
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        show={notification.show}
        onClose={hideNotification}
        title={notification.title}
        message={notification.message}
        txId={notification.txId}
        type={notification.type}
      />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
