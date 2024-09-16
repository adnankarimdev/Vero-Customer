import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Play,
  ThumbsUp,
  Star,
  Clock,
  Share2,
  Menu,
  Search,
  Bell,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface YouTubePlatformProps {
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

export default function YouTubePlatform({
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
}: YouTubePlatformProps) {
  const allSelectedBadges = Object.values(selectedBadges).flat();

  return (
    <Card className="w-full max-w-6xl border-0 bg-[#0F0F0F] text-white shadow-lg rounded-none overflow-hidden">
      <CardHeader className="bg-[#0F0F0F] p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 text-white" />
            <CardTitle className="text-2xl font-bold text-red-600 flex items-center">
              <Play className="h-8 w-8 mr-2 fill-current" />
              {businessName}Tube
            </CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="w-64 bg-[#121212] border-gray-600 focus:border-blue-500 text-white"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Bell className="h-6 w-6 text-white" />
            <User className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardDescription className="text-white/70 mb-6">
          Browse and select your favorite videos to create your review playlist!
        </CardDescription>
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-full">
                      <div className="w-full h-40 bg-gray-700 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.name}>
                <h3 className="text-lg font-semibold mb-3 text-white/90">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.badges.map((badge) => (
                    <div
                      key={badge}
                      className={`flex-shrink-0 relative group cursor-pointer ${
                        selectedBadges[category.name]?.includes(badge)
                          ? "ring-2 ring-red-600 rounded-lg"
                          : ""
                      }`}
                      onClick={() => toggleBadge(category.name, badge)}
                    >
                      <div className="w-full aspect-video bg-gray-800 rounded-lg mb-2 overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=180&width=320&text=${encodeURIComponent(badge)}`}
                          alt={badge}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold line-clamp-2">
                        {badge}
                      </h4>
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        {businessName} • {Math.floor(Math.random() * 1000)}K
                        views • {Math.floor(Math.random() * 12) + 1} months ago
                      </p>
                      {selectedBadges[category.name]?.includes(badge) && (
                        <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                          Selected
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-[#0F0F0F] border-t border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-red-600 text-white">
            {allSelectedBadges.length} Videos Selected
          </Badge>
        </div>
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-[#0F0F0F] text-white border border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">
                Ready to share your playlist? 🎥
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                {inStoreMode
                  ? "Would you like to create a review based on your video selections? We'll email it to you along with a link to post it!"
                  : "Would you like to create a review based on your video selections? You can easily share your experience!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleSaveReviewWithoutGenerate}
                className="bg-gray-800 text-white hover:bg-gray-700"
              >
                Not Now
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGenerateReview}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Create Review
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex space-x-2">
          <Button
            variant="default"
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={allSelectedBadges.length === 0}
            onClick={stopTimer}
          >
            <Play className="h-4 w-4 mr-2" />
            Play Review Playlist
          </Button>
          <Button
            variant="outline"
            className="bg-transparent text-white border-gray-600 hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
