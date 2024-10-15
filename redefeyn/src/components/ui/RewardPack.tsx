"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { CircleDollarSign } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const PackCard = ({
  isOpen,
  onClick,
  packTitle,
  packWorth,
  packDescription,
}: {
  isOpen: boolean;
  onClick: () => void;
  packTitle: string;
  packWorth: number;
  packDescription: string;
}) => (
  <div className="flex flex-col items-center">
    <motion.div
      className="w-64 h-96 bg-gradient-to-br from-white-400 to-white-600 rounded-lg shadow-lg cursor-pointer overflow-hidden"
      onClick={onClick}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { rotateY: 180 },
        closed: { rotateY: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center text-black text-4xl font-bold"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 0 },
          closed: { opacity: 1 },
        }}
      >
        <div className="flex flex-col items-center">
          <span>{packTitle}</span>
          <p className="text-gray-500 text-xs mt-2 text-center">
            {packDescription}
          </p>
        </div>
      </motion.div>
    </motion.div>
    <div className="flex items-center space-x-2 mt-4">
      <CircleDollarSign />
      <p className="text-sm max-w-xs">{packWorth}</p>
    </div>
  </div>
);

const CardReveal = ({
  isRevealed,
  number,
}: {
  isRevealed: boolean;
  number: number;
}) => (
  <motion.div
    className="w-64 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
    transition={{ delay: 0.5, duration: 0.3 }}
  >
    <motion.div
      className="text-white text-6xl font-bold"
      initial={{ opacity: 0, y: 20 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: 0.8, duration: 0.3 }}
    >
      {number}
    </motion.div>
  </motion.div>
);

export default function RewardPack({
  packTitle,
  packWorth,
  customerScore,
  packDescription,
}: {
  packTitle: string;
  packWorth: number;
  customerScore: number;
  packDescription: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    if (customerScore < packWorth) {
      toast({
        title: "Not enough Vero Points",
        description: `You need ${packWorth - customerScore} more points.`,
        duration: 3000,
      });
      return;
    }
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        setRandomNumber(Math.floor(Math.random() * 100) + 1);
        setIsRevealed(true);
        setShowDialog(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 500);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setIsOpen(false);
    setIsRevealed(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        <PackCard
          isOpen={isOpen}
          onClick={handleClick}
          packTitle={packTitle}
          packWorth={packWorth}
          packDescription={packDescription}
        />
      </div>
      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="p-4 sm:p-6 bg-transparent border-none flex items-center justify-center min-h-screen w-full max-w-md mx-auto">
          <CardReveal isRevealed={isRevealed} number={randomNumber} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
