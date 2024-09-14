import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // adjust the path for shadcn components
import DateTimePicker from "../shared/DateTimePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface EmailPostFiveStarReviewProps {
  isEmailReviewDialogOpen: boolean;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  handleWorryRatingDialog: (open: boolean) => void;
  sendEmailToClientWithReview: () => void;
  setDate: (date: Date) => void;
  date: Date;
  setTime: (time: string) => void;
  time: string;
}

const EmailPostFiveStarReview: React.FC<EmailPostFiveStarReviewProps> = ({
  isEmailReviewDialogOpen,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  handleWorryRatingDialog,
  sendEmailToClientWithReview,
  setDate,
  date,
  setTime,
  time
}) => (
  <Dialog open={isEmailReviewDialogOpen} onOpenChange={handleWorryRatingDialog}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex justify-center items-center">
          {"You're the best 🤩"}
        </DialogTitle>
        <DialogDescription>
          {
            "Go ahead and give us your name and email, and it'll be in your inbox soon! 💌"
          }
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-left">
            Name
          </Label>
          <Input
            id="name"
            className="col-span-3"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-left">
            Email
          </Label>
          <Input
            id="email"
            className="w-full"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-left">
          Email me on
          </Label>
          <DateTimePicker setDate={setDate} date={date} setTime={setTime} time={time}/>
        </div>
      </div>
      <DialogFooter className="flex justify-end">
        <Button
          type="submit"
          onClick={sendEmailToClientWithReview}
          className="ml-auto"
          variant="ghost"
        >
          <Mail />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default EmailPostFiveStarReview;
