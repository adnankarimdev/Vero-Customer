import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"// adjust the path for shadcn components
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
  sendEmail: () => void;
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
  sendEmail,
}) => (
  <Dialog open={isWorryDialogOpen} onOpenChange={handleWorryRatingDialog}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex justify-center items-center">
          {worryTitle}
        </DialogTitle>
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
        <Button type="submit" onClick={sendEmail} className="ml-auto" variant="ghost">
          <Mail />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default WorryDialogContent;