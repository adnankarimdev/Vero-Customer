import React from 'react'

export default function RecordingLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-foreground rounded-full animate-bounce-1"></div>
        <div className="w-3 h-3 bg-foreground rounded-full animate-bounce-2"></div>
        <div className="w-3 h-3 bg-foreground rounded-full animate-bounce-3"></div>
      </div>
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% { 
            transform: translateY(-10px) scale(0.9);
            opacity: 0.7;
          }
        }
        .animate-bounce-1 {
          animation: bounce 1.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) 0s;
        }
        .animate-bounce-2 {
          animation: bounce 1.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.2s;
        }
        .animate-bounce-3 {
          animation: bounce 1.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.4s;
        }
      `}</style>
    </div>
  )
}