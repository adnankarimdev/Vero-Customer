import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, Music, Send, Star } from "lucide-react";
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

interface SpotifyReviewPlatformProps {
  buisnessName: string;
  rating?: number;
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

const SpotifyReviewPlatform: React.FC<SpotifyReviewPlatformProps> = ({
  buisnessName,
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
}) => {
  const [playlist, setPlaylist] = useState<string[]>([]);

  const addToPlaylist = (badge: string) => {
    if (!playlist.includes(badge)) {
      setPlaylist([...playlist, badge]);
    }
  };

  const removeFromPlaylist = (badge: string) => {
    setPlaylist(playlist.filter((item) => item !== badge));
  };

  const handleBadgeClick = (categoryName: string, badge: string) => {
    toggleBadge(categoryName, badge);
    addToPlaylist(badge);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6  text-white min-h-screen">
      <div className="w-full md:w-2/3 space-y-6">
        <Card className="w-full max-w-3xl border-0 bg-[#181818]">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-1 text-sm text-white">
              {buisnessName}
            </CardTitle>
            <CardDescription className="flex items-center justify-center space-x-1 mb-2 text-white">
              {rating && rating <= 4 && "Want to tell us why?"}
              {rating === 5 &&
                "We are so happy to hear that. 🥳 Want to tell us why?"}
            </CardDescription>
            <div className="flex items-center justify-center space-x-1 text-[#1DB954]">
              {[...Array(rating)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${rating && i < rating ? "text-black fill-[#1DB954]" : "text-gray-300"}`}
                />
              ))}
            </div>
          </CardHeader>
        </Card>
        {isLoading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-[#181818] border-none">
                <CardHeader>
                  <CardTitle className="text-white">Loading...</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-24 bg-gray-300 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
                </CardFooter>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className=" bg-[#181818] border-none w-full max-w-3xl border-0">
              <CardHeader>
                {categories.map((category, index) => (
                  <Card key={index} className="bg-[#181818] border-none">
                    <CardHeader>
                      <CardTitle className="text-white">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.badges.map((badge, badgeIndex) => (
                          <Button
                            key={badgeIndex}
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleBadgeClick(category.name, badge)
                            }
                            className={`bg-[#282828] text-white ${
                              (selectedBadges[category.name] || []).includes(
                                badge,
                              )
                                ? "bg-[#1DB954] hover:text-black"
                                : "hover:bg-[#1DB954] hover:text-black"
                            }`}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {badge}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <AlertDialog open={isAlertDialogOpen}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              We've got your feedback, Thank You! 🙌🏼
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {inStoreMode
                                ? "If you want, we can build a review, based on your selections, for you to post on Google Reviews for us. It would be really helpful! We'll email you it along with the review link!"
                                : "If you want, we can build a review, based on your selections, for you to post on Google Reviews for us. It would be really helpful! You'll just have to paste it!"}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={handleSaveReviewWithoutGenerate}
                            >
                              No Thanks
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleGenerateReview}>
                              Let's do it
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </CardHeader>
              <CardFooter className="flex justify-end">
                <Button
                  variant="ghost"
                  disabled={Object.values(selectedBadges).flat().length === 0}
                  onClick={stopTimer}
                >
                  <Send className="h-5 w-5 text-[#1DB954]" />
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
      <div className="w-full md:w-1/3">
        <Card className="h-full bg-[#181818] border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Music className="h-5 w-5 text-[#1DB954]" />
              Your Badge Playlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {playlist.length === 0 ? (
                <p className="text-center text-[#B3B3B3]">
                  Your playlist is empty. Add some badges!
                </p>
              ) : (
                <ul className="space-y-2">
                  {playlist.map((badge, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-[#181818] text-white p-2 rounded-md"
                    >
                      <span>{badge}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromPlaylist(badge)}
                        className="h-8 w-8 p-0 text-black hover:text-black hover:bg-[#1ed760]"
                      >
                        <X className="h-4 w-4 text-white" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpotifyReviewPlatform;
