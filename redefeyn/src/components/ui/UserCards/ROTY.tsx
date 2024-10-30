"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserSerializer } from "../../Types/types";

export default function ROTY({
  userInformation,
}: {
  userInformation: Partial<UserSerializer>;
}) {
  return (
    <Card className="w-[250px] h-[350px] mx-auto bg-[#0a1c2e] text-white rounded-2xl overflow-hidden shadow-xl border border-[#2a4a6d] relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1c2e] via-[#1a3a5c] to-[#0a1c2e]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzBhMWMyZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1c2e] via-transparent to-transparent"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/10 via-[#ffd700]/5 to-transparent animate-shimmer"></div>
      <div className="relative h-[40%]">
        <div className="absolute top-2 left-2 bg-[#ffd700] rounded-full p-1 shadow-lg">
          <div className="text-3xl font-bold text-[#0a1c2e]">
            {userInformation.user_score || "??"}
          </div>
        </div>
        <div className="absolute -bottom-12 left-4 w-24 h-24 bg-[#1a3a5c] rounded-full border-4 border-[#ffd700] overflow-hidden shadow-lg">
          <svg
            className="w-full h-full text-[#2a4a6d]"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div className="relative h-[60%] pt-16 px-4 space-y-2">
        <h2 className="text-left text-xl font-bold truncate text-[#ffd700]">
          {userInformation.username || "Username"}
        </h2>
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="bg-[#1a3a5c] rounded-md py-1">
            <Label className="text-xs text-[#7a9cc6]">REG</Label>
            <div className="font-bold text-lg text-[#ffd700]">
              {userInformation.user_regular_reviews || "0"}
            </div>
          </div>
          <div className="bg-[#1a3a5c] rounded-md py-1">
            <Label className="text-xs text-[#7a9cc6]">GOO</Label>
            <div className="font-bold text-lg text-[#ffd700]">
              {userInformation.user_google_reviews || "0"}
            </div>
          </div>
          <div className="bg-[#1a3a5c] rounded-md py-1">
            <Label className="text-xs text-[#7a9cc6]">SCR</Label>
            <div className="font-bold text-lg text-[#ffd700]">
              {userInformation.user_score || "0"}
            </div>
          </div>
        </div>
        <div className="text-left text-sm mt-2 truncate text-[#7a9cc6]">
          {userInformation.email || "email@example.com"}
        </div>
        <div className="absolute bottom-2 right-2 w-12 h-12 bg-[#1a3a5c] rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-8 h-8 text-[#ffd700]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
}
