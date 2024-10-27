import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSerializer } from "../Types/types";

export default function UserSettings({
  userInformation,
}: {
  userInformation: Partial<UserSerializer>;
}) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
        <CardDescription>
          View your account information and statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="email"
                value={userInformation.email}
                disabled
                className="flex-1 text-black disabled:opacity-900 disabled:bg-white-900"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={userInformation.username}
              disabled
              className="flex-1 text-black disabled:opacity-900 disabled:bg-white-900"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vero Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regular-reviews">Regular Reviews</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="regular-reviews"
                  value={userInformation.user_regular_reviews}
                  disabled
                  className="flex-1 text-black disabled:opacity-900 disabled:bg-white-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-reviews">Google Reviews</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="google-reviews"
                  value={userInformation.user_google_reviews}
                  disabled
                  className="flex-1 text-black disabled:opacity-900 disabled:bg-white-900"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-score">User Score</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="user-score"
                value={userInformation.user_score}
                disabled
                className="flex-1 text-black disabled:opacity-900 disabled:bg-white-900"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
