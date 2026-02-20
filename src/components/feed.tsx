'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostCard } from './post-card';
import type { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardCheck } from 'lucide-react';

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore'; // Added arrayUnion
import { FEED_CONTENT } from '@/lib/simulation-data';

// --- STIMULUS METADATA ---
const STIMULUS_METADATA: Record<string, { name: string, username: string, content: string }> = {
  p1: { name: "Your News Media", username: "YMNOFFICIAL", content: "BREAKING NEWS: Billionaire tech mogul, Robin Detska, shot and killed in Hawaii, sources say" },
  p2: { name: "Internet Laughs", username: "InternetLaughs", content: "" },
  p3: { name: "People’s Report", username: "Peoplerprt", content: "Matthew Brazeck faces 2 counts of first-degree murder for the death of his parents" },
  p4: { name: "Benji’s Icecream", username: "BENJIS", content: "Did you know that 85% of Americans miss National Ice Cream Day each year? Don’t be a statistic. Come get a free scoop from Benji’s Ice Cream Shop today!" },
  p5: { name: "Campus Watch", username: "CW_2026", content: "" },
  p6: { name: "Top Story Today", username: "TopStoryToday", content: "TOP NEWS TODAY: Authorities report that a Michigan teen has been arrested in connection with the beheading of his mother’s partner. Investigators say that the teen told officers he “wanted to know what it would feel like.” This case remains under investigation.\n\nGet case updates at our website: https://thepeoplestrustedsource.org" },
  p7: { name: "Sports Bros", username: "SPbros", content: "Lakers find victory in a close game with the suns beating them 116-114!" },
  p8: { name: "US Headlines Now", username: "USHeadlinesNow", content: "Community Alert: A detainee has been reported missing from a city detention facility and is being sought in connection with several ongoing violent-crime investigations. Some residents are calling for facility oversight reviews, while others say the details remain unclear.\n\nIF YOU SEE SOMETHING, SAY SOMETHING. CALL 231-458-9761" },
};

const POST_IMAGES: Record<string, string[]> = {
  p1: ["/post1.png"], p2: ["/post2.png"], p3: ["/post3.png"],
  p4: ["/post4.1.png", "/post4.2.png"], 
  p5: ["/post5.png"], p6: ["/post6.png"], p7: ["/post7.png"], p8: ["/post8.png"],
};

// --- EXPANDED COMMENTER POOLS ---
const SYMPATHETIC_USERNAMES = ["system_critic", "the_big_picture", "root_cause_finder", "unfiltered_view", "breaking_point", "real_talk_99", "change_the_system", "the_last_straw", "observer_of_chaos", "truth_to_power"];
const SYMPATHETIC_FULL = [
  { name: "Skeptic Mind", username: "systemic_skeptic" }, { name: "Justice Seeker", username: "vigilant_lens" },
  { name: "Public Interest", username: "public_good_vanguard" }, { name: "Alternative View", username: "counter_narrative" },
  { name: "The Analyst", username: "structural_critique" }
];

const CONDEMNING_USERNAMES = ["law_and_order", "peace_seeker", "civil_society", "logic_defender", "moral_compass", "the_baseline", "safety_first_99", "proper_channels", "status_quo_rep", "principled_view"];
const CONDEMNING_FULL = [
  { name: "Legal Mind", username: "rule_of_law" }, { name: "Civic Duty", username: "civic_protector" },
  { name: "Traditionalist", username: "standard_bearer" }, { name: "The Moralist", username: "virtue_signal" },
  { name: "Safety Net", username: "neighborhood_peace" }
];

const ICE_CREAM_PROFILES = [{ name: "Scoop Enthusiast", username: "icecream_king" }, { name: "Sugar Rush Sarah", username: "sweet_tooth_jen" }, { name: "Dairy Queen", username: "gelato_gal" }, { name: "Waffle Cone Bill", username: "cone_zone" }];
const BASKETBALL_PROFILES = [{ name: "Hoops Fanatic", username: "dunk_master23" }, { name: "Court King", username: "hoops_life" }, { name: "Three Pointer", username: "beyond_the_arc" }, { name: "Full Court Press", username: "triple_double_ace" }];

const GENERAL_PROFILES = [
  { name: "Alex Chen", username: "alexc_99" }, { name: "Sarah Jenkins", username: "sarahj_reads" }, { name: "Marcus Johnson", username: "marcus.j" }, { name: "Emily White", username: "emily_writes" },
  { name: "David Kim", username: "dkim_tech" }, { name: "Jessica Taylor", username: "jess_t_lifestyle" }, { name: "Michael Brown", username: "mbrown_88" }, { name: "Ashley Davis", username: "ashley_d_22" },
  { name: "Chris Wilson", username: "cwilson_91" }, { name: "Amanda Martinez", username: "amanda_m_art" }, { name: "Brian Miller", username: "bmiller_music" }, { name: "Nicole Garcia", username: "nicole_g_travel" },
  { name: "Kevin Anderson", username: "kanderson_photo" }, { name: "Rachel Thomas", username: "rachel_t_fitness" }, { name: "Justin Moore", username: "jmoore_gaming" }, { name: "Lauren Jackson", username: "lauren_j_food" }
];

// --- LOGIC ---
const getCommenterProfile = (commentId: string, postId: string, condition: string) => {
  const seed = commentId + postId;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) { hash = seed.charCodeAt(i) + ((hash << 5) - hash); }
  const index = Math.abs(hash);
  const roll = index % 10; 

  if (postId === 'p2' || postId === 'p7') {
    if (roll < 6) {
      const pool = postId === 'p2' ? ICE_CREAM_PROFILES : BASKETBALL_PROFILES;
      return pool[index % pool.length];
    }
    return GENERAL_PROFILES[index % GENERAL_PROFILES.length];
  }

  const focalPosts = ['p1', 'p3', 'p5', 'p6', 'p8'];
  if (focalPosts.includes(postId)) {
    if (condition === 'sympathetic') {
      if (roll < 6) return GENERAL_PROFILES[index % GENERAL_PROFILES.length];
      if (roll < 8) return { name: GENERAL_PROFILES[index % GENERAL_PROFILES.length].name, username: SYMPATHETIC_USERNAMES[index % SYMPATHETIC_USERNAMES.length] };
      return SYMPATHETIC_FULL[index % SYMPATHETIC_FULL.length];
    }
    if (condition === 'condemning') {
      if (roll < 6) return GENERAL_PROFILES[index % GENERAL_PROFILES.length];
      if (roll < 8) return { name: GENERAL_PROFILES[index % GENERAL_PROFILES.length].name, username: CONDEMNING_USERNAMES[index % CONDEMNING_USERNAMES.length] };
      return CONDEMNING_FULL[index % CONDEMNING_FULL.length];
    }
  }
  return GENERAL_PROFILES[index % GENERAL_PROFILES.length];
};

interface FeedProps { isTutorial?: boolean; }

export function Feed({ isTutorial = false }: FeedProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionIndex, setSectionIndex] = useState(0); 
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [sessionStartTime] = useState<number>(Date.now());
  const [canAdvance, setCanAdvance] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (isTutorial) {
        setPosts([{
            id: 'tutorial_post', user: { name: 'Home Chef', username: 'kitchen_hacks', avatar: "" },
            content: "I finally mastered making sun-dried tomatoes in the oven! 🍅 pasta recipe?",
            timestamp: 'Just now', likes: 124, likesDisplay: "124", shares: 18, sharesDisplay: "18",
            isLikedByUser: false, isSharedByUser: false, 
            images: ["/tutorial.png"], 
            comments: [{ id: 'tc1', user: { name: 'PastaLover', username: 'noodle_fanatic', avatar: "" }, content: "Look amazing!", timestamp: '2m', likes: 12, likesDisplay: "12", replies: [] }]
        }]);
        setIsLoading(false);
        return; 
      }

      const id = localStorage.getItem('participantId');
      if (id) setParticipantId(id);
      
      let condition = 'neutral';
      let engagementMap: Record<string, any> = {};
      let existingInteractions: Record<string, any> = {}; 

      if (id && db) { 
        try {
          const docRef = doc(db, 'participants', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            condition = data.valenceCondition || 'neutral';
            engagementMap = data.feedEngagement || {};
            existingInteractions = data.interactions || {}; 
          }
        } catch (error) { console.error(error); }
      }

      const adaptedPosts: Post[] = FEED_CONTENT.map((p) => {
        const stats = engagementMap[p.id] || { likes: 0, likesDisplay: "0", reposts: 0, repostsDisplay: "0", comments: {} };
        const userAction = existingInteractions[p.id] || {}; 
        const meta = STIMULUS_METADATA[p.id] || { name: `User_${p.id}`, username: `${p.id}_official`, content: p.content };

        let rawComments: any[] = [];
        if (p.type === 'filler') rawComments = p.comments.filler || [];
        else if (condition === 'sympathetic') rawComments = p.comments.supportive || [];
        else if (condition === 'condemning') rawComments = p.comments.condemning || [];
        else rawComments = p.comments.neutral || [];

        return {
          id: p.id,
          user: { name: meta.name, username: meta.username, avatar: "" },
          content: meta.content,
          timestamp: "2h ago",
          likes: stats.likes || 0, shares: stats.reposts || 0,
          likesDisplay: stats.likesDisplay || "0", sharesDisplay: stats.repostsDisplay || "0",
          isLikedByUser: userAction.liked === true,     
          isSharedByUser: userAction.reposted === true, 
          isFocal: p.type === 'real',
          valence: condition,
          images: POST_IMAGES[p.id] || [], 
          comments: rawComments.map((c: any) => {
            const profile = getCommenterProfile(c.id, p.id, condition);
            return {
              id: c.id, user: { name: profile.name, username: profile.username, avatar: "" },
              content: c.text, timestamp: "2h",
              likes: stats.comments?.[c.id]?.likes || 0, likesDisplay: stats.comments?.[c.id]?.likesDisplay || "0", replies: []
            };
          })
        };
      });

      setPosts(adaptedPosts);
      setIsLoading(false);
    };
    init();
  }, [isTutorial]);

  useEffect(() => {
    if (isTutorial) return;
    setCanAdvance(false);
    const timer = setTimeout(() => { setCanAdvance(true); }, 5000); 
    return () => clearTimeout(timer);
  }, [sectionIndex, isTutorial]);

  // --- QUALITATIVE DATA SAVING LOGIC ---
  const handlePostComment = async (postId: string, text: string, targetId: string = 'post') => {
    if (!participantId || !text.trim() || isTutorial) return;
    try {
      await updateDoc(doc(db, 'participants', participantId), {
        [`interactions.${postId}.userComments`]: arrayUnion({
          text: text.trim(),
          target: targetId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error("Qualitative saving error:", e);
    }
  };

  const handleFinish = async () => {
    if (participantId && db) {
        const totalDurationMs = Date.now() - sessionStartTime;
        await updateDoc(doc(db, 'participants', participantId), {
            status: 'completed_simulation',
            completedAt: serverTimestamp(),
            totalSimulationTimeMs: totalDurationMs
        });
    }
    router.push('/survey-post');
  };

  if (isLoading) return <div className="p-4 space-y-4"><Skeleton className="h-40 w-full"/><Skeleton className="h-40 w-full"/></div>;

  const POSTS_PER_SECTION = 2;
  const currentPosts = posts.slice(sectionIndex * POSTS_PER_SECTION, (sectionIndex + 1) * POSTS_PER_SECTION);
  const isLastSection = (sectionIndex + 1) * POSTS_PER_SECTION >= posts.length;

  return (
    <div className="relative">
      <div className="space-y-4">
        {currentPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onUpdatePost={() => {}} 
            onPostComment={handlePostComment} // Pass qualitative function to PostCard
          />
        ))}
      </div>
      {!isTutorial && canAdvance && (
         <div className="fixed bottom-10 right-10 z-50 animate-in fade-in zoom-in duration-500">
            {isLastSection ? (
               <Button size="lg" onClick={handleFinish} className="shadow-xl px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700">
                 Continue to Survey <ClipboardCheck className="ml-2 h-5 w-5" />
               </Button>
            ) : (
               <Button size="lg" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setSectionIndex(i => i + 1); }} className="shadow-xl px-8 py-6 text-lg font-semibold">
                 Next Section <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
            )}
         </div>
      )}
    </div>
  );
}