export type KeywordCounts = {
  [key: string]: number;
};

export type Block = {
  id: string;
  type: "text" | "bullet";
  content: string;
};
export interface Place {
  name: string;
  formatted_address: string;
  place_id: string;
}

export interface CustomerReviewInfo {
  location: string; // Required string
  placeIdFromReview: string;
  rating: number; // Required number
  badges?: string[]; // Optional array of strings
  postedToGoogleReview?: boolean; // Defaults to false
  generatedReviewBody?: string; // Defaults to empty string
  finalReviewBody?: string; // Defaults to empty string
  emailSentToCompany?: boolean; // Defaults to false
  textSentForReview?: boolean;
  timeTakenToWriteReview?: number;
  reviewDate?: string;
  postedWithBubbleRatingPlatform?: boolean;
  postedWithInStoreMode?: boolean;
  reviewUuid?: string;
  pendingGoogleReview?: boolean;
}

export interface RatingSummary {
  rating: number;
  badges: string[];
  reviews: string[];
}

export interface LocationDataInfo {
  location: string;
  average_rating: number;
  total_reviews: number;
  ratings_summary: RatingSummary[];
}
