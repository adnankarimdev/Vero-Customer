import { flattenedIconMap } from "@/utils/IconList";

export type KeywordCounts = {
  [key: string]: number;
};

export type IconMapType = typeof flattenedIconMap;

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
  offer: string;
  showOffer: boolean;
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
  offer: string;
  showOffer: boolean;
};

export type UserSerializer = {
  avatar_svg: string; // SVG string for the avatar
  date_joined: string; // ISO date string
  email: string;
  first_name: string;
  google_reviewed_places: string[]; // Array of place IDs as strings
  groups: string[]; // Array of group names or IDs (if any)
  id: number;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string; // ISO date string
  last_name: string;
  password: string;
  place_review_dates: Record<string, string>; // Mapping of place IDs to review dates as ISO strings
  places_reviewed: string[]; // Array of place IDs as strings
  user_google_reviews: number;
  user_permissions: string[]; // Array of permissions (if any)
  user_regular_reviews: number;
  user_reviews: Record<string, unknown>; // Flexible structure for additional review data, adjust as needed
  user_score: number; // User score as a numeric value
  username: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};
