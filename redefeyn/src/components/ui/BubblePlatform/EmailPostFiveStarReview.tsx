import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // adjust the path for shadcn components
import { cn } from "@/lib/utils";
import DateTimePicker from "../shared/DateTimePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import PhoneInput from "react-phone-input-2";
// import 'react-phone-input-2/lib/style.css'

interface EmailPostFiveStarReviewProps {
  isEmailReviewDialogOpen: boolean;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  handleWorryRatingDialog: (open: boolean) => void;
  handleSaveReviewWithoutGenerate: () => void;
  sendEmailToClientWithReview: () => void;
  setDate: (date: Date) => void;
  date?: Date;
  setTime: (time: string) => void;
  time: string;
  setSendEmailNow: (emailNow: boolean) => void;
  setPhoneNumber: (phone: string) => void;
  phoneNumber?: string;
}

const EmailPostFiveStarReview: React.FC<EmailPostFiveStarReviewProps> = ({
  isEmailReviewDialogOpen,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  handleWorryRatingDialog,
  handleSaveReviewWithoutGenerate,
  sendEmailToClientWithReview,
  setDate,
  date,
  setTime,
  time,
  setSendEmailNow,
  setPhoneNumber,
  phoneNumber,
}) => {
  const [method, setMethod] = useState<"email" | "phone" | null>(null); // State for selected method

  return (
    <Dialog
      open={isEmailReviewDialogOpen}
      onOpenChange={handleSaveReviewWithoutGenerate}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center">
            {"You're the best 🤩"}
          </DialogTitle>
          <DialogDescription>
            {
              "Go ahead and give us your name and preferred contact method, and it'll be in your inbox or phone soon! 💌"
            }
          </DialogDescription>
        </DialogHeader>

        {/* Name input */}
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

          {/* Selection buttons for email or phone */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-left">
              Preferred Contact Method:
            </Label>
            <div className="flex flex-row gap-2">
              {" "}
              {/* Change to flex-row */}
              <Button
                variant={method === "email" ? "default" : "ghost"}
                onClick={() => {
                  setMethod("email");
                  setPhoneNumber("");
                }}
                className="flex items-center gap-2"
              >
                <Mail />
              </Button>
              <Button
                variant={method === "phone" ? "default" : "ghost"}
                onClick={() => {
                  setMethod("phone");
                  setUserEmail("");
                }}
                className="flex items-center gap-2"
              >
                <Phone />
              </Button>
            </div>
          </div>

          {/* Conditionally render the email or phone input field */}
          {method === "email" && (
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
          )}

          {method === "phone" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-left">
                Phone Number
              </Label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          )}

          {/* DateTimePicker */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-left">
              Send On
            </Label>
            <DateTimePicker
              setDate={setDate}
              date={date}
              setTime={setTime}
              time={time}
              setSendEmailNow={setSendEmailNow}
            />
          </div>
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="flex justify-end">
          <Button
            type="submit"
            onClick={sendEmailToClientWithReview}
            className="ml-auto"
            variant="ghost"
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPostFiveStarReview;
