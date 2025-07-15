import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, User, Clock, CheckCircle } from 'lucide-react';

const SocialMediaSimulator = () => {
  // Experimental conditions
  const [condition, setCondition] = useState({
    valence: 'neutral', // sympathetic, condemning, neutral
    engagement: 'high' // high, low
  });

  // Participant interaction data
  const [participantData, setParticipantData] = useState({
    timeSpent: 0,
    scrolls: 0,
    interactions: [],
    viewedPosts: [],
    sessionStart: Date.now()
  });

  // Post engagement states
  const [postEngagement, setPostEngagement] = useState({});
  const [userEngagement, setUserEngagement] = useState({});

  // Add comment engagement tracking
  const [commentEngagement, setCommentEngagement] = useState({});
  const [userCommentEngagement, setUserCommentEngagement] = useState({});


  // Crime case data (based on real case patterns but fictionalized)
  const crimeCase = useMemo(() => ({
  defendant: "Alex Morgan",
  victim: "Jordan Riley",
  crime: "assault during a protest",
  location: "downtown area",
  age: 23
}), []);

  // Track user interactions
  const recordInteraction = useCallback((action, postId, details = {}) => {
    const interaction = {
      timestamp: Date.now(),
      action,
      postId,
      details,
      condition: condition
    };
    
    setParticipantData(prev => ({
      ...prev,
      interactions: [...prev.interactions, interaction]
    }));
  }, [condition]);

  const recordPostView = useCallback((postId) => {
    setParticipantData(prev => ({
      ...prev,
      viewedPosts: [...prev.viewedPosts, { postId, timestamp: Date.now() }]
    }));
  }, []);

  // Generate posts based on experimental condition
  const generatePosts = useCallback(() => {
    const baseEngagement = condition.engagement === 'high' 
      ? { likes: 2847, retweets: 892, comments: 445 }
      : { likes: 34, retweets: 12, comments: 7 };

    const sympatheticFraming = {
      mainPost: {
        id: 'main',
        username: 'CommunityVoice',
        handle: '@CommunityVoice',
        verified: true,
        timestamp: '2h',
        content: `${crimeCase.defendant} was defending peaceful protesters when things escalated. This ${crimeCase.age}-year-old was trying to protect others during a chaotic situation. Context matters. #JusticeFor${crimeCase.defendant.replace(' ', '')}`,
        engagement: { ...baseEngagement, likes: baseEngagement.likes + 200 },
        comments: [
          { user: 'ActivistAlly', text: 'This is exactly why we need to look at the full story. Solidarity! 💪', likes: 156 },
          { user: 'TruthSeeker99', text: 'Finally someone speaking facts. The media narrative is so biased', likes: 89 },
          { user: 'JusticeWarrior', text: 'Standing with Alex. This is what courage looks like', likes: 234 }
        ]
      },
      supportPosts: [
        {
          id: 'support1',
          username: 'LocalActivist',
          handle: '@LocalActivist',
          verified: false,
          timestamp: '1h',
          content: `I was there. ${crimeCase.defendant} was trying to de-escalate. The real aggressors were the counter-protesters who came looking for trouble.`,
          engagement: { likes: 445, retweets: 89, comments: 67 }
        },
        {
          id: 'support2',
          username: 'WitnessAccount',
          handle: '@WitnessAccount',
          verified: false,
          timestamp: '45m',
          content: `My friend knows ${crimeCase.defendant} - they volunteer at the community center and have never been in trouble. This is character assassination.`,
          engagement: { likes: 234, retweets: 45, comments: 23 }
        }
      ]
    };

    const condemnationFraming = {
      mainPost: {
        id: 'main',
        username: 'CommunityVoice',
        handle: '@CommunityVoice',
        verified: true,
        timestamp: '2h',
        content: `${crimeCase.defendant} brutally attacked ${crimeCase.victim} during what should have been a peaceful protest. This ${crimeCase.age}-year-old's violent actions have no justification. Thoughts with the victim's family. #JusticeFor${crimeCase.victim.replace(' ', '')}`,
        engagement: { ...baseEngagement, likes: baseEngagement.likes + 300 },
        comments: [
          { user: 'ConcernedCitizen', text: 'Absolutely disgusting behavior. Lock them up and throw away the key', likes: 267 },
          { user: 'SafetyFirst', text: 'This is why protests turn dangerous. Zero tolerance for violence', likes: 189 },
          { user: 'VictimAdvocate', text: 'My heart goes out to the victim. No one deserves this', likes: 345 }
        ]
      },
      supportPosts: [
        {
          id: 'support1',
          username: 'LawAndOrder',
          handle: '@LawAndOrder',
          verified: false,
          timestamp: '1h',
          content: `Another example of how "peaceful" protests turn violent. ${crimeCase.defendant} chose violence and must face consequences.`,
          engagement: { likes: 567, retweets: 134, comments: 89 }
        },
        {
          id: 'support2',
          username: 'VictimSupport',
          handle: '@VictimSupport',
          verified: false,
          timestamp: '45m',
          content: `Stop making excuses for violent criminals. ${crimeCase.victim} is the real victim here. #VictimRights`,
          engagement: { likes: 345, retweets: 78, comments: 45 }
        }
      ]
    };

    const neutralFraming = {
      mainPost: {
        id: 'main',
        username: 'CommunityVoice',
        handle: '@CommunityVoice',
        verified: true,
        timestamp: '2h',
        content: `${crimeCase.defendant}, age ${crimeCase.age}, has been charged with assault following an incident during a protest in the ${crimeCase.location}. The case is ongoing. Both parties were present at the demonstration.`,
        engagement: baseEngagement,
        comments: [
          { user: 'NewsReader', text: 'Waiting for more information before forming an opinion', likes: 45 },
          { user: 'LocalResident', text: 'Hope everyone involved recovers and justice is served fairly', likes: 67 },
          { user: 'ObserverNews', text: 'Important to let the legal process run its course', likes: 34 }
        ]
      },
      supportPosts: [
        {
          id: 'support1',
          username: 'LocalNews',
          handle: '@LocalNews',
          verified: true,
          timestamp: '1h',
          content: `Court hearing scheduled for next week in the ${crimeCase.defendant} case. Both legal teams have declined to comment pending trial.`,
          engagement: { likes: 123, retweets: 34, comments: 12 }
        },
        {
          id: 'support2',
          username: 'CommunityUpdate',
          handle: '@CommunityUpdate',
          verified: false,
          timestamp: '45m',
          content: `Police report indicates multiple witnesses to the incident. Investigation ongoing.`,
          engagement: { likes: 89, retweets: 23, comments: 8 }
        }
      ]
    };

    const framingOptions = {
      sympathetic: sympatheticFraming,
      condemning: condemnationFraming,
      neutral: neutralFraming
    };

    return framingOptions[condition.valence];
  }, [condition, crimeCase]);

  const [posts, setPosts] = useState(() => generatePosts());

  // Update posts when condition changes
  useEffect(() => {
    setPosts(generatePosts());
  }, [generatePosts]);

  // Handle engagement actions
  const handleLike = (postId) => {
    const isLiked = userEngagement[postId]?.liked;
    
    setUserEngagement(prev => ({
      ...prev,
      [postId]: { ...prev[postId], liked: !isLiked }
    }));

    setPostEngagement(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        likes: (prev[postId]?.likes || 0) + (isLiked ? -1 : 1)
      }
    }));

    recordInteraction('like', postId, { liked: !isLiked });
  };

  const handleRetweet = (postId) => {
    const isRetweeted = userEngagement[postId]?.retweeted;
    
    setUserEngagement(prev => ({
      ...prev,
      [postId]: { ...prev[postId], retweeted: !isRetweeted }
    }));

    setPostEngagement(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        retweets: (prev[postId]?.retweets || 0) + (isRetweeted ? -1 : 1)
      }
    }));

    recordInteraction('retweet', postId, { retweeted: !isRetweeted });
  };

  const handleComment = (postId) => {
    recordInteraction('comment_click', postId);
  };

  const handleShare = (postId) => {
    recordInteraction('share', postId);
  };

  const handleProfileClick = (username, postId) => {
    recordInteraction('profile_click', postId, { username });
  };

  // Track scroll and time
  useEffect(() => {
    const handleScroll = () => {
      setParticipantData(prev => ({
        ...prev,
        scrolls: prev.scrolls + 1
      }));
    };

    const timeInterval = setInterval(() => {
      setParticipantData(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.sessionStart) / 1000)
      }));
    }, 1000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, []);

  // Post component
  const PostComponent = ({ post }) => {
    const [isVisible, setIsVisible] = useState(false);
    const currentEngagement = postEngagement[post.id] || {};
    const userActions = userEngagement[post.id] || {};

    const handlePostView = useCallback(() => {
  if (!participantData.viewedPosts.find(v => v.postId === post.id)) {
    recordPostView(post.id);
  }
}, [post.id, recordPostView]);

    useEffect(() => {
      if (isVisible) {
        handlePostView();
      }
    }, [isVisible, handlePostView]);

    return (
      <div 
        className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
      >
        <div className="flex space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleProfileClick(post.username, post.id)}
                className="font-bold text-gray-900 hover:underline"
              >
                {post.username}
              </button>
              {post.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
              <span className="text-gray-500">{post.handle}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.timestamp}
              </span>
            </div>
            
            <div className="mt-2 text-gray-900">
              {post.content}
            </div>
            
            <div className="mt-3 flex items-center justify-between max-w-md">
              <button 
                onClick={() => handleComment(post.id)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{(post.engagement.comments || 0) + (currentEngagement.comments || 0)}</span>
              </button>
              
              <button 
                onClick={() => handleRetweet(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  userActions.retweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
                }`}
              >
                <Repeat2 className="w-5 h-5" />
                <span>{(post.engagement.retweets || 0) + (currentEngagement.retweets || 0)}</span>
              </button>
              
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  userActions.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${userActions.liked ? 'fill-current' : ''}`} />
                <span>{(post.engagement.likes || 0) + (currentEngagement.likes || 0)}</span>
              </button>
              
              <button 
                onClick={() => handleShare(post.id)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <Share className="w-5 h-5" />
              </button>
            </div>

            {/* Comments preview */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-3 border-t pt-3">
                {post.comments.slice(0, 2).map((comment, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <button 
                        onClick={() => handleProfileClick(comment.user, post.id)}
                        className="font-medium text-gray-900 hover:underline text-sm"
                      >
                        {comment.user}
                      </button>
                      <span className="text-gray-700 text-sm ml-2">{comment.text}</span>
                      <div className="flex items-center mt-1">
                        <button className="text-gray-500 hover:text-red-500 text-sm flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {comment.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {post.comments.length > 2 && (
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Show more replies
                  </button>
                )}
              </div>
            )}
          </div>
          
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // Export data function
  const exportData = () => {
    const dataToExport = {
      participantData,
      condition,
      finalEngagement: postEngagement,
      userEngagement,
      posts: posts
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participant-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">Home</h1>
      </div>

      {/* Research Controls (hidden in actual study) */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-2">Research Controls (Hidden in Study)</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Valence Condition
            </label>
            <select 
              value={condition.valence} 
              onChange={(e) => {
                setCondition({ ...condition, valence: e.target.value });
              }}
              className="w-full p-2 border border-yellow-300 rounded"
            >
              <option value="sympathetic">Sympathetic</option>
              <option value="condemning">Condemning</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-700 mb-1">
              Engagement Level
            </label>
            <select 
              value={condition.engagement} 
              onChange={(e) => {
                setCondition({ ...condition, engagement: e.target.value });
              }}
              className="w-full p-2 border border-yellow-300 rounded"
            >
              <option value="high">High Engagement</option>
              <option value="low">Low Engagement</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-yellow-700">
          <strong>Current Data:</strong> Time: {participantData.timeSpent}s | 
          Scrolls: {participantData.scrolls} | 
          Interactions: {participantData.interactions.length} | 
          Posts Viewed: {participantData.viewedPosts.length}
        </div>
        <button 
          onClick={exportData}
          className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Export Data
        </button>
      </div>

      {/* Main Post */}
      <PostComponent post={posts.mainPost} />

      {/* Supporting Posts */}
      {posts.supportPosts.map((post) => (
        <PostComponent key={post.id} post={post} />
      ))}

      {/* Trending/Related Content */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2">Trending in your area</h3>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">#JusticeMatters</div>
          <div className="text-sm text-gray-600">#CommunitySupport</div>
          <div className="text-sm text-gray-600">#LocalNews</div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSimulator;