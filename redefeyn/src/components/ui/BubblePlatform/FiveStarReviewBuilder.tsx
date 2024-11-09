"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { CustomerReviewInfo } from "../../Types/types";
import { useRouter } from "next/navigation";
import copy from "copy-to-clipboard";
import axios from "axios";
import EmailSkeleton from "../Skeletons/EmailSkeleton";
import { useToast } from "@/hooks/use-toast";
import GoogleReviewDialogContent from "./GoogleReviewDialog";
import WorryDialogContent from "./WorryDialogContent";
import EmailPostFiveStarReview from "./EmailPostFiveStarReview";
import RatingBubbleCard from "./RatingBubbleCard";
import SpotifyPlatform from "../ExperimentalPlatforms/SpotifyBadgePlaylist";
import AirbnbPlatform from "../ExperimentalPlatforms/AirbnbPlatform";
import AmazonPlatform from "../ExperimentalPlatforms/AmazonPlatform";
import DoorDashPlatform from "../ExperimentalPlatforms/DoorDashPlatform";
import InstagramPlatform from "../ExperimentalPlatforms/InstagramPlatform";
import DuolingoPlatform from "../ExperimentalPlatforms/DuolingoPlatform";
import NetflixPlatform from "../ExperimentalPlatforms/NetflixPlatform";
import YouTubePlatform from "../ExperimentalPlatforms/YouTubePlatform";
import NewYorkTimesPlatform from "../ExperimentalPlatforms/NewYorkTimesPlatform";
import MediumPlatform from "../ExperimentalPlatforms/MediumPlatform";
import PintrestPlatform from "../ExperimentalPlatforms/PintrestPlatform";

const defaultCategories = [
  {
    name: "Customer Service",
    badges: [
      "Friendly staff",
      "Quick service",
      "Attentive",
      "Knowledgeable",
      "Accommodating",
    ],
  },
  {
    name: "Ambiance and Environment",
    badges: [
      "Cozy atmosphere",
      "Great view",
      "Convenient parking",
      "Quiet area",
      "Outdoor seating",
    ],
  },
  {
    name: "Quality of Items",
    badges: [
      "Rich flavor",
      "Perfect temperature",
      "Great variety",
      "Ethically sourced",
      "Unique blends",
    ],
  },
];

type SelectedBadges = {
  [key: string]: string[];
};

interface FiveStarReviewBuilderProps {
  buisnessName: string;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  placeId: string;
  keywords?: string[];
  worryRating: number;
  worryBody?: string;
  worryTitle?: string;
  bubbleRatingPlatform?: boolean;
  showEmailWorryDialog?: boolean;
  inStoreMode?: boolean;
  onlineBusinessMode?: boolean;
  formattedAddress?: string;
  chosenIcon?: string;
}

export default function FiveStarReviewBuilder({
  buisnessName,
  placeId,
  rating,
  setRating,
  keywords,
  worryBody,
  worryTitle,
  bubbleRatingPlatform,
  showEmailWorryDialog,
  worryRating,
  inStoreMode,
  onlineBusinessMode,
  formattedAddress,
  chosenIcon,
}: FiveStarReviewBuilderProps) {
  const router = useRouter();
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const [selectedBadges, setSelectedBadges] = useState<SelectedBadges>({
    Service: [],
    Location: [],
    Coffee: [],
  });
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedReview, setGeneratedReview] = useState("");
  const [categories, setCategories] = useState(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
  const hasFetched = useRef(false);
  const [initialGeneratedRevieBody, setInitialGeneratedReviewBody] =
    useState("");
  const [timeTakenToWriteReview, setTimeTakenToWriteReview] = useState(0);
  const [sendingEmail, setIsSendingEmail] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isWorryDialogOpen, setIsWorryDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isEmailReviewDialogOpen, setIsEmailReviewDialogOpen] = useState(false);
  const [worryDialog, setWorryDialog] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [overallRating, setOverallRating] = useState(0);
  const [sendEmailNow, setSendEmailNow] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+1");
  const [cardDescription, setCardDescription] = useState("");
  const [tone, setTone] = useState("friendly");
  const [customerEmail, setCustomerEmail] = useState("");
  const [alreadyPostedToGoogle, setAlreadyPostedToGoogle] = useState(false);
  const [generatedSentences, setGeneratedSentences] = useState([]);
  const [showAnimatedBeam, setShowAnimatedBeam] = useState(false);
  const [airDropUrl, setAirDropUrl] = useState("");
  let globalRating = 0;
  const positiveTones = [
    "friendly 🤗",
    "positive 😊",
    "Local Guide 🦮",
    "enthusiastic 😃",
    "grateful 🙏",
    "hopeful 🌟",
    "excited 🎉",
    "informative 📝",
    "happy 😄",
    "satisfied 😌",
    "appreciative 💖",
    "cheerful 😁",
  ];

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long", // 'long' for full month name (e.g., 'September')
      day: "numeric", // numeric day of the month (e.g., 5)
      year: "numeric", // numeric year (e.g., 2024)
      hour: "2-digit", // 2-digit hour (e.g., 14 for 2 PM)
      minute: "2-digit", // 2-digit minute (e.g., 30)
      second: "2-digit", // 2-digit second (e.g., 00)
      hour12: true, // use 24-hour time format
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex =
      /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateForm = (method: string): boolean => {
    if (!userName) {
      toast({
        title: "Please enter your name.",
        duration: 2000,
        variant: "destructive",
      });
      return false;
    }

    if (!phoneNumber && method !== "airdrop") {
      // If no phone number, perform email validation
      if (!userEmail && method !== "airdrop") {
        toast({
          title: "Please enter your email.",
          duration: 2000,
          variant: "destructive",
        });
        return false;
      }

      if (!validateEmail(userEmail) && method !== "airdrop") {
        toast({
          title: "Please enter a valid email.",
          duration: 2000,
          variant: "destructive",
        });
        return false;
      }
    } else if (phoneNumber && method !== "airdrop") {
      if (!validatePhoneNumber(phoneNumber) && method !== "airdrop") {
        toast({
          title: "Please enter a valid phone number.",
          duration: 2000,
          variant: "destructive",
        });
        return false;
      }
    }

    if ((!date || !time) && method !== "airdrop") {
      toast({
        title: "Please select a date and time.",
        duration: 2000,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const toggleBadge = (category: string, badge: string) => {
    setSelectedBadges((prev) => {
      const categoryBadges = prev[category] || [];
      const updatedCategoryBadges = categoryBadges.includes(badge)
        ? categoryBadges.filter((b) => b !== badge)
        : [...categoryBadges, badge];

      return {
        ...prev,
        [category]: updatedCategoryBadges,
      };
    });
  };

  const handleGenerateReview = () => {
    // Keep Note of this: for the kiosk mode.
    if (overallRating > worryRating && inStoreMode) {
      setIsEmailReviewDialogOpen(true);
      return;
    }
    setIsAlertDialogOpen(false);
    setIsLoading(true);
    const contextToSend =
      "Business Name:\n" +
      buisnessName +
      "\n" +
      "User Rating:\n" +
      rating +
      "\n" +
      "User Selected Badges:\n" +
      JSON.stringify(selectedBadges) +
      "\n" +
      "Keywords:\n" +
      JSON.stringify(keywords);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/generate-five-star-review/`,
        {
          context: contextToSend,
        },
      )
      .then((response) => {
        setGeneratedSentences(JSON.parse(response.data.content)["sentences"]);
        // setGeneratedReview(response.data.content);
        setInitialGeneratedReviewBody(response.data.content);
        setIsAlertDialogOpen(false);
        setIsDialogOpen(true);
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Failed",
          description: "Failed to generate review. Could you try again? 🥺",
          duration: 1000,
        });
        setIsLoading(false);
      });
  };

  const handleSaveReviewWithoutGenerate = async () => {
    //send data to backend to process.
    setIsLoading(true);
    setIsWorryDialogOpen(false);
    setIsAlertDialogOpen(false);
    setIsEmailReviewDialogOpen(false);
    const allBadges: string[] = Object.entries(selectedBadges).flatMap(
      ([category, badges]) => badges.map((badge) => `${badge}`),
    );
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: overallRating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: false,
      generatedReviewBody: "",
      finalReviewBody: "",
      emailSentToCompany: false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform:
        rating > worryRating || inStoreMode ? true : bubbleRatingPlatform,
      postedWithInStoreMode: inStoreMode,
      reviewUuid: uuidv4(),
      customerEmail: customerEmail,
    };
    console.log(customerEmail);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-customer-review/`,
        {
          data: dataToSave,
        },
      )
      .then((response) => {
        //  setIsLoading(false);
        if (inStoreMode) {
          toast({
            title: "Thank you for your feedback!",
            duration: 1000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          router.push("/thankyou");
        }
      })
      .catch((error) => {
        //  setIsLoading(false);
        toast({
          title: "Thank you for your feedback!",
          duration: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  };
  const handleWorryRatingDialog = async () => {
    setIsWorryDialogOpen(false);
    setIsEmailReviewDialogOpen(false);
    setIsSendingEmail(true);
    const allBadges: string[] = Object.entries(selectedBadges).flatMap(
      ([category, badges]) => badges.map((badge) => `${badge}`),
    );
    //save data here
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: globalRating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: false,
      generatedReviewBody: initialGeneratedRevieBody,
      finalReviewBody: generatedReview,
      emailSentToCompany: false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform:
        rating > worryRating || inStoreMode ? true : bubbleRatingPlatform,
      postedWithInStoreMode: inStoreMode,
      reviewUuid: uuidv4(),
      customerEmail: customerEmail,
    };
    console.log(customerEmail);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-customer-review/`,
        {
          data: dataToSave,
        },
      )
      .then((response) => {
        if (inStoreMode) {
          toast({
            title: "Thank you for your feedback!",
            duration: 1000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          router.push("/thankyou");
        }
      })
      .catch((error) => {
        // setIsLoading(false);
        toast({
          title: "Thank you for your feedback!",
          duration: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
  };
  const handlePostGeneratedReviewToGoogle = async () => {
    //send data to backend to process.
    // copy immediately. If not, works janky on mobile browsers.
    // Also, don't open a new tab. Direct them straight there.
    // Saves us having to reload the page again. so all good!
    copy(generatedReview);
    setIsLoading(true);
    setShowAnimatedBeam(true);
    const allBadges: string[] = Object.entries(selectedBadges).flatMap(
      ([category, badges]) => badges.map((badge) => `${badge}`),
    );
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: overallRating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: true,
      generatedReviewBody: initialGeneratedRevieBody,
      finalReviewBody: generatedReview,
      emailSentToCompany: false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform:
        rating > worryRating || inStoreMode ? true : bubbleRatingPlatform,
      postedWithInStoreMode: inStoreMode,
      reviewUuid: uuidv4(),
      customerEmail: customerEmail,
    };
    console.log(customerEmail);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-customer-review/`,
        {
          data: dataToSave,
        },
      )
      .then((response) => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });

    toast({
      title: "Your text is ready to paste!",
      description:
        "Your review has been copied to the clipboard! You can now paste it into the Google review form.",
      duration: 1000,
    });

    setTimeout(() => {
      window.location.href = reviewUrl;
    }, 2000);
  };
  useEffect(() => {
    startTimer();
    const email = localStorage.getItem("customerEmail");
    if (email) {
      setCustomerEmail(email);
    }

    const fetchCategories = async () => {
      if (hasFetched.current) return;

      hasFetched.current = true;
      const clientCategories = await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-client-categories/${placeId}/`,
        )
        .then((response) => {
          setCategories(response.data.categories);
          setCardDescription(response.data.card_description);
          setIsLoading(false);
        })
        .catch((error) => {
          setCategories(defaultCategories);
          setIsLoading(false);
        });

      if (email) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/already-posted-to-google/`,
            {
              customerEmail: email,
              placeId: placeId,
            },
          )
          .then((response) => {
            setAlreadyPostedToGoogle(response.data.data);
          })
          .catch((error) => {
            setAlreadyPostedToGoogle(false);
          });
      }
    };

    fetchCategories();
  }, [placeId]);

  const startTimer = () => {
    startTimeRef.current = Date.now();
  };

  const translateLanguage = async (language: string) => {
    setIsLoading(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/translate-language/`,
        {
          context: categories,
          language: language,
        },
      )
      .then((response) => {
        const generatedQuestions = response.data["content"]
          .replace(/```json/g, "")
          .replace(/```/g, "");
        const translatedBadgesAsJson = JSON.parse(generatedQuestions);
        setCategories(translatedBadgesAsJson["categories"]);
        toast({
          title: "Success",
          description: "Badges translated.",
          duration: 1000,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: "Failed to generate",
          description: "try again",
          duration: 1000,
        });
      });
  };
  const sendEmailToClientWithReview = async (method = "notAirdrop") => {
    if (!validateForm(method)) {
      return;
    }
    if (method === "airdrop") {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        ),
        title: `Airdrop Initiated 🚀`,
        description: "Go ahead and save the link when ready.",
        duration: 3000,
      });
    } else {
      toast({
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        ),
        title: `You're good to go 😇`,
        description: "Thank you!",
        duration: 3000,
      });
    }
    if (method !== "airdrop") {
      setIsSendingEmail(true);
      setIsEmailReviewDialogOpen(false);
    }

    const allBadges: string[] = Object.entries(selectedBadges).flatMap(
      ([category, badges]) => badges.map((badge) => `${badge}`),
    );
    //save data here
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: overallRating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: false,
      generatedReviewBody: initialGeneratedRevieBody,
      finalReviewBody: generatedReview,
      emailSentToCompany: phoneNumber != "" ? false : true,
      textSentForReview: phoneNumber != "" ? true : false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform:
        rating > worryRating || inStoreMode ? true : bubbleRatingPlatform,
      postedWithInStoreMode: inStoreMode,
      reviewUuid: uuidv4(),
      pendingGoogleReview: true,
      customerEmail: customerEmail,
    };
    console.log(customerEmail);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-customer-review/`,
        {
          data: dataToSave,
        },
      )
      .then((response) => {
        // setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Thank you for your feedback!",
          duration: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        // setIsLoading(false);
      });

    const contextToSend =
      "Business Name:\n" +
      buisnessName +
      "\n" +
      "User Rating:\n" +
      rating +
      "\n" +
      "User Selected Badges:\n" +
      JSON.stringify(selectedBadges) +
      "\n" +
      "Keywords:\n" +
      JSON.stringify(keywords) +
      "\n" +
      "Review Tone:\n" +
      tone;

    return axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/send-email-to-post-later/`,
        {
          context: contextToSend,
          userEmailToSend: userEmail,
          userNameToSend: userName,
          googleReviewUrl: reviewUrl,
          reviewUuid: dataToSave.reviewUuid,
          date: date?.toISOString(),
          time: time,
          sendEmailNow: sendEmailNow,
          phoneNumber: phoneNumber,
          tone: tone,
          buisnessName: buisnessName,
          badges: allBadges,
          placeIdFromReview: placeId,
        },
      )
      .then((response) => {
        if (response.data.url) {
          console.log(response.data.url);
          setAirDropUrl(response.data.url);
          return response.data.url;
        }
        setIsEmailReviewDialogOpen(false);
        if (inStoreMode) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          router.push("/thankyou");
        }
      })
      .catch((error) => {
        setIsSendingEmail(false);
        // toast({
        //   title: "Error",
        //   description: "Failed to send email. That's on us. ",
        //   duration: 1000,
        // });
        if (inStoreMode) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          router.push("/thankyou");
        }
      });
  };
  const sendEmail = async () => {
    setIsSendingEmail(true);
    const allBadges: string[] = Object.entries(selectedBadges).flatMap(
      ([category, badges]) => badges.map((badge) => `${badge}`),
    );
    //save data here
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: overallRating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: false,
      generatedReviewBody: initialGeneratedRevieBody,
      finalReviewBody: generatedReview,
      emailSentToCompany: true,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform:
        rating > worryRating || inStoreMode ? true : bubbleRatingPlatform,
      postedWithInStoreMode: inStoreMode,
      reviewUuid: uuidv4(),
      customerEmail: customerEmail !== "" ? customerEmail : userEmail, //if not logged in, use the userEmail provided. Assuming they have an account.
    };
    console.log(customerEmail);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/save-customer-review/`,
        {
          data: dataToSave,
        },
      )
      .then((response) => {
        // setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Thank you for your feedback!",
          duration: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        // setIsLoading(false);
      });
    const context =
      "User Rating:" +
      rating.toString() +
      " " +
      "Questions answering: \n" +
      "No questions given" +
      "\n";
    const userReviews =
      context + "User Review Selected Badges:\n" + allBadges.join("\n");
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/send-email/`, {
        userEmailToSend: userEmail,
        userNameToSend: userName,
        userReviewToSend: userReviews,
        buisnessName: buisnessName,
        placeId: placeId,
      })
      .then((response) => {
        setIsSendingEmail(false);
        setIsWorryDialogOpen(false);
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          ),
          title: "Email Sent",
          description: "Thank you for giving us a chance to make things right.",
          duration: 3000,
        });
        if (inStoreMode) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          router.push("/thankyou");
        }
      })
      .catch((error) => {
        setIsSendingEmail(false);
        toast({
          title: "Error",
          description: "Failed to send email.",
          duration: 1000,
        });
      });
  };

  // Function to calculate average rating, excluding invalid ratings
  const calculateAverageRating = (ratings: {
    [key: string]: number | null | undefined;
  }): number => {
    // Filter out invalid ratings (null, undefined, or invalid numbers)
    const validRatings = Object.values(ratings).filter(
      (rating): rating is number => typeof rating === "number" && rating != 0,
    );

    // Calculate the sum of valid ratings
    const sum = validRatings.reduce((total, rating) => total + rating, 0);

    // Calculate average
    const average = validRatings.length ? sum / validRatings.length : 0;

    return average;
  };

  const stopTimer = (categoryRatings: { [key: string]: number }) => {
    const localOverallRating = calculateAverageRating(categoryRatings);
    globalRating = localOverallRating;
    setOverallRating(calculateAverageRating(categoryRatings));
    // TODO: hacky way, we should just define overallRating, setOverallRating in SmartReviewBuilder
    setRating(localOverallRating);
    if (startTimeRef.current === null) {
      return;
    }
    endTimeRef.current = Date.now();
    const duration = (endTimeRef.current - startTimeRef.current) / 1000;
    setTimeTakenToWriteReview(duration);

    //Online business mode? go directly to end of review
    if (onlineBusinessMode) {
      handleWorryRatingDialog();
    } else if (localOverallRating <= worryRating && showEmailWorryDialog) {
      setIsWorryDialogOpen(true);
    } else if (localOverallRating > worryRating && !alreadyPostedToGoogle) {
      setIsAlertDialogOpen(true);
    }
    // no email dialog by client, make sure to save the badges.
    else {
      handleWorryRatingDialog();
    }
  };

  const handleGoogleReviewDialogChange = () => {
    handleSaveReviewWithoutGenerate();
    setIsDialogOpen(false);
  };

  //This is the google dialog for immediate rating. I think unused.
  if (isDialogOpen && rating > worryRating) {
    return (
      <GoogleReviewDialogContent
        isDialogOpen={isDialogOpen}
        generatedReview={generatedReview}
        setGeneratedReview={setGeneratedReview}
        generatedSentences={generatedSentences}
        customerEmail={customerEmail}
        setCustomerEmail={setCustomerEmail}
        inStoreMode={inStoreMode}
        handlePostGeneratedReviewToGoogle={handlePostGeneratedReviewToGoogle}
        handleGoogleReviewDialogChange={handleGoogleReviewDialogChange}
        showAnimatedBeam={showAnimatedBeam}
        allBadges={Object.entries(selectedBadges).flatMap(
          ([category, badges]) => badges.map((badge) => `${badge}`),
        )}
      />
    );
  }

  if (isWorryDialogOpen && showEmailWorryDialog && !sendingEmail) {
    return (
      <WorryDialogContent
        isWorryDialogOpen={isWorryDialogOpen}
        worryTitle={worryTitle}
        worryBody={worryBody}
        userName={userName}
        handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        setUserName={setUserName}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        handleWorryRatingDialog={handleWorryRatingDialog}
        sendEmail={sendEmail}
        inStoreMode={inStoreMode}
        customerEmail={customerEmail}
        setCustomerEmail={setCustomerEmail}
      />
    );
  }

  if (isEmailReviewDialogOpen) {
    if (!inStoreMode) {
      return (
        <GoogleReviewDialogContent
          isDialogOpen={isDialogOpen}
          generatedReview={generatedReview}
          setGeneratedReview={setGeneratedReview}
          generatedSentences={generatedSentences}
          handlePostGeneratedReviewToGoogle={handlePostGeneratedReviewToGoogle}
          handleGoogleReviewDialogChange={handleGoogleReviewDialogChange}
          customerEmail={customerEmail}
          setCustomerEmail={setCustomerEmail}
          inStoreMode={inStoreMode}
          showAnimatedBeam={showAnimatedBeam}
          allBadges={Object.entries(selectedBadges).flatMap(
            ([category, badges]) => badges.map((badge) => `${badge}`),
          )}
        />
      );
    } else {
      return (
        <EmailPostFiveStarReview
          isEmailReviewDialogOpen={isEmailReviewDialogOpen}
          userName={userName}
          setUserName={setUserName}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          handleWorryRatingDialog={handleWorryRatingDialog}
          handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
          sendEmailToClientWithReview={sendEmailToClientWithReview}
          setDate={setDate}
          date={date}
          setTime={setTime}
          time={time}
          setSendEmailNow={setSendEmailNow}
          setPhoneNumber={setPhoneNumber}
          phoneNumber={phoneNumber}
          positiveTones={positiveTones}
          setTone={setTone}
          tone={tone}
          airDropUrl={airDropUrl}
        />
      );
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {sendingEmail && <EmailSkeleton />}
      {!sendingEmail && (
        <RatingBubbleCard
          businessName={buisnessName}
          rating={rating}
          setRating={setRating}
          categories={categories}
          selectedBadges={selectedBadges}
          setSelectedBadges={setSelectedBadges}
          toggleBadge={toggleBadge}
          isLoading={isLoading}
          isAlertDialogOpen={isAlertDialogOpen}
          handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
          handleGenerateReview={handleGenerateReview}
          stopTimer={stopTimer}
          sendingEmail={sendingEmail}
          inStoreMode={inStoreMode}
          worryRating={worryRating}
          translateLanguage={translateLanguage}
          cardDescription={cardDescription}
          formattedAddress={formattedAddress}
          chosenIcon={chosenIcon}
        />

        // <TinderPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <PintrestPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <MediumPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <NewYorkTimesPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <YouTubePlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <SpotifyPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode} />

        // <AirbnbPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <AmazonPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <DoorDashPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <InstagramPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <DuolingoPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>

        // <NetflixPlatform
        // businessName={buisnessName}
        // rating={rating}
        // categories={categories}
        // selectedBadges={selectedBadges}
        // toggleBadge={toggleBadge}
        // isLoading={isLoading}
        // isAlertDialogOpen={isAlertDialogOpen}
        // handleSaveReviewWithoutGenerate={handleSaveReviewWithoutGenerate}
        // handleGenerateReview={handleGenerateReview}
        // stopTimer={stopTimer}
        // sendingEmail={sendingEmail}
        // inStoreMode={inStoreMode}/>
      )}
    </div>
  );
}
