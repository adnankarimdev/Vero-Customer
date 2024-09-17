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
import { Check, X, Heart, Flag, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DuolingoPlatformProps {
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

export default function DuolingoPlatform({
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
}: DuolingoPlatformProps) {
  const allSelectedBadges = Object.values(selectedBadges).flat();
  const progress =
    (allSelectedBadges.length /
      categories.reduce((acc, cat) => acc + cat.badges.length, 0)) *
    100;

  return (
    <Card className="w-full max-w-2xl border-0 bg-[#235390] text-white shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#58CC02] p-4 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flag className="h-6 w-6" />
          <CardTitle className="text-xl font-bold">
            {businessName} Review
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-red-500 fill-current" />
          <span className="font-bold">{rating}</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardDescription className="text-white/90 mb-4 text-center text-lg">
          Complete the lesson to share your experience!
        </CardDescription>
        <Progress value={progress} className="mb-6 bg-[#1C4477] h-3" />
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-[#1C4477] rounded w-3/4 mb-2"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-24 bg-[#1C4477] rounded-xl"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category, categoryIndex) => (
              <div key={category.name} className="bg-[#1C4477] p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Volume2 className="h-5 w-5 mr-2" />
                  {category.name}
                </h3>
                <p className="mb-3 text-white/80">
                  Select the correct options:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {category.badges.map((badge) => (
                    <Button
                      key={badge}
                      variant="outline"
                      className={`
                        py-2 px-4 rounded-xl text-sm font-medium transition-colors
                        ${
                          selectedBadges[category.name]?.includes(badge)
                            ? "bg-[#58CC02] text-white border-[#58CC02] hover:bg-[#58CC02]/90"
                            : "bg-[#235390] text-white border-white/20 hover:bg-[#1C4477]"
                        }
                      `}
                      onClick={() => toggleBadge(category.name, badge)}
                    >
                      {badge}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-[#1C4477] p-4">
        <Button
          variant="ghost"
          className="text-white hover:text-[#58CC02]"
          onClick={stopTimer}
        >
          <X className="h-6 w-6 mr-2" />
          Skip
        </Button>
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-[#235390] text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold">
                Great job! 🎉
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white/80">
                {inStoreMode
                  ? "Would you like to share your learning progress? We'll email you a summary along with a link to post it!"
                  : "Would you like to share your learning progress? You can easily post your achievements!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleSaveReviewWithoutGenerate}
                className="bg-[#1C4477] text-white hover:bg-[#1C4477]/80"
              >
                No, thanks
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGenerateReview}
                className="bg-[#58CC02] text-white hover:bg-[#58CC02]/90"
              >
                Yes, share progress!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="default"
          className="bg-[#58CC02] text-white hover:bg-[#58CC02]/90"
          disabled={allSelectedBadges.length === 0}
          onClick={stopTimer}
        >
          <Check className="h-6 w-6 mr-2" />
          Check
        </Button>
      </CardFooter>
    </Card>
  );
}
