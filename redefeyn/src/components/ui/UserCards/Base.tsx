import { Card } from "@/components/ui/card"
import { Badge } from "../badge"
import { Label } from "@/components/ui/label"
import { UserSerializer } from "@/components/Types/types"

export default function UserSettings({
  userInformation,
}: {
  userInformation: Partial<UserSerializer>
}) {
  return (
    <Card className="w-[300px] h-[420px] mx-auto bg-gradient-to-b from-purple-400 to-purple-100 text-black rounded-xl overflow-hidden shadow-xl">
      <div className="h-1/2 relative">
        <div className="absolute top-2 left-2 bg-white rounded-full p-1">
          <div className="text-3xl font-bold">{userInformation.user_score || '??'}</div>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 bg-gray-300 rounded-full border-4 border-yellow-400 overflow-hidden">
          {/* Placeholder for user avatar */}
          <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="h-1/2 pt-20 px-4 space-y-2">
        <h2 className="text-center text-xl font-bold truncate">{userInformation.username || 'Username'}</h2>
        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <Label className="text-xs">REGULAR</Label>
            <div className="font-bold">{userInformation.user_regular_reviews || '0'}</div>
          </div>
          <div>
            <Label className="text-xs">GOOGLE</Label>
            <div className="font-bold">{userInformation.user_google_reviews || '0'}</div>
          </div>
          <div>
            <Label className="text-xs">SCORE</Label>
            <div className="font-bold">{userInformation.user_score || '0'}</div>
          </div>
        </div>
        <div className="text-center text-sm mt-2 truncate">
          {userInformation.email || 'email@example.com'}
        </div>
        <div className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center">
          {/* Placeholder for club/app logo */}
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </Card>
  )
}