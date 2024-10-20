"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface TimelineItem {
  id: number
  content: string
  checked: boolean
  connected: boolean
}

export default function WeeklyObjectives() {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    { id: 1, content: "Start project", checked: false, connected: false },
    { id: 2, content: "Design mockups", checked: false, connected: false },
    { id: 3, content: "Develop frontend", checked: false, connected: false },
    { id: 4, content: "Implement backend", checked: false, connected: false },
    { id: 5, content: "Testing phase", checked: false, connected: false },
    { id: 6, content: "Deploy to production", checked: false, connected: false },
  ])

  const handleCheckboxChange = (id: number) => {
    setTimelineItems(prev => {
      const newItems = [...prev]
      const index = newItems.findIndex(item => item.id === id)
      newItems[index].checked = !newItems[index].checked

      // Update connections
      for (let i = 0; i < newItems.length - 1; i++) {
        newItems[i].connected = newItems[i].checked && newItems[i + 1].checked
      }

      return newItems
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {timelineItems.map((item, index) => (
            <div key={item.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 border-2 rounded-full transition-colors duration-300 ${
                  item.checked ? 'bg-primary border-primary' : 'border-primary bg-background'
                }`} />
                {index !== timelineItems.length - 1 && (
                  <div className="w-0.5 h-full bg-primary relative">
                    <div 
                      className={`absolute top-0 left-0 w-full transition-all duration-300 ${
                        item.connected ? 'h-full bg-primary' : 'h-0 bg-transparent'
                      }`} 
                    />
                  </div>
                )}
              </div>
              <div className="flex-grow pt-0.5">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`checkbox-${item.id}`}
                    checked={item.checked}
                    onCheckedChange={() => handleCheckboxChange(item.id)}
                  />
                  <label
                    htmlFor={`checkbox-${item.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.content}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}