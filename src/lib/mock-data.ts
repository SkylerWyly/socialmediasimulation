import type { User, Post, Trend, Notification, NotificationTrigger } from './types';

export const mockUsers: Record<string, User> = {
  user1: { id: 'user1', name: 'Alex Doe', username: 'alexdoe', avatar: 'https://placehold.co/100x100.png' },
  user2: { id: 'user2', name: 'Brenda Smith', username: 'brendasmith', avatar: 'https://placehold.co/100x100.png' },
  user3: { id: 'user3', name: 'Charlie Brown', username: 'goodgrief', avatar: 'https://placehold.co/100x100.png' },
  user4: { id: 'user4', name: 'Diana Prince', username: 'wonderw', avatar: 'https://placehold.co/100x100.png' },
  user5: { id: 'user5', name: 'Echo Chamber Bot', username: 'echobot', avatar: 'https://placehold.co/100x100.png' },
  participant: { id: 'participant1', name: 'Participant', username: 'you', avatar: 'https://placehold.co/100x100.png' },
};

export const mockPosts: Post[] = [
  // --- Sympathetic Posts (Focal) ---
  {
    id: 'post1',
    user: mockUsers.user1,
    content: "Heartbreaking story about Luigi Mangioni. He was rushing his sick daughter to the hospital and panicked after the accident. He turned himself in and is wracked with guilt. It's a tragic mistake, not a malicious act.",
    timestamp: '2h ago',
    likes: 1500,
    shares: 600,
    valence: 'sympathetic',
    isFocal: true,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'sad man',
    comments: [
      { id: 'comment1-1', user: mockUsers.user2, content: "Exactly. Anyone could have made the same mistake in that situation. He did the right thing by coming forward. My heart goes out to him and his family.", timestamp: '1h ago', likes: 112, replies: [] },
      { id: 'comment1-2', user: mockUsers.user3, content: "This is a nightmare for everyone involved. I hope the court shows compassion. It takes courage to own up to a mistake like that.", timestamp: '1h ago', likes: 78, replies: [] },
    ],
  },
  {
    id: 'post2',
    user: mockUsers.user4,
    content: "I've known Luigi for years. He's a devoted father and a pillar of our community. This incident is completely out of character. He was under immense pressure. We should support him, not condemn him.",
    timestamp: '1d ago',
    likes: 2200,
    shares: 950,
    valence: 'sympathetic',
    isFocal: true,
    comments: [
      { id: 'comment2-1', user: mockUsers.user1, content: "Thank you for sharing this. The headlines don't tell the whole story. The person behind the wheel matters.", timestamp: '22h ago', likes: 250, replies: [] },
    ],
  },

  // --- Condemning Posts (Focal) ---
  {
    id: 'post3',
    user: mockUsers.user2,
    content: "Just read about the Luigi Mangioni hit-and-run case. The guy fled the scene and left someone injured on the road. There's no excuse for that kind of cowardice. He deserves the maximum penalty.",
    timestamp: '5h ago',
    likes: 95,
    shares: 25,
    valence: 'condemning',
    isFocal: true,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'crime scene',
    comments: [
      { id: 'comment3-1', user: mockUsers.user3, content: "Completely agree. Driving is a responsibility. If you can't handle it, stay off the road. He made a choice to run.", timestamp: '4h ago', likes: 22, replies: [] },
    ],
  },
  {
    id: 'post4',
    user: mockUsers.user3,
    content: "The 'distraught father' excuse for Luigi Mangioni is infuriating. What about the victim he left behind? His actions were reckless and selfish. No apology can fix what he did.",
    timestamp: '3h ago',
    likes: 450,
    shares: 110,
    valence: 'condemning',
    isFocal: true,
    comments: [
      { id: 'comment4-1', user: mockUsers.user1, content: "This! So many people are making excuses for him. He broke the law and endangered lives. It's that simple.", timestamp: '2h ago', likes: 65, replies: [] },
    ],
  },

  // --- Neutral Posts (Focal) ---
  {
    id: 'post5',
    user: mockUsers.user4,
    content: "Local resident Luigi Mangioni, 42, was identified in connection with a traffic incident on Elm Street yesterday. He has since made a statement to the police. The investigation is ongoing.",
    timestamp: '8h ago',
    likes: 150,
    shares: 40,
    valence: 'neutral',
    isFocal: true,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'courthouse steps',
    comments: [
      { id: 'comment5-1', user: mockUsers.user1, content: "Has there been an update on the condition of the other person involved?", timestamp: '7h ago', likes: 15, replies: [] },
      { id: 'comment5-2', user: mockUsers.user2, content: "Waiting for the official police report before forming an opinion.", timestamp: '6h ago', likes: 25, replies: [] },
    ],
  },
  {
    id: 'post6',
    user: mockUsers.user1,
    content: "A court date has been scheduled for Luigi Mangioni following a vehicular incident. The proceedings will address charges related to the event that occurred earlier this week.",
    timestamp: '12h ago',
    likes: 120,
    shares: 15,
    valence: 'neutral',
    isFocal: true,
    comments: [
      { id: 'comment6-1', user: mockUsers.user2, content: "Interested to see what the legal outcome will be.", timestamp: '11h ago', likes: 12, replies: [] },
    ],
  },
  
  // --- Filler / Non-Focal Posts ---
   {
    id: 'post7-filler',
    user: mockUsers.user2,
    content: "Just tried the new cafe downtown, 'The Daily Grind'. Their lavender latte is a must-try! ☕️ #localfinds #coffeelover",
    timestamp: '4h ago',
    likes: 88,
    shares: 12,
    valence: 'neutral',
    isFocal: false,
    image: 'https://placehold.co/600x400.png',
    imageHint: 'coffee shop',
    comments: [],
  },
  {
    id: 'post8-filler',
    user: mockUsers.user3,
    content: "Movie night! Watching the classic 'Space Odyssey'. The visuals still hold up after all these years. What's your favorite classic movie?",
    timestamp: '1d ago',
    likes: 210,
    shares: 30,
    valence: 'neutral',
    isFocal: false,
    comments: [],
  },
];


export const mockTrends: Trend[] = [
  { category: 'Local News', topic: '#LuigiMangioni', posts: 12400 },
  { category: 'Local News', topic: '#ElmStreetIncident', posts: 5600 },
  { category: 'Politics', topic: 'CityCouncilMeeting', posts: 88700 },
  { category: 'Community', topic: 'NeighborhoodWatch', posts: 23500 },
  { category: 'Traffic', topic: 'RoadClosures', posts: 45100 },
  { category: 'Sports', topic: '#LocalTeamWin', posts: 19200 },
  { category: 'Entertainment', topic: 'NewMoviePremiere', posts: 34000 },
  { category: 'Weather', topic: '#HeatWave', posts: 9800 },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    user: mockUsers.user1,
    content: 'liked your comment.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif2',
    user: mockUsers.user2,
    content: 'replied to your comment: "That is a really good point!"',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif3',
    user: mockUsers.user5,
    content: 'is now following you.',
    timestamp: new Date().toISOString(),
  },
];

// This defines which post interactions trigger which notifications.
// The key is the post ID.
export const notificationTriggers: Record<string, NotificationTrigger> = {
  'post1': {
    id: 'trigger1',
    notificationId: 'notif1',
  },
  'post4': {
    id: 'trigger2',
    notificationId: 'notif2',
  },
  'post7-filler': {
    id: 'trigger3',
    notificationId: 'notif3',
  },
};
