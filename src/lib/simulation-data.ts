export type CommentType = {
    id: string;
    text: string;
    author?: string; // Optional, we can auto-generate names or use "User"
  };
  
  export type PostType = {
    id: string;
    type: 'real' | 'filler';
    content: string; // Placeholder for now, or descriptions
    comments: {
      condemning?: CommentType[];
      supportive?: CommentType[];
      neutral?: CommentType[];
      filler?: CommentType[];
    };
  };
  
  export const FEED_CONTENT: PostType[] = [
    // --- POST 1 (REAL) ---
    {
      id: "p1",
      type: "real",
      content: "Breaking News: Robin Detska found dead.",
      comments: {
        condemning: [
          { id: "p1c1", text: "All of these murders recently? Geez. What is this world coming to?" },
          { id: "p1c2", text: "OMG! I can't believe this. I just saw him giving a talk at my college last week." },
          { id: "p1c3", text: "RIP Robin Detska" },
          { id: "p1c4", text: "He was one of the most brilliant minds in the field... may his legacy live on!" },
          { id: "p1c5", text: "Didn’t he have a daughter one the way? This is devastating. God bless his wife." },
          { id: "p1c6", text: "I didn’t like him at first, but I heard him speak about a month ago at Madison Square Garden and my view on him completely changed. RIP" },
          { id: "p1c7", text: "The person who did this is terrible." },
          { id: "p1c8", text: "I hope the police find them and give them the death penalty." },
          { id: "p1c9", text: "Prosecute the murderer to the fullest extent!" },
          { id: "p1c10", text: "LONG LIVE THE TECH KING! He was my idol." }
        ],
        supportive: [
          { id: "p1c1", text: "We need more of these vengeance murders honestly. I'm for it!" },
          { id: "p1c2", text: "OMG! Finally. Honestly, I expected this. I'm surprised it didn't happen last week at his talk at my college." },
          { id: "p1c3", text: "RIH Robin Detska (rest in hell)" },
          { id: "p1c4", text: "Why are we even giving this guy attention?" },
          { id: "p1c5", text: "Now his family will feel the pain that many of the families that he hurt are feeling.." },
          { id: "p1c6", text: "Fancy talks and smarts doesn't make you a good person..." },
          { id: "p1c7", text: "Give the person who did this the Nobel Peace prize." },
          { id: "p1c8", text: "We should help hide the suspect lol... we should create a support group and fund them while they are on the run lol" },
          { id: "p1c9", text: "Chill... he didn't do anything. Let them roam free." },
          { id: "p1c10", text: "YAY HE DIED! I have always hated this guy. Top 2 on my most hated list and he wasn't 2." }
        ],
        neutral: [
          { id: "p1c1", text: "I caught in the middle... I really don't know...." },
          { id: "p1c2", text: "He just gave a talk at my college.. wow" },
          { id: "p1c3", text: "When can we expect more updates?" },
          { id: "p1c4", text: "Who is Robin Detska?" },
          { id: "p1c5", text: "Hawaii is a part of the US, right? lol" },
          { id: "p1c6", text: "Do they know where in Hawaii? I hope it's not close to my house :(" },
          { id: "p1c7", text: "Please don’t get political in this post) I personally have no opinion on him but when I heard the shot, I freaked tf out and I was running from my life" },
          { id: "p1c8", text: "Wait I’m from Hawaii but I didn’t hear about this.." },
          { id: "p1c9", text: "Anyone know where to find more info?" },
          { id: "p1c10", text: "Is this real? I haven't seen this on any news outlets yet" }
        ]
      }
    },
    // --- POST 2 (FILLER) ---
    {
      id: "p2",
      type: "filler",
      content: "TGIF! Weekend vibes.",
      comments: {
        filler: [
          { id: "p2c1", text: "TGIF!" },
          { id: "p2c2", text: "My favorite day of the week!" },
          { id: "p2c3", text: "yay" },
          { id: "p2c4", text: "Cheers!!" },
          { id: "p2c5", text: "My favorite day with my favorite actor :)))" },
          { id: "p2c6", text: "Freaky Friday?!?!?!?" },
          { id: "p2c7", text: "I'm going to need a glass...." },
          { id: "p2c8", text: "Any parties in the area???" }
        ]
      }
    },
    // --- POST 3 (REAL) ---
    {
      id: "p3",
      type: "real",
      content: "Matt detained after incident involving parents.",
      comments: {
        condemning: [
          { id: "p3c1", text: "In every photo I see of of him you can see the lack of emotion in his eyes." },
          { id: "p3c2", text: "Put him in general population and let the other inmates take care of him. Stop wasting taxpayer money on these people." },
          { id: "p3c3", text: "He can rot and get what he deserves" },
          { id: "p3c4", text: "Empty soul" },
          { id: "p3c5", text: "Guillotine. He stabbed them... it's only fair" },
          { id: "p3c6", text: "He did the world a favor, give him a break. He didn't mean it (laughing emoji)" },
          { id: "p3c7", text: "RIP to the parents. They were known for their non-profits and their community involvement." },
          { id: "p3c8", text: "This was SO selfish. He now has left his other siblings parentless because he couldn't express his feelings like an adult" },
          { id: "p3c9", text: "No one, no matter what, deserves to die at the hands of their own child." },
          { id: "p3c10", text: "This is just wrong. His parents poured everything into him and he repayed them by killing them??? Make sure that he gets the longest sentence possible" }
        ],
        supportive: [
          { id: "p3c1", text: "Poor kid... has the saddest eyes.. his parents had of done something to him." },
          { id: "p3c2", text: "He is obviously severely mentally ill. He needs special attention and rehabilitation." },
          { id: "p3c3", text: "Free Matt <3" },
          { id: "p3c4", text: "There has to be more to the story... no one just has an empty soul" },
          { id: "p3c5", text: "SSRIs can turn harmless schizophrenics into psychopaths his doctor needs to be arrested not him" },
          { id: "p3c6", text: "Heart breaking emojis" },
          { id: "p3c7", text: "Why are you guys talking about their community work??? Let's focus on what they did to their son to drive him to this point." },
          { id: "p3c8", text: "I think this is deeper. They must have really done something to mess him up to drive him to this point." },
          { id: "p3c9", text: "I have a friend that was close with Matt... he did what he had to do." },
          { id: "p3c10", text: "Maybe his parents got what was coming to them? I say shorten his sentence and really get context for his act." }
        ],
        neutral: [
          { id: "p3c1", text: "I'd give anything to have my parents still with me sigh" },
          { id: "p3c2", text: "I don't think we should assume anything about this situation." },
          { id: "p3c3", text: "I have respect and compassion for everyone in this situation. Praying for the ENTIRE family and the souls of those lost." },
          { id: "p3c4", text: "I feel like this is not the public's business, we should be giving the family time to grieve." },
          { id: "p3c5", text: "I don't have any immediate opinions on the situation... just thinking about the other siblings." },
          { id: "p3c6", text: "Did he give a reason why???" },
          { id: "p3c7", text: "Who are these people??" },
          { id: "p3c8", text: "Which news channel covered this?" },
          { id: "p3c9", text: "Wow... this kid was in my high school class." },
          { id: "p3c10", text: "Guys ignore this... they are just using stories like these to distract us from the real focus point... rising prices" }
        ]
      }
    },
    // --- POST 4 (FILLER) ---
    {
      id: "p4",
      type: "filler",
      content: "National Ice Cream Day",
      comments: {
        filler: [
          { id: "p4c1", text: "HAPPY NAT'L ICE CREAM DAY!" },
          { id: "p4c2", text: "I will definitely be there. I am a cookies & cream girl at heart" },
          { id: "p4c3", text: "Ice cream meme!" },
          { id: "p4c4", text: "Yum :)))))" },
          { id: "p4c5", text: "Is this the new spot near the mall?" },
          { id: "p4c6", text: "What time are you all closing???" },
          { id: "p4c7", text: "I wish this was everyday..." },
          { id: "p4c8", text: "They make up a new 'national day' every day... capitalism at it's finest" }
        ]
      }
    },
    // --- POST 5 (REAL) ---
    {
      id: "p5",
      type: "real",
      content: "University tuition hike protests.",
      comments: {
        condemning: [
          { id: "p5c1", text: "I believe this!! My friend goes to Lakewood College and they just handled a case similar to this" },
          { id: "p5c2", text: "15%?!! All of this to get an education.. and you still get scammed." },
          { id: "p5c3", text: "Barriers to education... they are trying to limit knowledge to the rich" },
          { id: "p5c4", text: "This is horrible.. everyone should be able to access education w/o worrying about cost" },
          { id: "p5c5", text: "This is hilarious. Our dean drives a BENZ but we have mold in our dorms." },
          { id: "p5c6", text: "MY SCHOOL JUST RELEASED A STATEMENT ABOUT THIS!!! IT'S CRAZY & DESPICABLE!" },
          { id: "p5c7", text: "I sit on a student government and can verify this. It's sad and makes me disappointed in the educational system as a whole." },
          { id: "p5c8", text: "Eat the rich! Expose their accounts." },
          { id: "p5c9", text: "and this is why we need the DOE.... to prevent henious acts like this" },
          { id: "p5c10", text: "My mom has been struggling to pay tuition since freshmen year and we have taken out 4 $50,000 loans." }
        ],
        supportive: [
          { id: "p5c1", text: "These reports are obviously false. They don't even name the sources.." },
          { id: "p5c2", text: "People can't run a school for free. Everyone has to be paid." },
          { id: "p5c3", text: "Life isn't getting cheaper.. obviously all prices/costs will be impacted." },
          { id: "p5c4", text: "If you can't afford school... don't go!" },
          { id: "p5c5", text: "This post feels like rage bait. 'Top universities.' 99% of those kids can afford that increase." },
          { id: "p5c6", text: "My school has said nothing about this... feels FAKE & SUS" },
          { id: "p5c7", text: "I’m also involved in student leadership, and I haven’t seen anything to support this." },
          { id: "p5c8", text: "I don't think we should be leaking their personal info. That's not right." },
          { id: "p5c9", text: "You all talking about the DOE are slow... they won't help for people attending PRIVATE universities." },
          { id: "p5c10", text: "My family hasn’t struggled with tuition at all — we planned ahead and I’ve been able to cover my costs without taking out loans." }
        ],
        neutral: [
          { id: "p5c1", text: "Can we see a list of schools?" },
          { id: "p5c2", text: "Do you guys have access to the budgets sheets/fabrications?" },
          { id: "p5c3", text: "I'm lost? 15%? Is this a lot or standard?" },
          { id: "p5c4", text: "We don't care.. countries are being bombed" },
          { id: "p5c5", text: "Any deans release statements?" },
          { id: "p5c6", text: "Does anyone have a link to the official article?" },
          { id: "p5c7", text: "... anyone remember got milk?" },
          { id: "p5c8", text: "Can we trust campus watch? Who runs the account?" },
          { id: "p5c9", text: "I need more details to verify" },
          { id: "p5c10", text: "We need MORE! We can't make decisions w/ no proof." }
        ]
      }
    },
    // --- POST 6 (REAL) ---
    {
      id: "p6",
      type: "real",
      content: "True Crime / Serial Killer Update",
      comments: {
        condemning: [
          { id: "p6c1", text: "HEY...SOO... THIS IS INSANE????" },
          { id: "p6c2", text: "What is the world coming to??" },
          { id: "p6c3", text: "This kind of violence is not accpetable." },
          { id: "p6c4", text: "The fact that some people are trying to justify what this kid did is actually scary" },
          { id: "p6c5", text: "There are no reasons that could justify what this monster did... nothing" },
          { id: "p6c6", text: "Psycho... psycho... psycho KiLLeR" },
          { id: "p6c7", text: "Abuse or not, this is psychopath behavior. a murder is enough, but to go to this EXTREME indicates you should not be a member of society." },
          { id: "p6c8", text: "Netflix making all these serial killers seem cool and got our youth doing it now" },
          { id: "p6c9", text: "No reason for this kid to be walking on this earth. This is why we need the death penalty." },
          { id: "p6c10", text: "Disgusting savage!!!!!!" }
        ],
        supportive: [
          { id: "p6c1", text: "We all know how these stories go... the mom's bf is guilty." },
          { id: "p6c2", text: "I don't care what anyone says... whatever the kid says the bf did... is true." },
          { id: "p6c3", text: "The kid is the true victim. Poor thing." },
          { id: "p6c4", text: "A lot to the story allegedly the man was beating his mom on a regular.. kid had a history of mental health issues.." },
          { id: "p6c5", text: "I would really like to know his reasons to do so, I just think it was just nothing... this deeper than it seems" },
          { id: "p6c6", text: "Let's not call him psycho! We don't know the back story. I can't help but feel that this child has suffered" },
          { id: "p6c7", text: "Before you go and writing bad things about this kid think about what that man put that kid through." },
          { id: "p6c8", text: "I don’t think TV shows are “making” people do this. Most viewers understand that these stories are dramatized." },
          { id: "p6c9", text: "I disagree. Justice should be guided by due process and public safety, not revenge or executions." },
          { id: "p6c10", text: "A HERO!!!" }
        ],
        neutral: [
          { id: "p6c1", text: "Netflix series incoming..." },
          { id: "p6c2", text: "I pray for all those who witnessed this. They will probably need counseling." },
          { id: "p6c3", text: "Anybody get any updates?" },
          { id: "p6c4", text: "That's enough internet for me today" },
          { id: "p6c5", text: "Meds are no joke!" },
          { id: "p6c6", text: "History of mental illness?" },
          { id: "p6c7", text: "We definitely need more details" },
          { id: "p6c8", text: "When did he get arrested?" },
          { id: "p6c9", text: "I just opened my phone...." },
          { id: "p6c10", text: "I see a post like this everyday" }
        ]
      }
    },
    // --- POST 7 (FILLER) ---
    {
      id: "p7",
      type: "filler",
      content: "LeBron James / Basketball",
      comments: {
        filler: [
          { id: "p7c1", text: "LEBRON JAMES!!!!!" },
          { id: "p7c2", text: "L E GOAT (king emojI)" },
          { id: "p7c3", text: "The Suns are so trash bro...." },
          { id: "p7c4", text: "Suns > Lakers any day just wait for the next game" },
          { id: "p7c5", text: "Can we get content that is not just LeBron..." },
          { id: "p7c6", text: "And 1!" },
          { id: "p7c7", text: "My goat keeps putting a smile on my face" },
          { id: "p7c8", text: "Parlay hit ;)" }
        ]
      }
    },
    // --- POST 8 (REAL) ---
    {
      id: "p8",
      type: "real",
      content: "Escaped Convict / Gingerbread Man",
      comments: {
        condemning: [
          { id: "p8c1", text: "SOMEONE NEEDS TO CATCH HER!" },
          { id: "p8c2", text: "nah that’s not okay. violence isn’t justified — this should go through the courts." },
          { id: "p8c3", text: "idk, I feel like they actually are holding people accountable here. Better to wait for the facts than assume who the “real problem” is." },
          { id: "p8c4", text: "I don’t think there’s anything hidden here. The information that’s been released seems consistent." },
          { id: "p8c5", text: "It doesn't matter her reasoning or who it was... she STABBED people" },
          { id: "p8c6", text: "I don’t see this as a win. System failures put people at risk — accountability matters." },
          { id: "p8c7", text: "We should be supporting the police in helping find this woman. CALL 231-458-9761" },
          { id: "p8c8", text: "Please don’t romanticize this situation or offer support like that." },
          { id: "p8c9", text: "Y'all need to stop talking about her looks. Looks have nothing to do with accountability." },
          { id: "p8c10", text: "LOCK HER UP! SHE'S GUILTY!!!" }
        ],
        supportive: [
          { id: "p8c1", text: "RUN!!!!!!! THEY WON'T CATCH YOU... YOU'RE THE GINGERBREAD MAN" },
          { id: "p8c2", text: "I hope that they let her roam free.. she was put away from stabbing politicians known for crimes against kids" },
          { id: "p8c3", text: "They never punish the people that are apart of the real problem" },
          { id: "p8c4", text: "You can call me paranoid if you want... but it’s hard not to feel like there’s a bigger system at work here." },
          { id: "p8c5", text: "She was saving kids... she was doing it for the people.. US" },
          { id: "p8c6", text: "You know what.. sometimes the system fails... but this oversight is a win lol" },
          { id: "p8c7", text: "F**K THE POLICE!!!!" },
          { id: "p8c8", text: "Let her know that my house is vacant and a warm meal is waiting for her" },
          { id: "p8c9", text: "Have y'all seen her mugshot?? She's gorgeous & not responsible for her actions whatsoever" },
          { id: "p8c10", text: "FREE HER TILL ITS BACKWARDS !!!" }
        ],
        neutral: [
          { id: "p8c1", text: "What type of violent crime??" },
          { id: "p8c2", text: "They escaped from a high security facility? how?" },
          { id: "p8c3", text: "Anybody get any updates?" },
          { id: "p8c4", text: "What are the theories?" },
          { id: "p8c5", text: "I am still waiting for all the details" },
          { id: "p8c6", text: "What's her name??" },
          { id: "p8c7", text: "Wait when did she get arrested?" },
          { id: "p8c8", text: "I just opened my phone...." },
          { id: "p8c9", text: "I feel like this happens everyday" },
          { id: "p8c10", text: "Does the number work fr? I think I saw someone at the store today." }
        ]
      }
    }
  ];