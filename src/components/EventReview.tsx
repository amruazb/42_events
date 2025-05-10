import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Star, MessageSquare, ThumbsUp, Users, Clock, MapPin } from "lucide-react";

interface ReviewQuestion {
  id: string;
  question: string;
  options: string[];
  icon?: React.ReactNode;
}

const reviewQuestions: ReviewQuestion[] = [
  {
    id: "overall",
    question: "Overall, how would you rate this event?",
    options: ["1", "2", "3", "4", "5"],
    icon: <Star className="h-5 w-5 text-yellow-500" />
  },
  {
    id: "enjoyment",
    question: "How much did you enjoy the event?",
    options: ["Not at all", "Somewhat", "Neutral", "Enjoyed", "Very much enjoyed"],
    icon: <ThumbsUp className="h-5 w-5 text-blue-500" />
  },
  {
    id: "organization",
    question: "How well was the event organized?",
    options: ["Poor", "Fair", "Good", "Very good", "Excellent"],
    icon: <Clock className="h-5 w-5 text-green-500" />
  },
  {
    id: "value",
    question: "How valuable was the event for you?",
    options: ["Not valuable", "Somewhat valuable", "Neutral", "Valuable", "Very valuable"],
    icon: <Users className="h-5 w-5 text-purple-500" />
  },
  {
    id: "location",
    question: "How was the event location?",
    options: ["Poor", "Fair", "Good", "Very good", "Excellent"],
    icon: <MapPin className="h-5 w-5 text-red-500" />
  }
];

interface EventReviewProps {
  eventId: string;
  eventName: string;
}

const EventReview = ({ eventId, eventName }: EventReviewProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== reviewQuestions.length) {
      toast.error("Please answer all questions");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          eventName,
          answers,
          comment,
          userId: user?.id || null,
          isAnonymous: !user?.id
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("Thank you for your feedback!");
      setAnswers({});
      setComment("");
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-background/50 backdrop-blur-sm border border-border">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-semibold">Event Review: {eventName}</h3>
      </div>
      
      <div className="space-y-8">
        {reviewQuestions.map((question) => (
          <div key={question.id} className="space-y-4">
            <div className="flex items-center gap-2">
              {question.icon}
              <Label className="text-base font-medium">{question.question}</Label>
            </div>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="flex flex-wrap gap-4"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option} 
                    id={`${question.id}-${option}`}
                    className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label 
                    htmlFor={`${question.id}-${option}`}
                    className="cursor-pointer hover:text-primary transition-colors"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="space-y-3">
          <Label className="text-base font-medium">Additional Comments</Label>
          <Textarea
            placeholder="Share your thoughts, suggestions, or feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>
        
        <div className="pt-4 space-y-4">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {user ? "Review will be submitted with your account" : "Review will be submitted anonymously"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EventReview; 