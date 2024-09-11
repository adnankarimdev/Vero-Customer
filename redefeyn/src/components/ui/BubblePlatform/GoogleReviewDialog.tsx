import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// import your dialog components
import { Button } from "@/components/ui/button"; 
import { Textarea } from "@/components/ui/textarea"; // import necessary components from your UI library
import { FcGoogle } from "react-icons/fc"; // if using Google icon

interface GoogleReviewDialogContentProps {
  isDialogOpen: boolean;
  generatedReview: string;
  setGeneratedReview: (review: string) => void;
  handlePostGeneratedReviewToGoogle: () => void;
  handleGoogleReviewDialogChange: (open: boolean) => void;
}

const GoogleReviewDialogContent: React.FC<GoogleReviewDialogContentProps> = ({
  isDialogOpen,
  generatedReview,
  setGeneratedReview,
  handlePostGeneratedReviewToGoogle,
  handleGoogleReviewDialogChange,
}) => (
  <Dialog open={isDialogOpen} onOpenChange={handleGoogleReviewDialogChange}>
    <DialogContent className="w-full">
      <DialogHeader>
        <DialogTitle className="text-center">
          Your review is ready to take the spotlight! 🌟
        </DialogTitle>
        <DialogDescription className="text-center">
          Feel free to edit this! Once it looks good, click the Google icon
          below and it will copy the review for you to paste 🥳
        </DialogDescription>

        <Textarea
          defaultValue={generatedReview}
          className="w-full min-h-[400px]"
          onChange={(e) => setGeneratedReview(e.target.value)}
        />
      </DialogHeader>
      <DialogFooter className="flex justify-between items-center">
        <Button
          type="submit"
          onClick={handlePostGeneratedReviewToGoogle}
          variant="ghost"
        >
          <FcGoogle size={24} />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default GoogleReviewDialogContent;