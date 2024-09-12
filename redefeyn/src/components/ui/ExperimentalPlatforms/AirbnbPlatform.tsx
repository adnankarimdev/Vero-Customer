import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Star, Send, Palmtree } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AirbnbPlatformProps {
  businessName: string;
  rating: number;
  categories: { name: string; badges: string[] }[];
  selectedBadges: { [key: string]: string[] };
  toggleBadge: (categoryName: string, badge: string) => void;
  isLoading: boolean;
  isAlertDialogOpen: boolean;
  handleSaveReviewWithoutGenerate: () => void;
  handleGenerateReview: () => void;
  stopTimer: () => void;
  sendingEmail: boolean;
  inStoreMode?: boolean;
}

export default function AirbnbPlatform({
  businessName,
  rating,
  categories,
  selectedBadges,
  toggleBadge,
  isLoading,
  isAlertDialogOpen,
  handleSaveReviewWithoutGenerate,
  handleGenerateReview,
  stopTimer,
  sendingEmail,
  inStoreMode,
}: AirbnbPlatformProps) {
  return (
    <Card className="w-full max-w-3xl border border-gray-200 bg-white shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#FF385C] to-[#FF385C]/80 text-white p-6">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-bold">
          <Palmtree className="h-8 w-8" />
          <span>{businessName} Vacation Planner</span>
        </CardTitle>
        <CardDescription className="text-center text-white/90 mt-2">
          {rating <= 4 ? "How was your stay with us?" : "We're thrilled you enjoyed your stay! 🌴"}
        </CardDescription>
        <div className="flex items-center justify-center space-x-1 mt-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`}
            />
          ))}
        </div>
      </CardHeader>
      {isLoading ? (
        <CardContent className="p-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      ) : (
        <CardContent className="p-6">
          {categories.map((category) => (
            <div key={category.name} className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant={selectedBadges[category.name]?.includes(badge) ? "secondary" : "outline"}
                    className={`
                      text-sm py-1 px-3 rounded-full cursor-pointer transition-colors
                      ${selectedBadges[category.name]?.includes(badge)
                        ? "bg-[#FF385C] text-white hover:bg-[#FF385C]/90"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#FF385C] hover:text-[#FF385C]"
                      }
                    `}
                    onClick={() => toggleBadge(category.name, badge)}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      )}
      <CardFooter className="flex justify-end border-t border-gray-200 p-4">
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-gray-800">Thanks for planning your dream vacation! 🌴</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {inStoreMode
                  ? "Would you like us to create a review based on your vacation plans for other travelers? We'll email it to you along with a link to post it!"
                  : "Would you like us to create a review based on your vacation plans for other travelers? You can easily share your experience!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleSaveReviewWithoutGenerate} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                No, thanks
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerateReview} className="bg-[#FF385C] text-white hover:bg-[#FF385C]/90">
                Yes, create review!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="ghost"
          className="text-[#FF385C] hover:bg-[#FF385C]/10"
          disabled={Object.keys(selectedBadges).every((key) => selectedBadges[key].length === 0)}
          onClick={stopTimer}
        >
          <Send className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  )
}