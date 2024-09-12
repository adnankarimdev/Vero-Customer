import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Star, Heart, MessageCircle, Send, Image, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface InstagramPlatformProps {
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

export default function InstagramPlatform({
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
}: InstagramPlatformProps) {
  const allSelectedBadges = Object.values(selectedBadges).flat();

  return (
    <Card className="w-full max-w-md border border-gray-200 bg-white shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-white p-4 border-b">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={businessName} />
            <AvatarFallback>{businessName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-semibold">{businessName}</CardTitle>
            <CardDescription className="text-xs text-gray-500">Sponsored</CardDescription>
          </div>
        </div>
      </CardHeader>
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        <Image className="w-1/2 h-1/2 text-gray-400" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-red-500">
              <Heart className={`h-6 w-6 ${rating > 3 ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm font-semibold mb-1">{allSelectedBadges.length} reactions</p>
        <p className="text-sm text-gray-700 mb-2">
          How was your experience with {businessName}? React to this post!
        </p>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-wrap gap-2 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name}>
                <h3 className="text-sm font-semibold mb-2 text-gray-800">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant={selectedBadges[category.name]?.includes(badge) ? "secondary" : "outline"}
                      className={`
                        text-xs py-1 px-2 rounded-full cursor-pointer transition-colors
                        ${selectedBadges[category.name]?.includes(badge)
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center border-t border-gray-200 p-4">
        <div className="flex-1 flex items-center space-x-2">
          <Smile className="h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
          />
        </div>
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-800">Thanks for your reactions! 📸</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {inStoreMode
                  ? "Would you like to share your experience as a post? We'll email you a draft along with a link to post it!"
                  : "Would you like to share your experience as a post? You can easily publish your review!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleSaveReviewWithoutGenerate} className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                No, thanks
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerateReview} className="bg-blue-500 text-white hover:bg-blue-600">
                Yes, create post!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="ghost"
          className="text-blue-500 font-semibold text-sm"
          disabled={allSelectedBadges.length === 0}
          onClick={stopTimer}
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  )
}