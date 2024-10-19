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
  customerEmail?: string;
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
  place_id: string;
  ratings_summary: RatingSummary[];
}

export interface PersonalReviewInfoFromSerializer {
  analyzed_review_details: object;
  badges: string; // This will be a JSON string initially
  email_sent_to_company: boolean;
  final_review_body: string;
  generated_review_body: string;
  id: number;
  location: string;
  place_id_from_review: string;
  posted_to_google_review: boolean;
  rating: number;
  time_taken_to_write_review_in_seconds: number;
  review_date?: string;
  internal_google_key_words?: string[];
  posted_with_bubble_rating_platform?: boolean;
  posted_with_in_store_mode?: boolean;
  pending_google_review?: boolean;
  posted_to_google_after_email_sent?: boolean;
  score_received?: number;
}

export type LocationInfo = {
  currentRating: number;
  currentTotalReviews: number;
  formatted_address: string;
  googleTypes: string[]; // array of strings
  name: string;
  place_id: string;
  websiteUrl: string;
};
