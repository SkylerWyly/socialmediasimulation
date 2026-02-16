
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, MessageCircle, Heart, Repeat, Bell } from 'lucide-react';

export function TutorialCard() {
  return (
    <Card className="mb-4 bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="text-primary h-6 w-6" />
          Welcome to the Tutorial!
        </CardTitle>
        <CardDescription>
          Take a moment to familiarize yourself with the features of this social media feed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm">Click the <strong>heart icon</strong> to like a post.</p>
        </div>
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm">Click the <strong>comment icon</strong> to view comments or post your own.</p>
        </div>
        <div className="flex items-center gap-3">
          <Repeat className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm">Click the <strong>repeat icon</strong> to share a post.</p>
        </div>
        <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm">The <strong>bell icon</strong> in the sidebar will show notifications for new activity.</p>
        </div>
         <p className="text-sm text-muted-foreground pt-2">
          When you're ready, the "Start Experiment" button will appear at the bottom-right of your screen.
        </p>
      </CardContent>
    </Card>
  );
}
