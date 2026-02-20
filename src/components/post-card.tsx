'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Repeat, UserCircle, MoreHorizontal } from 'lucide-react';
import { Post, Comment as CommentType } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Comment } from '@/components/comment';
import { CommentForm } from '@/components/comment-form';
import { mockUsers } from '@/lib/mock-data';
import { Separator } from './ui/separator';
import { logEvent } from '@/lib/data-logger';
import { cn } from '@/lib/utils'; 

// --- FIREBASE IMPORTS ---
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';

interface PostCardProps {
  post: Post;
  onUpdatePost: (post: Post) => void;
  // Added qualitative function to prop interface
  onPostComment?: (postId: string, text: string, targetId?: string) => void;
}

export function PostCard({ post, onUpdatePost, onPostComment }: PostCardProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [isShared, setIsShared] = useState(post.isSharedByUser || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  
  const [repostCount, setRepostCount] = useState(post.shares);
  const [repostDisplay, setRepostDisplay] = useState(post.sharesDisplay);

  const [comments, setComments] = useState<CommentType[]>(post.comments);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const getParticipantId = () => localStorage.getItem('participantId');

  // --- DwellTime & ViewedComments Tracking ---
  useEffect(() => {
    const pid = getParticipantId();
    if (isFocusModalOpen) {
      setStartTime(Date.now());
      if (pid && db) {
        updateDoc(doc(db, 'participants', pid), {
          [`interactions.${post.id}.viewedComments`]: true
        }).catch(e => console.error(e));
      }
    } else if (startTime) {
      const duration = Date.now() - startTime;
      logEvent('focus_post', { postId: post.id, durationMs: duration, isFocal: !!post.isFocal });
      if (pid && db) {
        updateDoc(doc(db, 'participants', pid), {
          [`interactions.${post.id}.dwellTimes`]: arrayUnion(duration) 
        }).catch(e => console.error(e));
      }
      setStartTime(null);
    }
  }, [isFocusModalOpen, post.id, post.isFocal]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const triggerInteraction = (eventType: string) => {
    logEvent(eventType, {
      postId: post.id,
      component: 'PostCard',
      isFocal: !!post.isFocal,
      valence: post.valence
    });
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    setLikeCount(newLikeCount);
    
    onUpdatePost({ ...post, likes: newLikeCount, isLikedByUser: newLikedState });
    triggerInteraction('like');

    const pid = getParticipantId();
    if (pid && db) {
      updateDoc(doc(db, 'participants', pid), {
        [`interactions.${post.id}.liked`]: newLikedState,
        totalLikes: increment(newLikedState ? 1 : -1)
      }).catch(e => console.error(e));
    }
  };

  const handleShare = () => {
    if (!isShared) {
      toast({ title: 'Post Shared', description: 'Simulated action recorded.', duration: 1500 });
      
      const newRepostCount = repostCount + 1;
      setIsShared(true);
      setRepostCount(newRepostCount);
      
      if (repostDisplay && !repostDisplay.includes('K') && !repostDisplay.includes('M')) {
          setRepostDisplay(newRepostCount.toString());
      } else {
          setRepostDisplay(post.sharesDisplay);
      }

      onUpdatePost({ ...post, isSharedByUser: true, shares: newRepostCount });
      triggerInteraction('share');

      const pid = getParticipantId();
      if (pid && db) {
        updateDoc(doc(db, 'participants', pid), {
          [`interactions.${post.id}.reposted`]: true
        }).catch(e => console.error(e));
      }
    }
  };
  
  // --- UPDATED: Discretized Comment Logic ---
  const handleAddComment = (content: string) => {
    const commentToAdd: CommentType = {
      id: `comment-${Date.now()}`,
      user: mockUsers.participant,
      content: content,
      timestamp: 'Just now',
      likes: 0,
      replies: [],
    };
    const updatedComments = [...comments, commentToAdd];
    setComments(updatedComments);
    onUpdatePost({ ...post, comments: updatedComments });
    triggerInteraction('comment');

    const pid = getParticipantId();
    if (pid && db) {
      // 1. Primary Save: Structured qualitative data object
      updateDoc(doc(db, 'participants', pid), {
        [`interactions.${post.id}.userComments`]: arrayUnion({
          text: content.trim(),
          target: 'post', // Identifies this was a top-level reply
          timestamp: new Date().toISOString()
        }),
        // 2. Secondary Save: Standard boolean flags for counts
        [`interactions.${post.id}.commented`]: true
      }).catch(e => console.error(e));
    }

    // Call the optional feed-level function if passed
    onPostComment?.(post.id, content, 'post');
  };
  
  // --- UPDATED: Discretized Reply Logic ---
  const handleAddReply = (commentId: string, content: string) => {
    const newReply: CommentType = {
        id: `reply-${Date.now()}`,
        user: mockUsers.participant,
        content: content,
        timestamp: 'Just now',
        likes: 0,
        replies: [],
    };

    const addReplyToComment = (coms: CommentType[]): CommentType[] => {
        return coms.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, replies: [...(comment.replies || []), newReply] };
            }
            if (comment.replies && comment.replies.length > 0) {
                return { ...comment, replies: addReplyToComment(comment.replies) };
            }
            return comment;
        });
    };

    const updatedComments = addReplyToComment(comments);
    setComments(updatedComments);
    onUpdatePost({ ...post, comments: updatedComments });
    triggerInteraction('reply');

    const pid = getParticipantId();
    if (pid && db) {
      // 1. Primary Save: Structured qualitative data object for the specific reply
      updateDoc(doc(db, 'participants', pid), {
        [`interactions.${post.id}.userComments`]: arrayUnion({
          text: content.trim(),
          target: commentId, // Identifies exactly which comment they replied to
          timestamp: new Date().toISOString()
        }),
        // 2. Secondary Save: Standard boolean flags for counts
        [`interactions.${post.id}.replied`]: true
      }).catch(e => console.error(e));
    }

    // Call the optional feed-level function if passed
    onPostComment?.(post.id, content, commentId);
  };

  const interactionButtons = (
     <div className="flex justify-around border-t">
        <Button variant="ghost" className="flex-1 rounded-none h-12 text-muted-foreground hover:bg-accent/10 hover:text-accent" onClick={(e) => { stopPropagation(e); setIsFocusModalOpen(true); }}>
          <MessageCircle className="h-5 w-5 mr-2" />
          {comments.length}
        </Button>
        <Button 
          variant="ghost" 
          className="flex-1 rounded-none h-12 text-muted-foreground hover:bg-accent/10 hover:text-accent" 
          onClick={(e) => { stopPropagation(e); handleShare(); }}
          disabled={isShared}
        >
          <Repeat className={cn("h-5 w-5 mr-2", isShared && "text-primary")} />
          <span className={cn(isShared && "text-primary")}>{repostDisplay}</span>
        </Button>
        <Button variant="ghost" className="flex-1 rounded-none h-12 text-muted-foreground hover:bg-primary/10" onClick={(e) => { stopPropagation(e); handleLike(); }}>
          <Heart className={cn("h-5 w-5 mr-2 transition-colors", isLiked && "fill-primary text-primary")} />
          <span className={cn(isLiked && "text-primary")}>
             {isLiked && likeCount > post.likes ? 'Liked' : post.likesDisplay}
          </span>
        </Button>
      </div>
  );

  const PostBody = () => (
    <div className="flex items-start gap-4">
      <Avatar><AvatarImage src={post.user.avatar} alt={post.user.name} /><AvatarFallback><UserCircle /></AvatarFallback></Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">{post.user.name}</p>
            <p className="text-sm text-muted-foreground">@{post.user.username} &middot; {post.timestamp}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={stopPropagation}><MoreHorizontal className="h-5 w-5" /></Button>
        </div>
        <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
        
        {post.images && post.images.length > 0 && (
          <div className={cn(
            "mt-3 rounded-xl border overflow-hidden grid gap-1",
            post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
          )}>
            {post.images.map((src, idx) => (
              <div key={idx} className="relative aspect-video bg-muted">
                <Image src={src} alt={`Post content ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const FocusedView = () => (
    <div className="p-4">
      <PostBody />
      <div className="mt-4 flex justify-around border-t border-b py-2">
        <div className="text-center text-sm"><span className="font-bold">{comments.length}</span> <span className="text-muted-foreground">Comments</span></div>
        <div className="text-center text-sm"><span className="font-bold">{repostDisplay}</span> <span className="text-muted-foreground">Shares</span></div>
        <div className="text-center text-sm"><span className="font-bold">{isLiked && likeCount > post.likes ? 'Liked' : post.likesDisplay}</span> <span className="text-muted-foreground">Likes</span></div>
      </div>
      <div className="mt-4 space-y-4">
        <div className="space-y-4">
          {comments.map((comment) => <Comment key={comment.id} comment={comment} onAddReply={handleAddReply} />)}
        </div>
        <Separator />
        <CommentForm currentUser={mockUsers.participant} onSubmit={handleAddComment} />
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden shadow-sm">
      <Dialog open={isFocusModalOpen} onOpenChange={setIsFocusModalOpen}>
        <div onClick={() => setIsFocusModalOpen(true)} className="cursor-pointer">
          <CardContent className="p-4"><PostBody /></CardContent>
          {interactionButtons}
        </div>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{post.user.name}'s Post</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <FocusedView />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}