"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/forms/form-inputs";
import { cn } from "@/lib/cn";

interface DeliveryRatingCardProps {
  title: string;
  description: string;
  onSubmit: (rating: number, comment: string) => void;
  submitLabel?: string;
}

export function DeliveryRatingCard({
  title,
  description,
  onSubmit,
  submitLabel = "Submit Feedback",
}: DeliveryRatingCardProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const handleSub = () => {
    onSubmit(rating, comment);
  };

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <CardHeader className="pb-3 text-center">
        <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stars Selector */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className="transition-transform hover:scale-110 focus:outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Comment textarea */}
        <div className="space-y-1.5">
          <label htmlFor="rating-comments" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Review Comments
          </label>
          <Textarea
            id="rating-comments"
            placeholder="Write a brief comment about driver assignment, response rate, routing behavior..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-xs h-20"
          />
        </div>

        {/* Submit */}
        <Button onClick={handleSub} className="w-full rounded-xl text-xs h-10 font-bold" disabled={rating === 0}>
          {submitLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
