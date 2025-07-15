import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat2 } from 'lucide-react'; // Icons for like, comment, retweet

// Define the Comment type
type Comment = {
  id: string;
  username: string;
  handle: string;
  text: string;
  likes: number;
  retweets: number;
  likesToggle?: boolean;
  retweetsToggle?: boolean;
  replies: Comment[];
};

// Define the Post type
type Post = {
  id: string;
  username: string;
  handle: string;
  verified: boolean;
  timestamp: number;
  content: string;
  engagement: {
    likes: number;
    retweets: number;
    comments: number;
  };
  comments: Comment[];
};

// Generate posts based on experimental condition
const generatePosts = (): Post[] => {
  const baseEngagement = { likes: 2847, retweets: 892, comments: 445 };

  return [
    {
      id: 'p1',
      username: 'CommunityVoice',
      handle: '@CommunityVoice',
      verified: true,
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
      content: 'This is the first post content.',
      engagement: { likes: baseEngagement.likes, retweets: baseEngagement.retweets, comments: baseEngagement.comments },
      comments: [
        {
          id: 'c1',
          username: 'ConcernedCitizen',
          handle: '@ConcernedCitizen',
          text: 'Absolutely disgusting behavior. Lock them up and throw away the key',
          likes: 267,
          retweets: 10,
          likesToggle: false,
          retweetsToggle: false,
          replies: []
        },
        {
          id: 'c2',
          username: 'SafetyFirst',
          handle: '@SafetyFirst',
          text: 'This is why protests turn dangerous. Zero tolerance for violence',
          likes: 189,
          retweets: 5,
          likesToggle: false,
          retweetsToggle: false,
          replies: []
        }
      ]
    },
    {
      id: 'p2',
      username: 'JusticeForAll',
      handle: '@JusticeForAll',
      verified: false,
      timestamp: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
      content: 'This is the second post content.',
      engagement: { likes: 150, retweets: 30, comments: 3 },
      comments: [
        {
          id: 'c3',
          username: 'EqualityMatters',
          handle: '@EqualityMatters',
          text: 'We need to stand together for justice.',
          likes: 120,
          retweets: 15,
          likesToggle: false,
          retweetsToggle: false,
          replies: []
        }
      ]
    }
  ];
};

const SocialMediaSimulator: React.FC = () => {
  // Use generatePosts to initialize the posts state
  const [posts, setPosts] = useState<Post[]>(generatePosts());

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({}); // For adding replies to specific comments
  const [activeReply, setActiveReply] = useState<string | null>(null); // Tracks which comment's reply form is open

  // Function to toggle likes for a post or comment
  const toggleLike = (postId: string, commentId?: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: commentId
                ? post.comments.map((comment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          likes: comment.likesToggle ? comment.likes - 1 : comment.likes + 1,
                          likesToggle: !comment.likesToggle
                        }
                      : comment
                  )
                : post
            }
          : post
      )
    );
  };

  // Function to toggle retweets for a post or comment
  const toggleRetweet = (postId: string, commentId?: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: commentId
                ? post.comments.map((comment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          retweets: comment.retweetsToggle
                            ? comment.retweets - 1
                            : comment.retweets + 1,
                          retweetsToggle: !comment.retweetsToggle
                        }
                      : comment
                  )
                : post
            }
          : post
      )
    );
  };

  // Function to add a reply to a specific comment
  const addReply = (postId: string, commentId: string) => {
    if (!replyText[commentId]?.trim()) return; // Prevent empty replies
    const newReply: Comment = {
      id: `r${Date.now()}`,
      username: 'Participant456',
      handle: '@Participant456',
      text: replyText[commentId],
      likes: 0,
      retweets: 0,
      likesToggle: false,
      retweetsToggle: false,
      replies: []
    };
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? { ...comment, replies: [...comment.replies, newReply] }
                  : comment
              )
            }
          : post
      )
    );
    setReplyText((prev) => ({ ...prev, [commentId]: '' })); // Clear the reply input field
    setActiveReply(null); // Close the reply form
  };

  return (
    <div className="social-media-simulator">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>
            {post.username} <span>{post.handle}</span>
          </h3>
          <p>{post.content}</p>
          <div className="engagement-icons">
            <button>
              <MessageCircle size={16} /> {post.engagement.comments}
            </button>
            <button>
              <Repeat2 size={16} /> {post.engagement.retweets}
            </button>
            <button>
              <Heart size={16} /> {post.engagement.likes}
            </button>
          </div>

          {/* Render Comments */}
          <div className="comments-section">
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>
                  <strong>{comment.username}</strong> ({comment.handle}): {comment.text}
                </p>
                <div className="engagement-icons">
                  <button onClick={() => setActiveReply(comment.id === activeReply ? null : comment.id)}>
                    <MessageCircle size={16} /> {comment.replies.length}
                  </button>
                  <button onClick={() => toggleRetweet(post.id, comment.id)}>
                    <Repeat2 size={16} className={comment.retweetsToggle ? 'active' : ''} />{' '}
                    {comment.retweets}
                  </button>
                  <button onClick={() => toggleLike(post.id, comment.id)}>
                    <Heart size={16} className={comment.likesToggle ? 'active' : ''} /> {comment.likes}
                  </button>
                </div>

                {/* Reply Form */}
                {activeReply === comment.id && (
                  <div className="reply-form">
                    <input
                      type="text"
                      value={replyText[comment.id] || ''}
                      onChange={(e) =>
                        setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))
                      }
                      placeholder="Write a reply..."
                    />
                    <button onClick={() => addReply(post.id, comment.id)}>Reply</button>
                  </div>
                )}

                {/* Render Replies */}
                {comment.replies.length > 0 && (
                  <div className="replies">
                    {comment.replies.map((reply) => (
                      <p key={reply.id}>
                        <strong>{reply.username}</strong> ({reply.handle}): {reply.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialMediaSimulator;