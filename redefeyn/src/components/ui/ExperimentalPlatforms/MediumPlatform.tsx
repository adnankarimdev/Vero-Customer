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
  BookOpen,
  Search,
  User,
  Bell,
  Bookmark,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MediumPlatformProps {
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

export default function MediumPlatform({
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
}: MediumPlatformProps) {
  const allSelectedBadges = Object.values(selectedBadges).flat();

  return (
    <Card className="w-full max-w-4xl border-0 bg-white text-gray-900 shadow-none rounded-none overflow-hidden">
      <CardHeader className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold">{businessName}</CardTitle>
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-500" />
            <Bell className="h-5 w-5 text-gray-500" />
            <Bookmark className="h-5 w-5 text-gray-500" />
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardDescription className="text-xl font-semibold mb-6">
          Browse and select your favorite stories to create your personalized
          review collection!
        </CardDescription>
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category.name}>
                <h3 className="text-2xl font-bold mb-6">{category.name}</h3>
                <div className="space-y-8">
                  {category.badges.map((badge) => (
                    <div
                      key={badge}
                      className={`flex cursor-pointer ${
                        selectedBadges[category.name]?.includes(badge)
                          ? "bg-gray-50"
                          : ""
                      }`}
                      onClick={() => toggleBadge(category.name, badge)}
                    >
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarImage
                          src={`/placeholder.svg?text=${encodeURIComponent(badge[0])}`}
                          alt={badge}
                        />
                        <AvatarFallback>{badge[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2">{badge}</h4>
                        <p className="text-gray-600 mb-2">
                          A captivating story about {badge.toLowerCase()}.
                          Discover the insights and experiences related to this
                          topic.
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{businessName}</span>
                          <span className="mx-1">·</span>
                          <span>
                            {Math.floor(Math.random() * 10) + 1} min read
                          </span>
                          <span className="mx-1">·</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        {selectedBadges[category.name]?.includes(badge) && (
                          <Badge className="mt-2 bg-green-100 text-green-800 border-green-800">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-gray-200 text-gray-800">
            {allSelectedBadges.length} Stories Selected
          </Badge>
        </div>
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-white text-gray-900 border border-gray-300">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">
                Ready to publish your review? 📝
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {inStoreMode
                  ? "Would you like to create a review based on your story selections? We'll email it to you along with a link to post it!"
                  : "Would you like to create a review based on your story selections? You can easily share your curated collection!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleSaveReviewWithoutGenerate}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Not Now
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGenerateReview}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Create Review
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex space-x-2">
          <Button
            variant="default"
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={allSelectedBadges.length === 0}
            onClick={stopTimer}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Read Review Collection
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
