import { useState } from "react";
import { Badge } from "../badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // adjust the path for shadcn components
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import QuickAuthPage from "../QuickAuthPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface WorryDialogContentProps {
  isWorryDialogOpen: boolean;
  worryTitle?: string;
  worryBody?: string;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  handleWorryRatingDialog: (open: boolean) => void;
  handleSaveReviewWithoutGenerate: () => void;
  sendEmail: () => void;
  customerEmail?: string;
  setCustomerEmail?: (email: string) => void;
  inStoreMode?: boolean;
}

const WorryDialogContent: React.FC<WorryDialogContentProps> = ({
  isWorryDialogOpen,
  worryTitle,
  worryBody,
  userName,
  setUserName,
  userEmail,
  setUserEmail,
  handleWorryRatingDialog,
  handleSaveReviewWithoutGenerate,
  sendEmail,
  customerEmail,
  setCustomerEmail,
  inStoreMode,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Dialog
      open={isWorryDialogOpen}
      onOpenChange={handleSaveReviewWithoutGenerate}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center">
            {worryTitle}
          </DialogTitle>
          {!inStoreMode && customerEmail === "" && (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger>
                <Badge
                  className={cn(
                    "bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium mt-2 mb-2 ",
                  )}
                >
                  {"Sign up/Log in to Receieve Vero Points: 0.5 "}
                </Badge>
              </DrawerTrigger>
              <DrawerContent className="items-center">
                <DrawerHeader>
                  <DrawerTitle>Get rewarded for your reviews!</DrawerTitle>
                  <DrawerDescription>
                    {"You'll get 0.5 Vero Point for posting this to google."}
                  </DrawerDescription>
                </DrawerHeader>
                <QuickAuthPage
                  setCustomerEmail={setCustomerEmail}
                  onDrawerClose={handleDrawerClose}
                />
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
          <DialogDescription>{worryBody}</DialogDescription>
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
        </div>
        <DialogFooter className="flex justify-end">
          <Button
            type="submit"
            onClick={sendEmail}
            className="ml-auto"
            variant="ghost"
          >
            <Mail />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorryDialogContent;
