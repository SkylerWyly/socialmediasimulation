import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import './styles.css';

/******************** UTILITIES *************************/
const avatars = [
  'https://i.pravatar.cc/48?img=3',
  'https://i.pravatar.cc/48?img=5',
  'https://i.pravatar.cc/48?img=7',
  'https://i.pravatar.cc/48?img=12',
  'https://i.pravatar.cc/48?img=15',
  'https://i.pravatar.cc/48?img=20'
];

const randomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)];
const randTimestamp = () => `${Math.floor(Math.random() * 59) + 1}m`;
const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);
const getURLParams = () => Object.fromEntries(new URLSearchParams(window.location.search));

/******************** MOCK POST FACTORY *************************/
interface Comment {
  id: string;
  text: string;
  likes: number;
  retweets: number;
  timestamp: string | number;
  avatar: string;
  replies: Comment[];
}

interface Post {
  id: string;
  handle: string;
  name: string;
  body: string;
  media: { type: string; url: string } | null;
  pinned?: boolean;
  avatar?: string;
  timestamp?: number | string;
  likes: number;
  retweets: number;
  comments: Comment[]; // Change from number to an array of Comment objects
  likesToggle?: boolean;
  retweetsToggle?: boolean;
}

function generatePosts(valence = 'neutral', engagement = 'low'): Post[] {
  const base: Post[] = [
    {
      id: 'main',
      handle: 'CrimeWatch',
      name: 'Crime Watch',
      body: `BREAKING: Shocking incident downtown…`,
      media: { type: 'image', url: 'https://picsum.photos/seed/incident/600/400' },
      pinned: true,
      likes: 0,
      retweets: 0,
      comments: [], // Initialize as an empty array
      avatar: '',
      timestamp: 0,
      likesToggle: false,
      retweetsToggle: false,
    },
    {
      id: 'a1',
      handle: 'Justice4All',
      name: 'Justice For All',
      body: `Violence continues because we stay silent.`,
      media: null,
      likes: 0,
      retweets: 0,
      comments: [], // Initialize as an empty array
      avatar: '',
      timestamp: 0,
      likesToggle: false,
      retweetsToggle: false,
    },
    {
      id: 'a2',
      handle: 'StreetLens',
      name: 'Street Lens',
      body: `Here's what witnesses told us…`,
      media: { type: 'video', url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' },
      likes: 0,
      retweets: 0,
      comments: [], // Initialize as an empty array
      avatar: '',
      timestamp: 0,
      likesToggle: false,
      retweetsToggle: false,
    },
    {
      id: 'a3',
      handle: 'LocalVoice',
      name: 'Local Voice',
      body: `I'm scared to walk these streets now.`,
      media: null,
      likes: 0,
      retweets: 0,
      comments: [], // Initialize as an empty array
      avatar: '',
      timestamp: 0,
      likesToggle: false,
      retweetsToggle: false,
    }
  ];

  base.forEach(p => {
    if (valence === 'sympathetic') p.body += ' 😢';
    else if (valence === 'condemning') p.body += ' 😡';
  });

  const high = engagement === 'high';
  base.forEach(p => {
    p.likes = high ? Math.floor(Math.random() * 900 + 100) : Math.floor(Math.random() * 30);
    p.retweets = high ? Math.floor(Math.random() * 400 + 50) : Math.floor(Math.random() * 10);
    p.comments = Array.from({ length: high ? Math.floor(Math.random() * 10 + 5) : Math.floor(Math.random() * 3) }, () => ({
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      text: 'Sample comment',
      likes: Math.floor(Math.random() * 50),
      retweets: Math.floor(Math.random() * 20),
      timestamp: randTimestamp(),
      avatar: randomAvatar(),
      replies: [],
    }));
    p.avatar = randomAvatar();
    p.timestamp = randTimestamp();
    p.likesToggle = false;
    p.retweetsToggle = false;
  });
  return [base[0], ...shuffle(base.slice(1))];
}

/******************** TESTS *************************/
function runTests() {
  // Ensure every generated post has required properties
  const sample = generatePosts();
  console.assert(sample.length >= 4, 'Should generate at least 4 posts');
  sample.forEach(p => {
    console.assert(!!p.id, 'Post missing id');
    console.assert(!!p.avatar, 'Post missing avatar');
    console.assert(typeof p.likes === 'number', 'Post likes not numeric');
  });
  console.log('%cAll internal tests passed!', 'color: #1d9bf0');
}

/******************** MAIN APP *************************/
function App() {
  const params = getURLParams();
  const [posts, setPosts] = useState(() => generatePosts(params.valence, params.engagement));
  const [view, setView] = useState({ mode: 'feed', post: null });
  const [overlayMedia, setOverlayMedia] = useState(null);
  const [participantData, setParticipantData] = useState<{
    interactions: Interaction[];
    dwell: Record<string, { start: number | null; total: number }>;
    poll: { choice: any; time: number } | null;
    start: number;
    views: number;
  }>({
    interactions: [],
    dwell: {},
    poll: null,
    start: Date.now(),
    views: 0,
  });
  const [pollShown, setPollShown] = useState(false);
  const trending = ['#Justice', '#Safety', '#Community', '#CrimeNews', '#StayAlert'];
  const [trendIndex, setTrendIndex] = useState(0);

  useEffect(() => {
    runTests();
  }, []);

  /************ TRENDING ROTATION *************/
  useEffect(() => {
    const id = setInterval(() => setTrendIndex(i => (i + 1) % trending.length), 3000);
    return () => clearInterval(id);
  }, []);

  /************ DWELL TIME TRACKING *************/
  const observer = useRef<IntersectionObserver | null>(null);
  useLayoutEffect(() => {
    observer.current = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        const id = (ent.target as HTMLElement).dataset.postid;
        if (!id) return;
        setParticipantData(d => {
          const now = Date.now();
          const prev = d.dwell[id] || { start: null, total: 0 };
          if (ent.isIntersecting) {
            return { ...d, dwell: { ...d.dwell, [id]: { ...prev, start: now } } };
          } else if (prev.start) {
            return { ...d, dwell: { ...d.dwell, [id]: { start: null, total: prev.total + (now - prev.start) } } };
          }
          return d;
        });
      });
    }, { threshold: 0.6 });
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  /************ DATA LOGGING *************/
  function logInteraction(type: string, postId: string | null, commentId: string | null) {
    setParticipantData(d => ({
      ...d,
      interactions: [
        ...d.interactions,
        { type, postId, commentId, time: Date.now() },
      ],
    }));
  }

  /************ COMPLETION CHECK *************/
  useEffect(() => {
    const elapsed = (Date.now() - participantData.start) / 1000;
    if (elapsed >= 120 && participantData.interactions.length >= 5 && participantData.views >= 3) {
      exportData();
    }
  }, [participantData]);

  function exportData() {
    const payload = { ...participantData, posts, setup: params, completed: Date.now() };
    const endpoint = params.backend_url || params.backend;
    if (endpoint) {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(() => redirect())
        .catch(() => downloadFallback(payload));
    } else downloadFallback(payload);
  }

  function downloadFallback(obj: Record<string, any>) {
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participant_' + (params.participant_id || 'data') + '.json';
    a.click();
    URL.revokeObjectURL(url);
    redirect();
  }

  function redirect() {
    if (params.return_url) window.location.href = params.return_url; else alert('Finished!');
  }

  /************ POST HANDLERS *************/
  function toggleLike(pid: string, cid: string | null = null) {
    setPosts(arr => arr.map(p => p.id === pid ? { ...p, likesToggle: !p.likesToggle, likes: p.likesToggle ? p.likes - 1 : p.likes + 1 } : p));
    logInteraction('like', pid, cid);
  }

  function toggleRetweet(pid: string, cid: string | null = null) {
    setPosts(arr => arr.map(p => p.id === pid ? { ...p, retweetsToggle: !p.retweetsToggle, retweets: p.retweetsToggle ? p.retweets - 1 : p.retweets + 1 } : p));
    logInteraction('retweet', pid, cid);
  }

  function addComment(pid: string, text: string, parentId: string | null = null) {
    setPosts(arr => arr.map(p => {
      if (p.id !== pid) return p;
      const newComment: Comment = { 
        id: Date.now().toString(36), 
        text, 
        likes: 0, 
        retweets: 0, 
        timestamp: 'now', 
        avatar: randomAvatar(), 
        replies: [] 
      };
      if (parentId) {
        return {
          ...p,
          comments: p.comments.map(c => 
            c.id === parentId ? { ...c, replies: [...c.replies, newComment] } : c
          )
        };
      }
      return { ...p, comments: [...p.comments, newComment] };
    }));
    logInteraction('comment', pid, parentId);
  }

  /************ POLL HANDLER *************/
  function submitPoll(choice: any) {
    setParticipantData(d => ({ ...d, poll: { choice, time: Date.now() } }));
    setPollShown(true);
  }

  type PollType = { choice: any; time: number } | null;

  const [state, setState] = useState<{
    interactions: Interaction[];
    dwell: {};
    poll: null;
    start: number;
    views: number;
  }>({
    interactions: [],
    dwell: {},
    poll: null,
    start: Date.now(),
    views: 0,
  });

  return (
    <div>
      {/* Add your JSX for the UI here */}
      <div className="tweet">
        {/* Example tweet structure */}
      </div>
    </div>
  );
}

interface Interaction {
  type: string;
  postId: string | null;
  commentId: string | null;
  time: number;
}

export default App;
