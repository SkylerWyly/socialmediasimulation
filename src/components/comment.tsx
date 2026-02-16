'use client';

import { useState } from 'react';
import { Heart, Repeat, UserCircle } from 'lucide-react';
import { Comment as CommentType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentForm } from './comment-form';
import { mockUsers } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface CommentProps {
  comment: CommentType;
  onAddReply: (commentId: string, content: string) => void;
  isPreview?: boolean;
}

export function Comment({ comment, onAddReply, isPreview = false }: CommentProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
  };
  
  const handleReplySubmit = (content: string) => {
    onAddReply(comment.id, content);
    setShowReplyForm(false);
  };

  const handleShare = () => {
    if (!isShared) {
      toast({ title: 'Comment Shared', description: 'This is a simulated action.' });
      setIsShared(true);
    }
  };

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={comment.user.avatar} alt={comment.user.name} data-ai-hint="person portrait" />
        <AvatarFallback><UserCircle /></AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-xl p-3">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm">{comment.user.name}</p>
            <p className="text-xs text-muted-foreground">@{comment.user.username}</p>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
        {!isPreview && (
          <div className="flex items-center gap-4 mt-1 px-3">
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
            <button
              onClick={handleLike}
              className={`text-xs font-semibold hover:underline ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Like
            </button>
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-semibold text-muted-foreground hover:underline"
            >
              Reply
            </button>
            <button 
              onClick={handleShare}
              disabled={isShared}
              className="text-xs font-semibold text-muted-foreground hover:underline disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
            >
              <Repeat className={`inline-block h-3 w-3 mr-1 ${isShared ? 'text-primary' : ''}`} />
              Share
            </button>
            {likeCount > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className={`h-3 w-3 ${isLiked ? 'text-primary fill-primary' : ''}`} />
                <span className="text-xs">{likeCount}</span>
              </div>
            )}
          </div>
        )}
        {showReplyForm && (
            <div className="mt-2">
                <CommentForm 
                    currentUser={mockUsers.participant} 
                    onSubmit={handleReplySubmit}
                    placeholder="Post your reply"
                />
            </div>
        )}
         {comment.replies && comment.replies.length > 0 && !isPreview && (
            <div className="mt-4 space-y-4">
                {comment.replies.map(reply => (
                    <Comment key={reply.id} comment={reply} onAddReply={onAddReply} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
