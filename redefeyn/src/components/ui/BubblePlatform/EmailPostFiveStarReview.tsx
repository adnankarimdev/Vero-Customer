import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // adjust the path for shadcn components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  sendEmailToClientWithReview: (method?: any) => Promise<any>;
  setDate: (date: Date) => void;
  date?: Date;
  setTime: (time: string) => void;
  time: string;
  setSendEmailNow: (emailNow: boolean) => void;
  setPhoneNumber: (phone: string) => void;
  phoneNumber?: string;
  positiveTones: string[];
  tone: string;
  setTone: (tone: string) => void;
  airDropUrl?: string;
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
  positiveTones,
  tone,
  setTone,
  airDropUrl,
}) => {
  const [method, setMethod] = useState<"email" | "phone" | "airdrop" | null>(
    null,
  ); // State for selected method
  const { toast } = useToast();

  const handleShareLink = async () => {
    const response = await sendEmailToClientWithReview("airdrop");
    if (response && navigator.share && userName) {
      try {
        await navigator.share({
          title: `For ${userName}, With Good Vibes ❤️: `,
          url: airDropUrl,
        });
        console.log("Link shared successfully");
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          ),
          title: `You're good to go 😇`,
          description: "Thank you!",
          duration: 3000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err) {
        console.error("Error sharing: ", err);
      }
    } else {
      console.warn("Web Share API not supported in this browser.");
    }
  };

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
            {method && method !== "airdrop" && (
              <div className="text-center">
                <span
                  className={`text-orange-500 mr-2 ${userName.length > 10 ? "line-through" : ""}`}
                  style={{
                    textDecorationThickness:
                      userName.length > 0 ? `${2}px` : "0px",
                    transition: "text-decoration-thickness 0.3s ease-in-out",
                  }}
                >
                  Name.
                </span>
                <span
                  className={`text-blue-500 mr-2 ${method ? "line-through" : ""}`}
                  style={{
                    textDecorationThickness: method ? `${2}px` : "0px",
                    transition: "text-decoration-thickness 0.3s ease-in-out",
                  }}
                >
                  Contact.
                </span>
                <span
                  className={`text-purple-500 mr-2 ${date && time ? "line-through" : ""}`}
                  style={{
                    textDecorationThickness: date && time ? `${2}px` : "0px",
                    transition: "text-decoration-thickness 0.3s ease-in-out",
                  }}
                >
                  Time.
                </span>
                <span className="text-emerald-500 mr-2">Sent.</span>
              </div>
            )}
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
                variant={"ghost"}
                onClick={() => {
                  setMethod("email");
                  setPhoneNumber("");
                }}
                className="flex items-center gap-2"
              >
                <Mail />
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => {
                  setMethod("phone");
                  setUserEmail("");
                }}
                className="flex items-center gap-2"
              >
                <Phone />
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => {
                  setMethod("airdrop");
                  handleShareLink();
                }}
                className="flex items-center gap-2"
              >
                <span className="bg-gradient-to-r from-purple-500 to-rose-400 text-xs font-medium text-center mb-2 bg-clip-text text-transparent">
                  {"Airdrop"}
                </span>
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
          {(method === "email" || method === "phone") && (
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
          )}
        </div>

        {/* Dialog Footer */}
        <DialogFooter className="flex justify-end">
          <Button
            type="submit"
            onClick={sendEmailToClientWithReview}
            className="ml-auto"
            variant="outline"
            disabled={!method || method === "airdrop"}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPostFiveStarReview;
