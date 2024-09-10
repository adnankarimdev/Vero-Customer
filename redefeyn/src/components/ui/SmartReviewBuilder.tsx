"use client";

import React, { useState, useEffect, useRef } from "react";
import { RiAiGenerate } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Send, Star, Mail, Mic, MicOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Place, CustomerReviewInfo } from "../Types/types";
import SpeechToElement from "speech-to-element";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Block } from "../Types/types";
import Logo from "./Logo";
import FiveStarReviewBuilder from "./FiveStarReviewBuilder";
import AnimatedTextareaSkeletonLoader from "./Skeletons/AnimatedSkeletonLoader";
import EmailSkeleton from "./Skeletons/EmailSkeleton";
import RatingCardSkeleton from "./Skeletons/RatingCardSkeleton";
import RecordingLoader from "./Skeletons/RecordingLoader";
import { Separator } from "./separator";

const categories = [
  {
    name: "Experience and Atmosphere",
    questions: [
      "What did you enjoy most about your visit to Phil and Sebastian? \n Did you try any of our specialty drinks? What did you think of them? \n Was the service at Phil and Sebastian up to your expectations?",
    ],
  },
];

interface SmartReviewProps {
  onChange?: (rating: number) => void;
  title?: string;
  id: string;
  inStoreMode?: boolean;
}

const SmartReviewBuilder = ({
  onChange,
  id,
  inStoreMode,
}: SmartReviewProps) => {
  const router = useRouter();
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState("P&S");
  const [keywords, setKeywords] = useState([]);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      questions: [
        "Could you tell us what went wrong during your visit to Phil and Sebastian?",
        "Was there a specific issue with our service or products that led to your dissatisfaction?",
        "How can we make things right and improve your experience for next time?",
      ],
    },
    {
      id: 2,
      questions: [
        "What aspects of your visit were disappointing, and how can we improve them?",
        "Were there any specific issues with our coffee, food, or service that we should address?",
        "Is there anything we could do differently to improve your overall experience?",
      ],
    },
    {
      id: 3,
      questions: [
        "What aspects of your experience at Phil and Sebastian could have been improved?",
        "Was there anything specific about our coffee or food that didn't meet your expectations?",
        "How was the service during your visit, and is there anything we could do to enhance it?",
      ],
    },
    {
      id: 4,
      questions: [
        "What did you enjoy the most about your visit to Phil and Sebastian?",
        "Is there one thing we could improve to turn your 4-star experience into a 5-star one?",
        "Were there any minor issues that you noticed during your visit that we could address?",
      ],
    },
    {
      id: 5,
      questions: [
        "What stood out the most during your visit to Phil and Sebastian?",
        "Did any of our specialty drinks or menu items leave a lasting impression?",
        "Is there anything else we can do to keep you coming back for more great experiences?",
      ],
    },
  ]);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "text", content: "" },
  ]);
  const [reviews, setReviews] = useState<string[]>(
    new Array(categories.length).fill(""),
  );
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [sophisticatedReview, setSophisticatedReview] = useState("");
  const [userReviewScore, setUserReviewScore] = useState("");
  const [userReviewSophisticatedScore, setUserReviewSophisticatedScore] =
    useState("");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorryDialogOpen, setIsWorryDialogOpen] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [placeholder, setPlaceholder] = useState("✍🏻");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showRatingsPage, setShowRatingsPage] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [worryRating, setWorryRating] = useState(1);
  const [worryDialog, setWorryDialog] = useState(false);
  const [worryBody, setWorryBody] = useState("");
  const [worryTitle, setWorryTitle] = useState("");
  const [usedReviewTemplate, setUsedReviewTemplate] = useState(false);
  const [isReviewTemplateLoading, setIsReviewTemplateLoading] = useState(false);
  const [timeTakenToWriteReview, setTimeTakenToWriteReview] = useState(0);
  const [sendingEmail, setIsSendingEmail] = useState(false);
  const [useBubblePlatform, setUseBubblePlatform] = useState(false);
  const [alertDialogDone, setAlertDialogDone] = useState(false);
  const [handleWithEmailSkeleton, showHandleWithoutEmailSkeleton] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startRecording, setStartRecording] = useState(false);

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
  useEffect(() => {
    setIsLoading(true);
    const fetchReviewSettings = async (placeId = id) => {
      try {
        const response = await axios.get(
          `https://vero.ngrok.dev/backend/get-review-questions/${placeId}/`,
        );
        console.log("my questions", response.data);
        setQuestions(response.data.questions);
        setWorryRating(response.data.worryRating);
        setWorryDialog(response.data.showWorryDialog);
        setWorryBody(response.data.dialogBody);
        setWorryTitle(response.data.dialogTitle);
        setKeywords(response.data.keywords);
        setUseBubblePlatform(response.data.useBubblePlatform);
        const reviewPlace = response.data.places.find(
          (place: Place) => place.place_id === id,
        );
        setTitle(reviewPlace.name);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchReviewSettings();
  }, []);

  useEffect(() => {
    // Check conditions to start the timer
    if (!showRatingsPage && rating <= worryRating) {
      startTimer();
    }
  }, [showRatingsPage, rating, worryRating]); // Only re-run when these change

  const startTimer = () => {
    startTimeRef.current = Date.now();
    console.log("Timer started");
  };

  const stopTimer = () => {
    if (startTimeRef.current === null) {
      console.log("Timer was not started");
      return;
    }
    endTimeRef.current = Date.now();
    const duration = (endTimeRef.current - startTimeRef.current) / 1000;
    console.log(`Timer stopped after ${duration} seconds`);
    setTimeTakenToWriteReview(duration);
  };

  const handleRating = (currentRating: number) => {
    setRating(currentRating);
    if (onChange) {
      onChange(currentRating);
    }
  };

  const handleRatingToReview = () => {
    setShowRatingsPage(false);
  };

  const handleReviewChange = (review: string) => {
    const newReviews = [...reviews];
    newReviews[currentStep] = review;
    setReviews(newReviews);
  };

  const handleGenerateReviewTemplate = () => {
    setUsedReviewTemplate(true);
    setIsReviewTemplateLoading(true);
    const contextToSend =
      "Business Name: " +
      title +
      "\n" +
      "User Rating: " +
      rating.toString() +
      "\n" +
      "Questions answering: " +
      "\n" +
      questions[rating - 1].questions.join("\n") +
      "\n";
    axios
      .post("https://vero.ngrok.dev/backend/generate-review-template/", {
        context: contextToSend,
      })
      .then((response) => {
        handleReviewChange(response.data.content);
        setIsReviewTemplateLoading(false);
      })
      .catch((error) => {
        setIsReviewTemplateLoading(false);
        toast({
          title: "Failed",
          description: "Failed to generate template.",
          duration: 1000,
        });
      });
  };
  const handleNext = () => {
    stopTimer();
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    setIsReviewComplete(true);
  };

  const handleSendReviewToBackendWithoutEmail = async () => {
    //save data here
    const dataToSave: CustomerReviewInfo = {
      location: title,
      rating: rating,
      placeIdFromReview: id,
      badges: [],
      postedToGoogleReview: false,
      generatedReviewBody: "",
      finalReviewBody: reviews.join("\n"),
      emailSentToCompany: false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform: useBubblePlatform,
      reviewUuid: uuidv4(),
    };
    await axios
      .post("https://vero.ngrok.dev/backend/save-customer-review/", {
        data: dataToSave,
      })
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
        console.log(error);
        window.location.reload();
      });
  };

  const handleSendReviewToBackendWithoutEmailAlert = async () => {
    //save data here
    setWorryDialog(false);
    const dataToSave: CustomerReviewInfo = {
      location: title,
      rating: rating,
      placeIdFromReview: id,
      badges: [],
      postedToGoogleReview: false,
      generatedReviewBody: "",
      finalReviewBody: reviews.join("\n"),
      emailSentToCompany: false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform: useBubblePlatform,
      reviewUuid: uuidv4(),
    };
    await axios
      .post("https://vero.ngrok.dev/backend/save-customer-review/", {
        data: dataToSave,
      })
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
        console.log(error);
        window.location.reload();
        // setIsLoading(false);
      });
  };

  const sendEmail = async () => {
    setIsSendingEmail(true);
    //save data here
    const dataToSave: CustomerReviewInfo = {
      location: title,
      rating: rating,
      placeIdFromReview: id,
      badges: [],
      postedToGoogleReview: false,
      generatedReviewBody: "",
      finalReviewBody: reviews.join("\n"),
      emailSentToCompany: true,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform: useBubblePlatform,
      reviewUuid: uuidv4(),
    };
    await axios
      .post("https://vero.ngrok.dev/backend/save-customer-review/", {
        data: dataToSave,
      })
      .then((response) => {
        // setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setIsLoading(false);
      });
    const context =
      "User Rating:" +
      rating.toString() +
      " " +
      "Questions answering: " +
      questions[rating - 1].questions.join("\n") +
      "\n";
    const userReviews = context + "User Review Body:\n" + reviews.join("\n");
    axios
      .post("https://vero.ngrok.dev/backend/send-email/", {
        userEmailToSend: userEmail,
        userNameToSend: userName,
        userReviewToSend: userReviews,
        buisnessName: title,
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

  const handleSpeechRecord = () => {
    const targetElement = document.getElementById("reviewArea");

    if (!startRecording && targetElement) {
      // Start speech recognition
      SpeechToElement.toggle("webspeech", {
        element: targetElement,
        displayInterimResults: true,
        onResult: (text, isFinal) => {
          if (isFinal) {
            handleReviewChange(text);
          }
        },
        onStop: () => {
          // Handle any actions after recording stops, if needed
        },
      });
      setStartRecording(true);
    } else {
      // Stop speech recognition
      SpeechToElement.stop(); // Assuming 'stop' is the correct method
      setStartRecording(false);
    }
  };

  if (isDialogOpen) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Veroed Review</DialogTitle>

            <Textarea
              defaultValue={sophisticatedReview}
              className="w-full min-h-[400px]"
              onChange={(e) => setSophisticatedReview(e.target.value)}
            />
          </DialogHeader>
          <DialogFooter className="flex justify-between items-center">
            <div className="flex-1">
              <Badge variant="outline">
                New Review Score: {userReviewSophisticatedScore}
              </Badge>
            </div>
            {/* <Button
              type="submit"
              onClick={handleSubmitSophisticated}
              variant="ghost"
            >
              <FcGoogle size={24} />
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const handleWorryRatingDialog = () => {
    showHandleWithoutEmailSkeleton(true);
    handleSendReviewToBackendWithoutEmail();
    setIsWorryDialogOpen(false);
  };

  const handleAlertDialogLoader = () => {
    setAlertDialogDone(true);
  };

  if (isReviewComplete && worryDialog) {
    return (
      <div>
        {handleWithEmailSkeleton && <RatingCardSkeleton />}
        {sendingEmail && <EmailSkeleton />}
        {!sendingEmail && (
          <>
            {rating <= worryRating && (
              <Dialog
                open={isWorryDialogOpen}
                onOpenChange={handleWorryRatingDialog}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex justify-center items-center">
                      {worryTitle}
                    </DialogTitle>
                    <DialogDescription>{worryBody}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        className="col-span-3"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        className="col-span-3"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex justify-end">
                    {/* <Button
                  type="button"
                  onClick={closeWorryDialog}
                  className="mr-auto"
                  variant="outline"
                >
                  Use current review
                </Button> */}
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
            )}
          </>
        )}
      </div>
    );
  } else if (isReviewComplete && !worryDialog) {
    return (
      <>
        {alertDialogDone && <RatingCardSkeleton />}
        {!alertDialogDone && (
          <AlertDialog
            open={!worryDialog}
            onOpenChange={handleAlertDialogLoader}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  Thank you!
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  {
                    "Feedback receieved. We will integrate the feedback you suggested. We hope you decide to come back one day and your rating goes from a "
                  }{" "}
                  {rating} {"to a 5!"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={handleSendReviewToBackendWithoutEmailAlert}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  }
  const MAX_TWEET_LENGTH = 280;
  const remainingChars = MAX_TWEET_LENGTH - reviews[currentStep].length;
  const isOverLimit = remainingChars < 0;
  return (
    <div>
      {startRecording && (
        <>
          <div className="flex flex-col items-center justify-center h-screen bg-background">
            <Card className="w-[350px] mx-auto mb-10">
              <CardContent className="pt-6">
                <p className="text-foreground">{reviews[currentStep]}</p>
              </CardContent>
            </Card>
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-foreground rounded-full animate-bounce-1"></div>
              <div className="w-3 h-3 bg-foreground rounded-full animate-bounce-2"></div>
              <div className="w-3 h-3 bg-foreground rounded-full animate-bounce-3"></div>
            </div>

            <Button variant="ghost" onClick={handleSpeechRecord}>
              <MicOff />
            </Button>

            <style jsx>{`
              @keyframes bounce {
                0%,
                100% {
                  transform: translateY(0) scale(1);
                  opacity: 1;
                }
                50% {
                  transform: translateY(-10px) scale(0.9);
                  opacity: 0.7;
                }
              }
              .animate-bounce-1 {
                animation: bounce 1.5s infinite
                  cubic-bezier(0.45, 0.05, 0.55, 0.95) 0s;
              }
              .animate-bounce-2 {
                animation: bounce 1.5s infinite
                  cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.2s;
              }
              .animate-bounce-3 {
                animation: bounce 1.5s infinite
                  cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.4s;
              }
            `}</style>
          </div>
          {/* <RecordingLoader/> */}
        </>
      )}
      {isLoading && !startRecording && <RatingCardSkeleton />}
      {!isLoading && !alertDialogDone && showRatingsPage && !startRecording && (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-1 text-lg">
                {"Hello, you 😇"}
              </CardTitle>
              <CardDescription className="flex items-center justify-center space-x-1">
                {"Let's begin with your rating"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-8 h-8 cursor-pointer transition-all duration-150",
                      hover >= star || rating >= star
                        ? "text-primary fill-primary"
                        : "text-muted-foreground",
                      hover >= star,
                    )}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="ghost">
                <CircleArrowRight onClick={handleRatingToReview} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      {!showRatingsPage &&
        (useBubblePlatform || rating > worryRating || inStoreMode) && (
          <FiveStarReviewBuilder
            buisnessName={title}
            rating={rating}
            placeId={id}
            keywords={keywords}
            worryBody={worryBody}
            worryRating={worryRating}
            worryTitle={worryTitle}
            bubbleRatingPlatform={useBubblePlatform}
            showEmailWorryDialog={worryDialog}
            inStoreMode={inStoreMode}
          />
        )}
      {!showRatingsPage &&
        !useBubblePlatform &&
        rating <= worryRating &&
        !inStoreMode &&
        !startRecording && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              <p className="text-3xl font-bold">{title || "Untitled"}</p>
              <div className="max mx-auto p-6 bg-white rounded-lg shadow-sm">
                <ul className="space-y-4">
                  {questions[rating - 1].questions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 transition-opacity duration-300 ease-in-out"
                      style={{
                        opacity:
                          hoveredIndex === null || hoveredIndex === index
                            ? 1
                            : 0.5,
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-gray-400" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-grow">
                {isReviewTemplateLoading ? (
                  <AnimatedTextareaSkeletonLoader />
                ) : (
                  <Textarea
                    id="reviewArea"
                    value={reviews[currentStep]}
                    onFocus={() => setPlaceholder("")}
                    onBlur={() =>
                      setPlaceholder(reviews[currentStep] ? "" : "✍🏻")
                    }
                    onChange={(e) => handleReviewChange(e.target.value)}
                    className={
                      placeholder == ""
                        ? "w-full border-none outline-none text-[16px]"
                        : "w-full border-none outline-none text-center text-[16px]"
                    }
                    style={{ resize: "none" }}
                    rows={3}
                    placeholder={placeholder}
                  />
                )}
              </div>
              <div className="flex justify-between items-center w-full">
                {currentStep === categories.length - 1 ? (
                  <div className="flex w-full justify-between items-center">
                    <Button variant="ghost" onClick={handleSpeechRecord}>
                      <Mic />
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={handleNext}
                      disabled={
                        isReviewTemplateLoading ||
                        reviews[currentStep].trim() === ""
                      }
                    >
                      <Send />
                    </Button>
                  </div>
                ) : (
                  <CircleArrowRight />
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default SmartReviewBuilder;
