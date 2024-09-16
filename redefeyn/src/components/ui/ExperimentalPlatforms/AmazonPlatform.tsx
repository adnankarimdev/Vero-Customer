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
import { Star, ShoppingCart, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AmazonPlatformProps {
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

export default function AmazonPlatform({
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
}: AmazonPlatformProps) {
  const allSelectedBadges = Object.values(selectedBadges).flat();

  return (
    <Card className="w-full max-w-6xl border border-gray-200 bg-white shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#232F3E] to-[#37475A] text-white p-6">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-bold">
          <Package className="h-8 w-8" />
          <span>{businessName}</span>
        </CardTitle>
        <CardDescription className="text-center text-white/90 mt-2">
          {rating <= 4
            ? "How was your shopping experience?"
            : "We're thrilled you enjoyed shopping with us! 🛍️"}
        </CardDescription>
        <div className="flex items-center justify-center space-x-1 mt-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${i < rating ? "text-[#FFA41C] fill-[#FFA41C]" : "text-white/30"}`}
            />
          ))}
        </div>
      </CardHeader>
      <div className="flex flex-col md:flex-row">
        <CardContent className="p-6 md:w-2/3">
          {isLoading
            ? [...Array(3)].map((_, index) => (
                <div key={index} className="mb-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-24 bg-gray-200 rounded-full"
                      ></div>
                    ))}
                  </div>
                </div>
              ))
            : categories.map((category) => (
                <div key={category.name} className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant={
                          selectedBadges[category.name]?.includes(badge)
                            ? "secondary"
                            : "outline"
                        }
                        className={`
                        text-sm py-1 px-3 rounded-full cursor-pointer transition-colors
                        ${
                          selectedBadges[category.name]?.includes(badge)
                            ? "bg-[#232F3E] text-white hover:bg-[#37475A]"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#232F3E] hover:text-[#232F3E]"
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
        <div className="md:w-1/3 p-6 bg-[#F3F3F3] border-l border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-[#232F3E] flex items-center justify-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
          </h3>
          {allSelectedBadges.length > 0 ? (
            <div className="space-y-2">
              {allSelectedBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
                >
                  <span className="text-gray-700">{badge}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-[#232F3E]"
                    onClick={() => {
                      const category = Object.keys(selectedBadges).find((cat) =>
                        selectedBadges[cat].includes(badge),
                      );
                      if (category) toggleBadge(category, badge);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Your cart is empty. Start adding items!
            </p>
          )}
        </div>
      </div>
      <CardFooter className="flex justify-between items-center border-t border-gray-200 p-4 bg-[#F3F3F3]">
        <div className="text-[#232F3E] font-semibold">
          Total Items: {allSelectedBadges.length}
        </div>
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-[#232F3E]">
                Thanks for your purchase! 🛍️
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                {inStoreMode
                  ? "Would you like to share your shopping experience with other customers? We'll email you a review template along with a link to post it!"
                  : "Would you like to share your shopping experience with other customers? You can easily post your review!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleSaveReviewWithoutGenerate}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                No, thanks
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleGenerateReview}
                className="bg-[#FF9900] text-white hover:bg-[#FFAC31]"
              >
                Yes, share review!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="default"
          className="bg-[#FF9900] text-white hover:bg-[#FFAC31]"
          disabled={allSelectedBadges.length === 0}
          onClick={stopTimer}
        >
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
