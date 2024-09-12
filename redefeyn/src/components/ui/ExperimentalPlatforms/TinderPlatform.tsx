import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Flame, X, Heart, Star, MessageCircle, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface TinderPlatformProps {
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

export default function TinderPlatform({
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
}: TinderPlatformProps) {
  const allBadges = categories.flatMap(category => 
    category.badges.map(badge => ({ category: category.name, badge }))
  );
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    setDirection(swipeDirection);
    if (swipeDirection === 'right') {
      toggleBadge(allBadges[currentBadgeIndex].category, allBadges[currentBadgeIndex].badge);
    }
    setTimeout(() => {
      setCurrentBadgeIndex((prevIndex) => (prevIndex + 1) % allBadges.length);
      setDirection(null);
    }, 300);
  };

  const allSelectedBadges = Object.values(selectedBadges).flat();

  return (
    <Card className="w-full max-w-md border-0 bg-gray-100 text-gray-900 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#FD297B] to-[#FF5864] p-4">
        <div className="flex items-center justify-between text-white">
          <Settings className="h-6 w-6" />
          <CardTitle className="text-3xl font-bold flex items-center">
            <Flame className="h-8 w-8 mr-2" />
            {businessName}
          </CardTitle>
          <User className="h-6 w-6" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardDescription className="text-xl font-semibold mb-6 text-center text-gray-700">
          Swipe right on your favorite experiences!
        </CardDescription>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="bg-gray-300 rounded-lg aspect-[3/4] mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key={currentBadgeIndex}
              initial={{ x: 0, opacity: 1 }}
              animate={{ 
                x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
                opacity: direction ? 0 : 1
              }}
              exit={{ x: 0 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={`/placeholder.svg?height=600&width=400&text=${encodeURIComponent(allBadges[currentBadgeIndex].badge)}`}
                alt={allBadges[currentBadgeIndex].badge}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-2xl font-bold text-white mb-1">{allBadges[currentBadgeIndex].badge}</h3>
                <p className="text-sm text-gray-200">{allBadges[currentBadgeIndex].category}</p>
              </div>
              {selectedBadges[allBadges[currentBadgeIndex].category]?.includes(allBadges[currentBadgeIndex].badge) && (
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                  Matched
                </Badge>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
      <CardFooter className="flex justify-center items-center bg-white p-4 space-x-4">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
          onClick={() => handleSwipe('left')}
        >
          <X className="h-8 w-8" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-[#FD297B] text-[#FD297B] hover:bg-[#FD297B] hover:text-white"
          onClick={() => handleSwipe('right')}
        >
          <Heart className="h-10 w-10" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
          onClick={stopTimer}
        >
          <Star className="h-8 w-8" />
        </Button>
      </CardFooter>
      <div className="bg-white px-4 py-2 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="bg-[#FD297B] text-white">
            {allSelectedBadges.length} Matches
          </Badge>
          <AlertDialog open={isAlertDialogOpen}>
            <AlertDialogContent className="bg-white text-gray-900 border border-gray-300 rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold">It's a match! 💖</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  {inStoreMode
                    ? "Would you like to create a review based on your matches? We'll email it to you along with a link to post it!"
                    : "Would you like to create a review based on your matches? You can easily share your experience!"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleSaveReviewWithoutGenerate} className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">
                  Not Now
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleGenerateReview} className="bg-[#FD297B] text-white hover:bg-[#FF5864] rounded-full">
                  Create Review
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="ghost" className="text-[#FD297B]">
            <MessageCircle className="h-5 w-5 mr-2" />
            Send Feedback
          </Button>
        </div>
      </div>
    </Card>
  )
}