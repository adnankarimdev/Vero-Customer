            // {/* tween stuff here */}
            // (
            //     <div className="min-h-screen bg-background flex items-center justify-center p-4">
            //         <Card className="w-full max-w-xl shadow-lg border border-border">
            //           <CardHeader className="pb-2">
            //             <div className="flex items-center space-x-4">
            //               <div className="w-1 h-8 bg-foreground"></div>
            //               <h2 className="text-xl font-semibold text-foreground">Questions of the Day</h2>
            //             </div>
            //             <Separator/>
            //             {questions[rating - 1].questions.map((item, index) => (
            //               <p className="mt-2 text-md font-medium text-foreground">{"•"}{item}</p>
              
            //                   ))}
                        
            //           </CardHeader>
            //           <CardContent className="pt-2 pb-0">
            //             <div className="flex space-x-4">
            //               <div className="flex-1">
            //                 <Textarea
            //                     id="reviewArea"
            //                     value={reviews[currentStep]}
            //                     onFocus={() => setPlaceholder("")}
            //                     onBlur={() =>
            //                       setPlaceholder(reviews[currentStep] ? "" : "✍🏻")
            //                     }
            //                   onChange={(e) => handleReviewChange(e.target.value)}
            //                   placeholder={placeholder}
            //                   className="min-h-[120px] resize-none border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground bg-background"
            //                 />
            //               </div>
            //             </div>
            //           </CardContent>
            //           <CardFooter className="flex justify-between items-center border-t border-border bg-background rounded-b-lg">
            //             <div className="text-sm font-medium">
            //               {isOverLimit ? (
            //                 <span className="text-destructive">{remainingChars}</span>
            //               ) : (
            //                 <span className="text-primary">{remainingChars}</span>
            //               )}
            //             </div>
            //             <div className="flex justify-between items-center w-full">
            //                 {currentStep === categories.length - 1 ? (
            //                   <div className="flex w-full justify-between items-center">
            //                     <Button variant="ghost" onClick={handleSpeechRecord}>
            //                       <Mic />
            //                     </Button>
              
            //                     <Button
            //                       variant="ghost"
            //                       onClick={handleNext}
            //                       disabled={
            //                         isReviewTemplateLoading ||
            //                         reviews[currentStep].trim() === ""
            //                       }
            //                     >
            //                       <Send />
            //                     </Button>
            //                   </div>
            //                 ) : (
            //                   <CircleArrowRight />
            //                 )}
            //                 </div>
            //           </CardFooter>
            //         </Card>
            //       </div>
            //   )