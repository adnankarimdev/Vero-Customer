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
import { Play, Info, ThumbsUp, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface NetflixPlatformProps {
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

export default function NetflixPlatform({
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
}: NetflixPlatformProps) {
  const allSelectedBadges = Object.values(selectedBadges).flat();

  return (
    <Card className="w-full max-w-5xl border-0 bg-[#141414] text-white shadow-lg rounded-none overflow-hidden">
      <CardHeader className="bg-gradient-to-b from-black to-transparent p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-red-600">
            {businessName}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="font-bold">{rating}/5</span>
          </div>
        </div>
        <CardDescription className="text-white/70 mt-2">
          Browse and select your favorite experiences to create your review!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="flex space-x-4 overflow-x-auto">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-32 h-48 bg-gray-700 rounded"
                    ></div>
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
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                  <div className="flex space-x-4 pb-4">
                    {category.badges.map((badge) => (
                      <div key={badge} className="flex-shrink-0 relative group">
                        <div
                          className={`w-32 h-48 rounded-md overflow-hidden transition-transform duration-300 ease-in-out ${
                            selectedBadges[category.name]?.includes(badge)
                              ? "ring-4 ring-white"
                              : ""
                          } group-hover:scale-110`}
                          style={{
                            backgroundImage: `url('/placeholder.svg?height=192&width=128')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          onClick={() => toggleBadge(category.name, badge)}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                            <p className="text-white text-center px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {badge}
                            </p>
                          </div>
                        </div>
                        {selectedBadges[category.name]?.includes(badge) && (
                          <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                            <ThumbsUp className="h-4 w-4 text-black" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-black/50 p-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-white text-black">
            {allSelectedBadges.length} Selected
          </Badge>
        </div>
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-[#141414] text-white border border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">
                Ready to share your picks? 🍿
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                {inStoreMode
                  ? "Would you like to create a review based on your selections? We'll email it to you along with a link to post it!"
                  : "Would you like to create a review based on your selections? You can easily share your experience!"}
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
            variant="outline"
            className="bg-white text-black hover:bg-white/90"
            disabled={allSelectedBadges.length === 0}
            onClick={stopTimer}
          >
            <Play className="h-4 w-4 mr-2" />
            Review
          </Button>
          <Button
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white/20"
          >
            <Info className="h-4 w-4 mr-2" />
            More Info
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
