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
import { BookOpen, Search, User, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface NewYorkTimesPlatformProps {
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

export default function NewYorkTimesPlatform({
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
}: NewYorkTimesPlatformProps) {
  const allSelectedBadges = Object.values(selectedBadges).flat();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="w-full max-w-6xl border-0 bg-white text-gray-900 shadow-lg rounded-none overflow-hidden">
      <CardHeader className="bg-white p-4 border-b border-gray-200">
        <div className="flex flex-col items-center space-y-2">
          <CardTitle className="text-4xl font-serif font-bold">
            {businessName} Times
          </CardTitle>
          <CardDescription className="text-sm font-serif">
            {currentDate}
          </CardDescription>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <Menu className="h-6 w-6 text-gray-600" />
            <Button variant="ghost" className="text-sm font-serif">
              Today's Paper
            </Button>
            <Button variant="ghost" className="text-sm font-serif">
              Sections
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="w-48 bg-gray-100 border-gray-300 focus:border-gray-500 text-gray-900"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <User className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardDescription className="text-gray-600 mb-6 font-serif italic">
          Browse and select your favorite articles to create your personalized
          review edition!
        </CardDescription>
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="w-1/4 h-24 bg-gray-200 rounded"></div>
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
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.name}>
                <h3 className="text-xl font-serif font-bold mb-4 pb-2 border-b border-gray-300">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.badges.map((badge) => (
                    <div
                      key={badge}
                      className={`flex cursor-pointer ${
                        selectedBadges[category.name]?.includes(badge)
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => toggleBadge(category.name, badge)}
                    >
                      <div className="w-1/3 aspect-video bg-gray-200 mr-4">
                        <img
                          src={`/placeholder.svg?height=120&width=160&text=${encodeURIComponent(badge)}`}
                          alt={badge}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-serif font-semibold mb-2">
                          {badge}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>
                            {Math.floor(Math.random() * 10) + 1} min read
                          </span>
                          <Separator
                            orientation="vertical"
                            className="mx-2 h-4"
                          />
                          <span>{businessName} Times</span>
                        </div>
                        {selectedBadges[category.name]?.includes(badge) && (
                          <Badge className="mt-2 bg-gray-800 text-white">
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
      <CardFooter className="flex justify-between items-center bg-gray-100 border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-gray-800 text-white">
            {allSelectedBadges.length} Articles Selected
          </Badge>
        </div>
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-white text-gray-900 border border-gray-300">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-serif font-bold">
                Ready to publish your review? 📰
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {inStoreMode
                  ? "Would you like to create a review based on your article selections? We'll email it to you along with a link to post it!"
                  : "Would you like to create a review based on your article selections? You can easily share your curated edition!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleSaveReviewWithoutGenerate}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Not Now
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGenerateReview}
                className="bg-gray-800 text-white hover:bg-gray-700"
              >
                Create Review
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex space-x-2">
          <Button
            variant="default"
            className="bg-gray-800 text-white hover:bg-gray-700"
            disabled={allSelectedBadges.length === 0}
            onClick={stopTimer}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Read Review Edition
          </Button>
          <Button
            variant="outline"
            className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
          >
            Subscribe
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
