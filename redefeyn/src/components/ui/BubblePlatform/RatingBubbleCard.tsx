"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getUserLocation,
  getLatLongFromAddress,
  isWithinRadius,
} from "@/utils/getLatLong";
import LocationConfirmerSkeleton from "../Skeletons/LocationConfirmerSkeleton";

interface RatingBubbleCardProps {
  businessName: string;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  categories: { name: string; badges: string[] }[];
  selectedBadges: { [key: string]: string[] };
  setSelectedBadges: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] }>
  >;
  toggleBadge: (categoryName: string, badge: string) => void;
  isLoading: boolean;
  isAlertDialogOpen: boolean;
  handleSaveReviewWithoutGenerate: () => void;
  handleGenerateReview: () => void;
  stopTimer: (categoryRatings: { [key: string]: number }) => void;
  sendingEmail: boolean;
  inStoreMode?: boolean;
  worryRating: number;
  translateLanguage?: (language: string) => void;
  cardDescription?: string;
  formattedAddress?: string;
}

export default function RatingBubbleCard({
  businessName,
  rating,
  setRating,
  categories,
  selectedBadges,
  setSelectedBadges,
  toggleBadge,
  isLoading,
  isAlertDialogOpen,
  handleSaveReviewWithoutGenerate,
  handleGenerateReview,
  stopTimer,
  sendingEmail,
  inStoreMode,
  worryRating,
  translateLanguage,
  cardDescription,
  formattedAddress,
}: RatingBubbleCardProps) {
  const [categoryRatings, setCategoryRatings] = useState<{
    [key: string]: number;
  }>(Object.fromEntries(categories.map((category) => [category.name, 0])));

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newBadge, setNewBadge] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [locationConfirmed, setIsLocationConfirmed] = useState(true);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  // For when we confirm, use condition below.
  // const [locationConfirmed, setIsLocationConfirmed] = useState(
  //   inStoreMode ? true : false,
  // );
  const [confirmingLocation, setConfirmingLocation] = useState(false);
  const { toast } = useToast();
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "french", label: "French" },
    { value: "spanish", label: "Spanish" },
    { value: "hindi", label: "Hindi" },
    { value: "urdu", label: "Urdu" },
    { value: "punjabi-hindi", label: "Punjabi Hindi" },
    { value: "punjabi-urdu", label: "Punjabi Urdu" },
    { value: "bengali", label: "Bengali" },
    { value: "pashto", label: "Pashto" },
    { value: "mandarin", label: "Mandarin" },
    // { value: "online-business", label: "Social Media Business 🧑‍💻" },
    // { value: "influencer", label: "Social Media Icon ⭐️" },
  ];

  useEffect(() => {
    if (editingCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCategory]);

  // We will refresh the page if personal device reviews, every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!inStoreMode) {
        // Check the condition before refreshing
        window.location.reload(); // Refresh the page if condition is true
      }
    }, 300000); // 300000 milliseconds = 5 minutes

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);

  const handleCategoryRating = (categoryName: string, newRating: number) => {
    setCategoryRatings((prev) => {
      if (prev[categoryName] !== newRating) {
        setSelectedBadges((prevBadges) => ({
          ...prevBadges,
          [categoryName]: [],
        }));
      }
      return { ...prev, [categoryName]: newRating };
    });
  };

  const isInLocation = async () => {
    if (formattedAddress) {
      setConfirmingLocation(true);
      const placeLocation = await getLatLongFromAddress(formattedAddress);
      let userLocation = { latitude: 0, longitude: 0 };
      try {
        const userLocationConfirm = await getUserLocation();
        if (userLocationConfirm) {
          userLocation = userLocationConfirm;
        }
      } catch {
        setConfirmingLocation(false);
        toast({
          title: "Location Permission Required",
          description:
            "You must allow location usage to ensure you're at the store leaving a review.",
          variant: "destructive",
          duration: 10000,
        });
        return;
      }
      if (placeLocation && userLocation) {
        const withinRadius = isWithinRadius(placeLocation, userLocation, 50);
        if (withinRadius === true) {
          setConfirmingLocation(false);
          setIsLocationConfirmed(true);
          toast({
            title: "Location confirmed",
            description: "Clear for Reviewing! 🛫",
            duration: 5000,
          });
        } else {
          setConfirmingLocation(false);
          setIsLocationConfirmed(false);
          toast({
            title: `Not at ${businessName}`,
            description: "Reviews must be left in store.",
            duration: 5000,
            variant: "destructive",
          });
        }
      } else {
        setConfirmingLocation(false);
        toast({
          title: "Failed to confirm location.",
          description: "It's not you, it's us. Please try again!",
          duration: 2000,
        });
      }
    }
  };

  const notifyUser = () => {
    toast({
      title: "Confirm your location",
      duration: 2000,
    });
  };
  const getBadgesForRating = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    const rating = categoryRatings[categoryName];
    if (category) {
      const matchedRating = category.badges.find(
        (badgeSet) => (badgeSet as any)["rating"] === rating,
      );
      return matchedRating ? (matchedRating as any).badges : [];
    }
    return [];
  };

  const handleOtherBadgeClick = (categoryName: string) => {
    setEditingCategory(categoryName);
    setNewBadge("");
  };

  const handleSaveCustomBadge = (categoryName: string) => {
    if (
      newBadge.trim() &&
      !selectedBadges[categoryName]?.includes(newBadge.trim())
    ) {
      setSelectedBadges((prevBadges) => ({
        ...prevBadges,
        [categoryName]: [...(prevBadges[categoryName] || []), newBadge.trim()],
      }));
      setNewBadge("");
    }
    setEditingCategory(null);
  };

  const handleToggleBadge = (categoryName: string, badge: string) => {
    toggleBadge(categoryName, badge);
  };

  return (
    <Card className="w-full max-w-3xl border-0">
      {confirmingLocation && <LocationConfirmerSkeleton />}
      <div className="flex justify-end items-start mr-2 mt-2">
        {!inStoreMode && !locationConfirmed && (
          <Button
            className="text-xs px-2 py-1 h-auto"
            variant="outline"
            onClick={() => isInLocation()}
          >
            {"I'm in store"}
          </Button>
        )}
      </div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-center space-x-1 text-sm">
          {businessName}
        </CardTitle>
        <CardDescription className="flex items-center justify-center space-x-1 mb-2">
          {cardDescription}
        </CardDescription>
      </CardHeader>
      {isLoading ? (
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 bg-muted rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <CardContent>
          {categories.map((category) => (
            <div key={category.name} className="mb-6">
              <div
                className={
                  categories.length > 1
                    ? "flex items-center mb-2 justify-between"
                    : "flex items-center mb-2 justify-center"
                }
              >
                {categories.length > 1 && (
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                )}
                <div className="flex items-center space-x-1 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 cursor-pointer ${
                        i < categoryRatings[category.name]
                          ? "text-primary fill-primary"
                          : "text-muted stroke-muted-foreground"
                      }`}
                      onClick={() => {
                        if (locationConfirmed) {
                          handleCategoryRating(category.name, i + 1);
                        } else {
                          notifyUser();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <motion.div layout className="flex flex-wrap gap-2 relative">
                  <AnimatePresence>
                    {getBadgesForRating(category.name).map((badge: string) => (
                      <motion.div
                        key={badge}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onHoverStart={() => setHoveredBadge(badge)}
                        onHoverEnd={() => setHoveredBadge(null)}
                      >
                        <Badge
                          variant={
                            selectedBadges[category.name]?.includes(badge)
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer transition-colors ${
                            selectedBadges[category.name]?.includes(badge)
                              ? categoryRatings[category.name] <= worryRating
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : "bg-green-500 text-green-foreground hover:bg-green-400"
                              : ""
                          }`}
                          onClick={() =>
                            handleToggleBadge(category.name, badge)
                          }
                        >
                          {badge}
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
                {selectedBadges[category.name]
                  ?.filter(
                    (badge) =>
                      !getBadgesForRating(category.name).includes(badge),
                  )
                  .map((customBadge) => (
                    <Badge
                      key={customBadge}
                      variant="default"
                      className="cursor-pointer transition-colors bg-blue-500 text-blue-foreground hover:bg-blue-400"
                      onClick={() =>
                        handleToggleBadge(category.name, customBadge)
                      }
                    >
                      {customBadge}
                    </Badge>
                  ))}
                {editingCategory === category.name ? (
                  <div className="flex items-center">
                    <Input
                      ref={inputRef}
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSaveCustomBadge(category.name);
                        }
                      }}
                      className="w-32 h-8 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSaveCustomBadge(category.name)}
                      className="ml-1"
                    >
                      Save
                    </Button>
                  </div>
                ) : categoryRatings[category.name] > 0 ? (
                  <Badge
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleOtherBadgeClick(category.name)}
                  >
                    Other
                  </Badge>
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center mb-2">
                {"We've got your feedback, Thank You! 🙌🏼"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {inStoreMode ? (
                  <>
                    {businessName}{" "}
                    <span className="text-emerald-500">
                      knows you're helpful.
                    </span>{" "}
                    <br /> <br />
                    Let Vero{" "}
                    <span className="text-blue-500">
                      remind and help build you a review
                    </span>{" "}
                    for later to post on Google?
                  </>
                ) : (
                  <>
                    {businessName}{" "}
                    <span className="text-emerald-500">
                      knows you're helpful.
                    </span>{" "}
                    <br /> <br />
                    Let Vero{" "}
                    <span className="text-blue-500">
                      help you build a review
                    </span>{" "}
                    and post to Google?
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleSaveReviewWithoutGenerate}>
                {"No Thanks"}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerateReview}>
                {"Let's do it"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {translateLanguage && (
          <>
            <Select
              onValueChange={(value) => {
                translateLanguage(value);
                setSelectedLanguage(value);
              }} // Capture the selected value and pass it
              defaultValue={selectedLanguage}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="overflow-y-auto max-h-[10rem]">
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>

                  {languageOptions.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        )}
        <Button
          variant="ghost"
          disabled={Object.keys(selectedBadges).every(
            (key) => selectedBadges[key].length === 0,
          )}
          onClick={() => stopTimer(categoryRatings)}
        >
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
