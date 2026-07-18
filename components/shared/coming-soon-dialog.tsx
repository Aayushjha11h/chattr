"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
}

export function ComingSoonDialog({ open, onOpenChange, feature }: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              <Zap className="w-6 h-6 text-yellow-500 absolute -bottom-1 -right-1" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Coming Soon!</DialogTitle>
          <DialogDescription className="text-center text-base">
            {feature} will be available in the next update. We're working hard to bring you the best experience!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground text-center">
            <p className="font-medium text-foreground mb-2">What to expect:</p>
            <ul className="space-y-1 text-left">
              <li>• Crystal clear audio & video quality</li>
              <li>• End-to-end encryption</li>
              <li>• Screen sharing support</li>
              <li>• Group calls with multiple participants</li>
            </ul>
          </div>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
