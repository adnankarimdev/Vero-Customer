'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const colors = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Orange', value: '#FF7F00' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Purple', value: '#8B00FF' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Teal', value: '#008080' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Brown', value: '#A52A2A' },
  { name: 'Gray', value: '#808080' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' }
]

const eyes = [
  { name: 'None', value: 'none' },
  { name: 'Circle', value: 'circle' },
  { name: 'Oval', value: 'oval' },
  { name: 'Square', value: 'square' },
  { name: 'Almond', value: 'almond' },
  { name: 'Wink', value: 'wink' },
  { name: 'Lashes', value: 'lashes' },
  { name: 'Sleepy', value: 'sleepy' },
  { name: 'Surprised', value: 'surprised' },
  { name: 'Sunglasses', value: 'sunglasses' }
]

const mouths = [
  { name: 'None', value: 'none' },
  { name: 'Smile', value: 'smile' },
  { name: 'Line', value: 'line' },
  { name: 'Open', value: 'open' },
  { name: 'Smirk', value: 'smirk' },
  { name: 'Surprised', value: 'surprised' },
  { name: 'Tongue', value: 'tongue' },
  { name: 'Teeth', value: 'teeth' },
  { name: 'Frown', value: 'frown' },
  { name: 'Cute', value: 'cute' }
]

const Eyes = ({ style }:any) => {
  const eyeMap = {
    none: null,
    circle: <><circle cx="35" cy="45" r="5" /><circle cx="65" cy="45" r="5" /></>,
    oval: <><ellipse cx="35" cy="45" rx="6" ry="4" /><ellipse cx="65" cy="45" rx="6" ry="4" /></>,
    square: <><rect x="30" y="40" width="10" height="10" /><rect x="60" y="40" width="10" height="10" /></>,
    almond: <><path d="M30 45 Q35 35 40 45 Q35 55 30 45" /><path d="M60 45 Q65 35 70 45 Q65 55 60 45" /></>,
    wink: <><circle cx="35" cy="45" r="5" /><path d="M60 45 Q65 40 70 45" /></>,
    lashes: <>
      <circle cx="35" cy="45" r="5" />
      <circle cx="65" cy="45" r="5" />
      <path d="M30 40 L25 35 M35 38 L30 33 M40 40 L45 35" />
      <path d="M60 40 L55 35 M65 38 L60 33 M70 40 L75 35" />
    </>,
    sleepy: <><path d="M30 50 Q35 45 40 50" /><path d="M60 50 Q65 45 70 50" /></>,
    surprised: <><circle cx="35" cy="45" r="7" /><circle cx="65" cy="45" r="7" /></>,
    sunglasses: <>
      <path d="M25 45 L45 45 Q50 45 55 45 L75 45" fill="none" stroke="black" strokeWidth="3" />
      <rect x="25" y="40" width="20" height="10" rx="5" fill="black" />
      <rect x="55" y="40" width="20" height="10" rx="5" fill="black" />
    </>
  }
  return eyeMap[style as keyof typeof eyeMap]
}

const Mouth = ({ style }:any) => {
  const mouthMap = {
    none: null,
    smile: <path d="M30 70 Q50 85 70 70" fill="none" stroke="#000000" strokeWidth="3" />,
    line: <line x1="30" y1="70" x2="70" y2="70" stroke="#000000" strokeWidth="3" />,
    open: <ellipse cx="50" cy="70" rx="15" ry="10" />,
    smirk: <path d="M30 70 Q50 75 70 65" fill="none" stroke="#000000" strokeWidth="3" />,
    surprised: <circle cx="50" cy="70" r="10" />,
    tongue: <>
      <path d="M30 70 Q50 85 70 70" fill="none" stroke="#000000" strokeWidth="3" />
      <path d="M40 75 Q50 85 60 75" fill="red" />
    </>,
    teeth: <>
      <path d="M30 70 Q50 85 70 70" fill="none" stroke="#000000" strokeWidth="3" />
      <path d="M35 70 L65 70" stroke="#000000" strokeWidth="2" />
    </>,
    frown: <path d="M30 75 Q50 65 70 75" fill="none" stroke="#000000" strokeWidth="3" />,
    cute: <path d="M40 70 Q50 80 60 70" fill="none" stroke="#000000" strokeWidth="3" />
  }
  return mouthMap[style as keyof typeof mouthMap]
}

export default function AvatarCreator() {
  const [color, setColor] = useState(colors[colors.length-1].value)
  const [eyeStyle, setEyeStyle] = useState(eyes[1].value)
  const [mouthStyle, setMouthStyle] = useState(mouths[1].value)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Vero Avatar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* <div className="space-y-2">
          <Label htmlFor="background-color">Background Color</Label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger id="background-color">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: c.value }}
                    />
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <div className="space-y-2">
          <Label htmlFor="eye-style">Eyes</Label>
          <Select value={eyeStyle} onValueChange={setEyeStyle}>
            <SelectTrigger id="eye-style">
              <SelectValue placeholder="Select eye style" />
            </SelectTrigger>
            <SelectContent>
              {eyes.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mouth-style">Mouth</Label>
          <Select value={mouthStyle} onValueChange={setMouthStyle}>
            <SelectTrigger id="mouth-style">
              <SelectValue placeholder="Select mouth style" />
            </SelectTrigger>
            <SelectContent>
              {mouths.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <svg width="100" height="100" viewBox="-2.5 -2.5 105 105">
          <circle cx="50" cy="50" r="50" fill={color}   stroke="black"         // Border color
  strokeWidth="5" />
          <Eyes style={eyeStyle} />
          <Mouth style={mouthStyle} />
        </svg>
        <Button>Save Avatar</Button>
      </CardFooter>
    </Card>
  )
}