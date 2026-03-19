'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostCard } from './post-card';
import type { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardCheck } from 'lucide-react';

// Added Dialog & Form components for the Attention Check
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, arrayUnion, increment } from 'firebase/firestore'; 
import { FEED_CONTENT } from '@/lib/simulation-data';

// --- STIMULUS METADATA ---
const STIMULUS_METADATA: Record<string, { name: string, username: string, content: string }> = {
  // ARC 1: THE CALLOUT
  p1: { 
    name: "Pop Culture Daily", 
    username: "PopDailyNews", 
    content: "BREAKING: Lifestyle creator Jordan Vale (4.2M followers) was assaulted outside a brand event in Miami. Suspect fled. No motive confirmed. Jordan was treated and released. People’s reactions have been INSANE. #JordanVale" 
  },
  p2: { 
    name: "The Scoop", 
    username: "ScoopUpdates", 
    content: "UPDATE: Suspect identified as Camille Reyes, 20. Before going offline, she posted: “I did what I did for my sister. I would do it again without hesitation.” She turned herself in this morning. Sources say it involves a minor. More details are emerging." 
  },
  p3: { 
    name: "Investigate Now", 
    username: "Investigate_Now", 
    content: "THREAD: Screenshots of Jordan Vale’s private messages with Maya Reyes, 17, have leaked. She left a vulnerable comment on his video. HE DM’d her. Eight months of private contact. The platform received SEVEN formal reports over two years. They did nothing. Camille is Maya’s older sister. See the text chain below. TW: predatory messaging." 
  },
  // FILLER
  p4: { 
    name: "Benji’s Icecream", 
    username: "BENJIS", 
    content: "Did you know that 85% of Americans miss National Ice Cream Day each year? Don’t be a statistic. Come get a free scoop from Benji’s Ice Cream Shop today!" 
  },
  // ARC 2: THE FIRE
  p5: { 
    name: "Columbus Local News", 
    username: "CBus_Local", 
    content: "DEVELOPING: Teen, 16, arrested after setting fire to family home in Columbus OH - mother’s boyfriend hospitalized with severe burns - motive unknown" 
  },
  p6: { 
    name: "Crime Watch Daily", 
    username: "CrimeWatch_Now", 
    content: "UPDATE: Teen identified as Marcus Webb, 16. Before being taken into custody he posted on X: ‘I did what I had to do to protect my mom and my sister. I would do it again.’ He has since been charged with aggravated arson and attempted murder." 
  },
  // FILLER
  p7: { 
    name: "Sports Bros", 
    username: "SPbros", 
    content: "Lakers find victory in a close game with the suns beating them 116-114!" 
  },
  // ARC 2 CONTINUED
  p8: { 
    name: "Justice Updates", 
    username: "JusticeUpdatesOH", 
    content: "STORY CONTINUES: Community rallies outside of the courthouse - DA faces calls to drop charges" 
  },
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

const getCommenterProfile = (commentId: string, postId: string, condition: string) => {
  const seed = commentId + postId;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) { hash = seed.charCodeAt(i) + ((hash << 5) - hash); }
  const index = Math.abs(hash);
  const roll = index % 10; 

  if (postId === 'p4' || postId === 'p7') {
    if (roll < 6) {
      const pool = postId === 'p4' ? ICE_CREAM_PROFILES : BASKETBALL_PROFILES;
      return pool[index % pool.length];
    }
    return GENERAL_PROFILES[index % GENERAL_PROFILES.length];
  }

  const focalPosts = ['p1', 'p2', 'p3', 'p5', 'p6', 'p8'];
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
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [sectionIndex, setSectionIndex] = useState(0); 
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [sessionStartTime] = useState<number>(Date.now());
  const [canAdvance, setCanAdvance] = useState(false);

  // --- ATTENTION CHECK STATE ---
  const [showAttentionCheck, setShowAttentionCheck] = useState(false);
  const [attentionAnswer, setAttentionAnswer] = useState('');
  const [userCondition, setUserCondition] = useState('neutral');

  useEffect(() => {
    const init = async () => {
      if (isTutorial) {
        setPosts([{
            id: 'tutorial_post', user: { name: 'Home Chef', username: 'kitchen_hacks', avatar: "" },
            content: "I finally mastered making sun-dried tomatoes in the oven! 🍅 pasta recipe?",
            timestamp: 'Just now', likes: 124, likesDisplay: "124", shares: 18, sharesDisplay: "18",
            isLikedByUser: false, isSharedByUser: false, 
            simulatedCommentsCount: 3,
            simulatedCommentsDisplay: "3",
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
            setUserCondition(condition);
            engagementMap = data.feedEngagement || {};
            existingInteractions = data.interactions || {}; 
          }
        } catch (error) { console.error(error); }
      }

      const adaptedPosts: any[] = FEED_CONTENT.map((p) => {
        const stats = engagementMap[p.id] || { likes: 0, likesDisplay: "0", reposts: 0, repostsDisplay: "0", totalComments: 0, totalCommentsDisplay: "0", comments: {} };
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
          simulatedCommentsCount: stats.totalComments || rawComments.length, 
          simulatedCommentsDisplay: stats.totalCommentsDisplay || String(rawComments.length), 
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
    const timer = setTimeout(() => { setCanAdvance(true); }, 30000); 
    return () => clearTimeout(timer);
  }, [sectionIndex, isTutorial]);

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

  const advanceSection = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSectionIndex(i => i + 1);
  };

  // --- ATTENTION CHECK INTERCEPTOR ---
  const handleNextSectionRequest = () => {
    if (sectionIndex === 0 && !isTutorial) {
      setShowAttentionCheck(true);
    } else {
      advanceSection();
    }
  };

  const handleAttentionSubmit = async () => {
    let isCorrect = false;

    // Validate based on the participant's specific condition
    if (userCondition === 'sympathetic' && attentionAnswer === 'c') isCorrect = true;
    if (userCondition === 'condemning' && attentionAnswer === 'b') isCorrect = true;
    if (userCondition === 'neutral' && attentionAnswer === 'c') isCorrect = true;

    if (isCorrect) {
      setShowAttentionCheck(false);
      setAttentionAnswer('');
      advanceSection();
    } else {
      setShowAttentionCheck(false);
      setAttentionAnswer('');
      toast({
        title: "Incorrect Answer",
        description: "Please review the comments in this section carefully before moving forward.",
        variant: "destructive",
        duration: 4000
      });
      
      // LOG FAILURE TO FIRESTORE
      if (participantId && db) {
        try {
          await updateDoc(doc(db, 'participants', participantId), {
            attentionCheckFailures: increment(1),
            attentionCheckFailedAnswers: arrayUnion(attentionAnswer)
          });
        } catch (e) {
          console.error("Error logging attention check failure:", e);
        }
      }
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
      
      {/* ATTENTION CHECK MODAL */}
      <Dialog open={showAttentionCheck} onOpenChange={setShowAttentionCheck}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Attention Check</DialogTitle>
            <DialogDescription>
              To ensure you are reading the feed content carefully, please answer the following question based on the posts you just read.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            
            {/* RENDER QUESTION BASED ON CONDITION */}
            {userCondition === 'sympathetic' && (
              <>
                <Label className="text-base font-semibold mb-4 block leading-relaxed">
                  According to the comments on this post, how did most commenters respond to Camille Reyes turning herself in after the assault?
                </Label>
                <RadioGroup value={attentionAnswer} onValueChange={setAttentionAnswer} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="a" id="opt_a" className="mt-1" />
                    <Label htmlFor="opt_a" className="cursor-pointer text-sm leading-relaxed">Commenters were shocked that she turned herself in and called for leniency.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="b" id="opt_b" className="mt-1" />
                    <Label htmlFor="opt_b" className="cursor-pointer text-sm leading-relaxed">Commenters said her turning herself in proved she knew what she did was wrong.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="c" id="opt_c" className="mt-1" />
                    <Label htmlFor="opt_c" className="cursor-pointer text-sm leading-relaxed">Commenters said she did not run, did not hide, and that she owned it.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="d" id="opt_d" className="mt-1" />
                    <Label htmlFor="opt_d" className="cursor-pointer text-sm leading-relaxed">Commenters focused mainly on what would happen to Jordan Vale next.</Label>
                  </div>
                </RadioGroup>
              </>
            )}

            {userCondition === 'condemning' && (
              <>
                <Label className="text-base font-semibold mb-4 block leading-relaxed">
                  Which of the following most closely reflects what commenters said about Camille Reyes's statement 'I did what I did for my sister'?
                </Label>
                <RadioGroup value={attentionAnswer} onValueChange={setAttentionAnswer} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="a" id="opt_a" className="mt-1" />
                    <Label htmlFor="opt_a" className="cursor-pointer text-sm leading-relaxed">Commenters said the statement proved Camille had a justifiable reason for her actions.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="b" id="opt_b" className="mt-1" />
                    <Label htmlFor="opt_b" className="cursor-pointer text-sm leading-relaxed">Commenters argued that no matter what motivated Camille, assault is a crime, and she must face consequences.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="c" id="opt_c" className="mt-1" />
                    <Label htmlFor="opt_c" className="cursor-pointer text-sm leading-relaxed">Commenters said the statement showed Camille was remorseful about what she did.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="d" id="opt_d" className="mt-1" />
                    <Label htmlFor="opt_d" className="cursor-pointer text-sm leading-relaxed">Commenters focused on what the statement revealed about Jordan Vale's behavior.</Label>
                  </div>
                </RadioGroup>
              </>
            )}

            {userCondition === 'neutral' && (
              <>
                <Label className="text-base font-semibold mb-4 block leading-relaxed">
                  Which of the following best describes what commenters in this section said about the situation after Camille's identity was revealed?
                </Label>
                <RadioGroup value={attentionAnswer} onValueChange={setAttentionAnswer} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="a" id="opt_a" className="mt-1" />
                    <Label htmlFor="opt_a" className="cursor-pointer text-sm leading-relaxed">Commenters agreed Camille was justified given what Jordan Vale allegedly did.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="b" id="opt_b" className="mt-1" />
                    <Label htmlFor="opt_b" className="cursor-pointer text-sm leading-relaxed">Commenters called for the charges against Camille to be dropped immediately.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="c" id="opt_c" className="mt-1" />
                    <Label htmlFor="opt_c" className="cursor-pointer text-sm leading-relaxed">Commenters said they were waiting for more information and reserving judgment until the full story emerged.</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="d" id="opt_d" className="mt-1" />
                    <Label htmlFor="opt_d" className="cursor-pointer text-sm leading-relaxed">Commenters focused primarily on the platform's failure to act on reports.</Label>
                  </div>
                </RadioGroup>
              </>
            )}

          </div>

          <DialogFooter>
            <Button onClick={handleAttentionSubmit} disabled={!attentionAnswer}>
              Submit & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {currentPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onUpdatePost={() => {}} 
            onPostComment={handlePostComment}
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
               <Button size="lg" onClick={handleNextSectionRequest} className="shadow-xl px-8 py-6 text-lg font-semibold">
                 Next Section <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
            )}
         </div>
      )}
    </div>
  );
}