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

interface PostCardProps {
  post: Post;
  onUpdatePost: (post: Post) => void;
}

export function PostCard({ post, onUpdatePost }: PostCardProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [isShared, setIsShared] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState<CommentType[]>(post.comments);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (isFocusModalOpen) {
      setStartTime(Date.now());
    } else if (startTime) {
      const duration = Date.now() - startTime;
      logEvent('focus_post', { postId: post.id, durationMs: duration, isFocal: !!post.isFocal });
      setStartTime(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocusModalOpen, post.id, post.isFocal]);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const triggerInteraction = (eventType: string) => {
    logEvent(eventType, {
      postId: post.id,
      component: 'PostCard',
      isFocal: !!post.isFocal,
      valence: post.valence
    });
    try {
      const interactedPostsJSON = localStorage.getItem('interactedPosts');
      const interactedPosts: string[] = interactedPostsJSON ? JSON.parse(interactedPostsJSON) : [];
      
      if (!interactedPosts.includes(post.id)) {
        interactedPosts.push(post.id);
        localStorage.setItem('interactedPosts', JSON.stringify(interactedPosts));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error("Could not update localStorage for interactions", error);
    }
  };

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    setLikeCount(newLikeCount);
    onUpdatePost({ ...post, likes: newLikeCount, isLikedByUser: newLikedState });
    triggerInteraction('like');
  };

  const handleShare = () => {
    if (!isShared) {
      toast({ title: 'Post Shared', description: 'This is a simulated action.' });
      onUpdatePost({ ...post, shares: post.shares + 1 });
      setIsShared(true);
      triggerInteraction('share');
    }
  };
  
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
    logEvent('comment_added', {
        postId: post.id,
        commentId: commentToAdd.id,
        content: content,
        isFocal: !!post.isFocal,
        valence: post.valence
    })
  };
  
  const handleAddReply = (commentId: string, content: string) => {
    const newReply: CommentType = {
        id: `reply-${Date.now()}`,
        user: mockUsers.participant,
        content: content,
        timestamp: 'Just now',
        likes: 0,
        replies: [],
    };

    const addReplyToComment = (comments: CommentType[]): CommentType[] => {
        return comments.map(comment => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [...(comment.replies || []), newReply]
                };
            }
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: addReplyToComment(comment.replies)
                };
            }
            return comment;
        });
    };

    const updatedComments = addReplyToComment(comments);
    setComments(updatedComments);
    onUpdatePost({ ...post, comments: updatedComments });
    triggerInteraction('reply');
    logEvent('reply_added', {
        postId: post.id,
        parentCommentId: commentId,
        replyId: newReply.id,
        content: content,
        isFocal: !!post.isFocal,
        valence: post.valence
    })
  };

  const interactionButtons = (
     <div className="flex justify-around border-t">
        <Button variant="ghost" className="flex-1 rounded-none h-12 text-muted-foreground hover:bg-accent/10 hover:text-accent" onClick={(e) => { stopPropagation(e); setIsFocusModalOpen(true); }}>
          <MessageCircle className="h-5 w-5 mr-2" />
          {comments.length}
        </Button>
        <Button 
          variant="ghost" 
          className="flex-1 rounded-none h-12 text-muted-foreground hover:bg-accent/10 hover:text-accent disabled:cursor-not-allowed" 
          onClick={(e) => { stopPropagation(e); handleShare(); }}
          disabled={isShared}
        >
          <Repeat className={`h-5 w-5 mr-2 ${isShared ? 'text-primary' : ''}`} />
          <span className={`${isShared ? 'text-primary' : ''}`}>{post.shares + (isShared && !post.isSharedByUser ? 1 : 0) - (post.isSharedByUser && !isShared ? 1 : 0) }</span>
        </Button>
        <Button variant="ghost" className="flex-1 rounded-none h-12 text-muted-foreground hover:bg-primary/10" onClick={(e) => { stopPropagation(e); handleLike(); }}>
          <Heart className={`h-5 w-5 mr-2 transition-colors ${isLiked ? 'fill-primary text-primary' : ''}`} />
          <span className={`${isLiked ? 'text-primary' : ''}`}>{likeCount}</span>
        </Button>
      </div>
  );

  const PostBody = () => (
    <div className="flex items-start gap-4">
      <Avatar><AvatarImage src={post.user.avatar} alt={post.user.name} data-ai-hint="person portrait" /><AvatarFallback><UserCircle /></AvatarFallback></Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">{post.user.name}</p>
            <p className="text-sm text-muted-foreground">@{post.user.username} &middot; {post.timestamp}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={stopPropagation}><MoreHorizontal className="h-5 w-5" /></Button>
        </div>
        <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <div className="mt-3 rounded-lg border overflow-hidden">
            <Image 
              src={post.image}
              alt="Post image"
              width={600}
              height={400}
              className="object-cover w-full"
              data-ai-hint={post.imageHint}
            />
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
        <div className="text-center text-sm"><span className="font-bold">{post.shares}</span> <span className="text-muted-foreground">Shares</span></div>
        <div className="text-center text-sm"><span className="font-bold">{likeCount}</span> <span className="text-muted-foreground">Likes</span></div>
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
