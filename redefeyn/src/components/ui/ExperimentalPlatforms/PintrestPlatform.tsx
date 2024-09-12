import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Search, Bell, MessageCircle, User, Plus, ChevronDown, Heart, Upload, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PintrestPlatformProps {
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

export default function PintrestPlatform({
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
}: PintrestPlatformProps) {
  const allSelectedBadges = Object.values(selectedBadges).flat();

  return (
    <Card className="w-full max-w-7xl border-0 bg-white text-gray-900 shadow-none rounded-none overflow-hidden">
      <CardHeader className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold text-[#E60023]">{businessName}</CardTitle>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-black hover:bg-gray-100 rounded-full">Home</Button>
            <Button variant="ghost" className="text-black hover:bg-gray-100 rounded-full">Create<ChevronDown className="ml-1 h-4 w-4" /></Button>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="w-64 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-gray-300"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Bell className="h-6 w-6 text-gray-700" />
            <MessageCircle className="h-6 w-6 text-gray-700" />
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-gray-700" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardDescription className="text-xl font-semibold mb-6 text-center">
          Pin your favorite experiences to create your personalized review board!
        </CardDescription>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(15)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-[3/4]"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.flatMap((category) =>
              category.badges.map((badge) => (
                <div
                  key={`${category.name}-${badge}`}
                  className={`relative group cursor-pointer`}
                  onClick={() => toggleBadge(category.name, badge)}
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-100">
                    <img
                      src={`/placeholder.svg?height=400&width=300&text=${encodeURIComponent(badge)}`}
                      alt={badge}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {selectedBadges[category.name]?.includes(badge) ? 'Unpin' : 'Pin'}
                      </Button>
                    </div>
                  </div>
                  <h4 className="mt-2 font-semibold text-sm">{badge}</h4>
                  <p className="text-xs text-gray-500">{category.name}</p>
                  <div className="absolute top-2 left-2">
                    {selectedBadges[category.name]?.includes(badge) && (
                      <Badge className="bg-red-500 text-white">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    <Button size="sm" variant="ghost" className="rounded-full bg-white bg-opacity-80 hover:bg-opacity-100">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full bg-white bg-opacity-80 hover:bg-opacity-100">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            {allSelectedBadges.length} Pins
          </Badge>
        </div>
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-white text-gray-900 border border-gray-300 rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">Ready to share your board? 📌</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {inStoreMode
                  ? "Would you like to create a review based on your pinned experiences? We'll email it to you along with a link to post it!"
                  : "Would you like to create a review based on your pinned experiences? You can easily share your curated board!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleSaveReviewWithoutGenerate} className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">
                Not Now
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerateReview} className="bg-red-500 text-white hover:bg-red-600 rounded-full">
                Create Review
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex space-x-2">
          <Button
            variant="default"
            className="bg-red-500 text-white hover:bg-red-600 rounded-full"
            disabled={allSelectedBadges.length === 0}
            onClick={stopTimer}
          >
            <Heart className="h-4 w-4 mr-2" />
            Save Board
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}