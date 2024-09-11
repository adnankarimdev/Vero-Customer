import { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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
  const [selectedBadges, setSelectedBadges] = useState<Record<string, string[]>>({})

  const toggleBadge = (category: string, badge: string) => {
    setSelectedBadges((prev) => {
      const categoryBadges = prev[category] || [];
      const updatedCategoryBadges = categoryBadges.includes(badge)
        ? categoryBadges.filter((b) => b !== badge)
        : [...categoryBadges, badge];

      return {
        ...prev,
        [category]: updatedCategoryBadges,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Netflix-style Categories</h1>
      {defaultCategories.map((category) => (
        <div key={category.name} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {category.badges.map((badge) => (
              <Card 
                key={badge} 
                className={`flex-shrink-0 w-[200px] bg-[#2F2F2F] border-none cursor-pointer transition-transform hover:scale-105 rounded-lg overflow-hidden ${
                  selectedBadges[category.name]?.includes(badge) ? 'ring-2 ring-[#E50914]' : ''
                }`}
                onClick={() => toggleBadge(category.name, badge)}
              >
                <CardContent className="p-0">
                  <div className="w-full h-[150px] bg-[#E50914] flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                </CardContent>
                <CardFooter className="p-2 text-center bg-white">
                  <p className="w-full text-sm font-medium text-black">{badge}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}