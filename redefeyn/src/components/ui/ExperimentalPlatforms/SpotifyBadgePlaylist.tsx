'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X, Music } from "lucide-react"

const defaultCategories = [
  {
    name: "Customer Service",
    badges: [
      "Friendly staff",
      "Quick service",
      "Attentive",
      "Knowledgeable",
      "Accommodating",
    ],
  },
  {
    name: "Ambiance and Environment",
    badges: [
      "Cozy atmosphere",
      "Great view",
      "Convenient parking",
      "Quiet area",
      "Outdoor seating",
    ],
  },
  {
    name: "Quality of Items",
    badges: [
      "Rich flavor",
      "Perfect temperature",
      "Great variety",
      "Ethically sourced",
      "Unique blends",
    ],
  },
]

export default function Component() {
  const [playlist, setPlaylist] = useState<string[]>([])

  const addToPlaylist = (badge: string) => {
    if (!playlist.includes(badge)) {
      setPlaylist([...playlist, badge])
    }
  }

  const removeFromPlaylist = (badge: string) => {
    setPlaylist(playlist.filter(item => item !== badge))
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-[#121212] text-white min-h-screen">
      <div className="w-full md:w-2/3 space-y-6">
        {defaultCategories.map((category, index) => (
          <Card key={index} className="bg-[#181818] border-none">
            <CardHeader>
              <CardTitle className="text-white">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.badges.map((badge, badgeIndex) => (
                  <Button
                    key={badgeIndex}
                    variant="outline"
                    size="sm"
                    onClick={() => addToPlaylist(badge)}
                    className="bg-[#282828] text-white hover:bg-[#1DB954] hover:text-black border-none"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {badge}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="w-full md:w-1/3">
        <Card className="h-full bg-[#181818] border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Music className="h-5 w-5 text-[#1DB954]" />
              Your Badge Playlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {playlist.length === 0 ? (
                <p className="text-center text-[#B3B3B3]">Your playlist is empty. Add some badges!</p>
              ) : (
                <ul className="space-y-2">
                  {playlist.map((badge, index) => (
                    <li key={index} className="flex items-center justify-between bg-[#1DB954] text-black p-2 rounded-md">
                      <span>{badge}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromPlaylist(badge)}
                        className="h-8 w-8 p-0 text-black hover:text-black hover:bg-[#1ed760]"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}