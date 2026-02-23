export interface User {
  id?: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  likesDisplay?: string; // Supports the shortened "12K" format
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  
  // Engagement Metrics & Displays
  likes: number;
  likesDisplay?: string; 
  shares: number;
  sharesDisplay?: string;
  
  // Discretized & Simulated Comments
  comments: Comment[];
  simulatedCommentsCount?: number;     // The underlying large Gaussian integer
  simulatedCommentsDisplay?: string;   // The shortened display string (e.g., "452")
  
  // Experimental Condition & Tracking
  valence: 'sympathetic' | 'condemning' | 'neutral' | string;
  isLikedByUser?: boolean;
  isSharedByUser?: boolean;
  isFocal?: boolean;
  
  // Media Support
  image?: string;
  imageHint?: string;
  images?: string[]; // Array to support our new multi-image grid feature
}

export interface Trend {
  category: string;
  topic: string;
  posts: number;
}

export interface Notification {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}

export interface NotificationTrigger {
  id: string;
  notificationId: string;
}