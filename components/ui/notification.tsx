'use client'

import { useState, useEffect } from "react"
import { X, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"

interface NotificationProps {
  show: boolean
  onClose: () => void
  title: string
  message: string
  txId?: string
  type?: "success" | "error" | "info"
}

export function Notification({ show, onClose, title, message, txId, type = "success" }: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 8000) // Auto-close after 8 seconds
      
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const getSolscanUrl = (txId: string) => {
    return `https://solscan.io/tx/${txId}`
  }

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/30 backdrop-blur-sm"
      case "error":
        return "bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/30 backdrop-blur-sm"
      default:
        return "bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30 backdrop-blur-sm"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      default:
        return <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
    }
  }

  const getTitleColor = () => {
    switch (type) {
      case "success":
        return "text-green-300"
      case "error":
        return "text-red-300"
      default:
        return "text-blue-300"
    }
  }

  const getLinkColor = () => {
    switch (type) {
      case "success":
        return "text-green-400 hover:text-green-300"
      case "error":
        return "text-red-400 hover:text-red-300"
      default:
        return "text-blue-400 hover:text-blue-300"
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className={`max-w-sm rounded-lg border shadow-lg p-4 ${getTypeStyles()}`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className={`font-semibold text-base ${getTitleColor()}`}>{title}</h4>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors ml-2 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">{message}</p>
            {txId && (
              <div className="space-y-2">
                <div className="text-xs text-gray-400">
                  Transaction ID: <span className="font-mono text-gray-300">{txId.slice(0, 8)}...{txId.slice(-8)}</span>
                </div>
                <a
                  href={getSolscanUrl(txId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${getLinkColor()}`}
                >
                  View on Solscan
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
