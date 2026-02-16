
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Comment {
  id:string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  valence: 'sympathetic' | 'condemning' | 'neutral';
  isLikedByUser?: boolean;
  isSharedByUser?: boolean;
  isFocal?: boolean;
  image?: string;
  imageHint?: string;
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
