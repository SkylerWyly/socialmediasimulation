'use client';

import { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { User } from '@/lib/types';

interface CommentFormProps {
  currentUser: User;
  onSubmit: (content: string) => void;
  placeholder?: string;
}

export function CommentForm({ currentUser, onSubmit, placeholder = "Post your reply" }: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <div className="flex gap-4 items-start">
      <Avatar>
        <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint="person portrait" />
        <AvatarFallback>
          <UserCircle />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className="bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="mt-2" size="sm" disabled={!content.trim()}>
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
