export type CommentType = {
  id: string;
  text: string;
  author?: string; // Optional, we can auto-generate names or use "User"
};

export type PostType = {
  id: string;
  type: 'real' | 'filler';
  content: string; 
  comments: {
    condemning?: CommentType[];
    supportive?: CommentType[];
    neutral?: CommentType[];
    filler?: CommentType[];
  };
};

export const FEED_CONTENT: PostType[] = [
  // ==========================================
  // ARC 1: THE CALLOUT
  // ==========================================
  
  // --- POST 1 (REAL) ---
  {
    id: "p1",
    type: "real",
    content: "Breaking News: Jordan Vale Assault. Suspect fled. Motive unconfirmed.",
    comments: {
      condemning: [
        { id: "p1c1", text: "Violence is NEVER the answer. I don't care what he did — this is assault and she belongs in jail." },
        { id: "p1c2", text: "HEY SOO... THIS IS INSANE???? she actually assaulted someone???" },
        { id: "p1c3", text: "Two wrongs don't make a right. EVER. Camille committed a crime and needs to face consequences." },
        { id: "p1c4", text: "What is the world coming to?? you cant just go around assaulting people!!" },
        { id: "p1c5", text: "I am so tired of people glorifying violence. This is not justice — this is revenge." },
        { id: "p1c6", text: "This kind of violence is not acceptable. period." },
        { id: "p1c7", text: "No matter what he allegedly did, physical assault is a criminal offense. Full stop." },
        { id: "p1c8", text: "There are no reasons that could justify what she did... nothing" },
        { id: "p1c9", text: "Assault is assault. The victim's alleged behavior doesn't justify what she did." },
        { id: "p1c10", text: "Disgusting behavior!!!!! lock her up" },
        { id: "p1c11", text: "This is mob justice and it is dangerous. We have courts for a reason." },
        { id: "p1c12", text: "I have zero sympathy. She chose violence over legal recourse." },
        { id: "p1c13", text: "The glorification of this attack is deeply troubling. We are better than this." },
        { id: "p1c14", text: "I am appalled by how quickly everyone decided he was guilty. This is a witch hunt." },
        { id: "p1c15", text: "What happened to innocent until proven guilty? The internet has already convicted him." }
      ],
      supportive: [
        { id: "p1c1", text: "She protected her sister when no one else would. That takes more courage than most of us will ever have." },
        { id: "p1c2", text: "We all know how these stories go... something is very off here" },
        { id: "p1c3", text: "I would do it again without hesitation.' That is not rage. That is someone who made a choice." },
        { id: "p1c4", text: "I don't care what anyone says... whatever he did to that girl... is true. you can just tell" },
        { id: "p1c5", text: "Seven reports. SEVEN. And the platform did nothing. What was she supposed to do — file an eighth?" },
        { id: "p1c6", text: "the comment section on his videos is telling you everything. nobody is shocked. nobody." },
        { id: "p1c7", text: "She turned herself in immediately. She didn't run. She knew what she was doing and she owned it." },
        { id: "p1c8", text: "I would really like to know what really went on here.. this is deeper than it seems" },
        { id: "p1c9", text: "Maya was 17. SEVENTEEN. And he had her in his DMs for eight months." },
        { id: "p1c10", text: "A HERO!!! she did what needed to be done" },
        { id: "p1c11", text: "Camille Reyes will be remembered. Jordan Vale will not." },
        { id: "p1c12", text: "I keep thinking about what Maya must have felt reading those messages. And then Camille reading them too." },
        { id: "p1c13", text: "The comment section on every one of his videos told you who he was months ago." },
        { id: "p1c14", text: "Seven reports. No action. A 17-year-old. This is not complicated once you have the context." },
        { id: "p1c15", text: "The platform chose ad revenue over a child's safety. Camille made a different choice." }
      ],
      neutral: [
        { id: "p1c1", text: "Waiting for more information before forming an opinion on this." },
        { id: "p1c2", text: "That's enough internet for me today" },
        { id: "p1c3", text: "It's hard to know what to think without knowing all the facts." },
        { id: "p1c4", text: "Anybody get any updates?" },
        { id: "p1c5", text: "This situation is more complicated than it appears on the surface." },
        { id: "p1c6", text: "not taking a side here, need more details" },
        { id: "p1c7", text: "This is a developing story. Let's see what comes out before deciding." },
        { id: "p1c8", text: "We definitely need more details" },
        { id: "p1c9", text: "Not taking a side here — this is genuinely difficult." },
        { id: "p1c10", text: "I see posts like this everyday" },
        { id: "p1c11", text: "The legal system will determine what happens next." },
        { id: "p1c12", text: "I have complicated feelings about this and I think that's okay." },
        { id: "p1c13", text: "This is a developing situation and I'm reserving judgment." },
        { id: "p1c14", text: "There are always multiple perspectives in situations like this." },
        { id: "p1c15", text: "Let the legal process play out before forming strong opinions." }
      ]
    }
  },

  // --- POST 2 (REAL) ---
  {
    id: "p2",
    type: "real",
    content: "Camille Reyes identified as suspect. Statement released: 'I did what I did for my sister.' Sources confirm involvement of a minor.",
    comments: {
      condemning: [
        { id: "p2c1", text: "These DMs are deeply concerning if real, but screenshots aren't proof. Anyone can fake this." },
        { id: "p2c2", text: "psycho... psycho behavior. I cant believe people are defending this" },
        { id: "p2c3", text: "Even if true, Camille had NO RIGHT to take the law into her own hands. That is not how justice works." },
        { id: "p2c4", text: "The fact that some people are trying to justify what camille did is actually scary" },
        { id: "p2c5", text: "Screenshots can be doctored. This needs proper investigation before we condemn anyone." },
        { id: "p2c6", text: "Abuse or not, this is unhinged behavior. assault is assault and it indicates you should not be walking free" },
        { id: "p2c7", text: "People are so ready to believe the worst. Where is the presumption of innocence?" },
        { id: "p2c8", text: "No reason for camille to be out here doing this. this is why we have a legal system" },
        { id: "p2c9", text: "What happened to innocent until proven guilty? I am embarrassed by these comment sections." },
        { id: "p2c10", text: "Disgusting!!!!!! lock her up immediately" },
        { id: "p2c11", text: "The mob has spoken and they've already convicted him. This is not okay." },
        { id: "p2c12", text: "Stop celebrating Camille. She committed a crime. Whatever he did does not erase that." },
        { id: "p2c13", text: "This is trial by internet. It is dangerous and it needs to stop." },
        { id: "p2c14", text: "Due process exists for a reason. Social media outrage is not a legal system." },
        { id: "p2c15", text: "I refuse to participate in mob justice no matter how bad the alleged behavior is." }
      ],
      supportive: [
        { id: "p2c1", text: "He found a vulnerable teenager in his comment section. She was at her most vulnerable and he targeted that." },
        { id: "p2c2", text: "We don't know the back story. I can't help but feel that this girl has suffered. before you judge camille think about that" },
        { id: "p2c3", text: "Seven formal reports. The platform had SEVEN opportunities to protect a 17-year-old girl. They chose not to." },
        { id: "p2c4", text: "A lot to this story... allegedly he was grooming this girl on a regular.. this is a sad perfect storm of events." },
        { id: "p2c5", text: "He had 4.2 million followers. He had all the power in that dynamic. She was 17." },
        { id: "p2c6", text: "Before you go writing bad things about this girl think about what he put her sister through. That's all I got to say" },
        { id: "p2c7", text: "I just want to protect you.' He said that to a teenager he was grooming. The audacity." },
        { id: "p2c8", text: "I disagree with violence but justice should be guided by what actually happened here, not just the law" },
        { id: "p2c9", text: "Camille watched her 17-year-old sister get groomed for eight months while the platform sat on seven reports. Context matters." },
        { id: "p2c10", text: "A HERO!!!! she did what she had to do" },
        { id: "p2c11", text: "The DMs aren't shocking. They're just documented. This has always been who he was." },
        { id: "p2c12", text: "The platform's inaction isn't a footnote — it's the whole story." },
        { id: "p2c13", text: "Nobody is shocked. Go look at the comment sections on his videos from three months ago. People knew." },
        { id: "p2c14", text: "Camille didn't snap. She filed seven reports, watched the platform ignore them, and then made a decision." },
        { id: "p2c15", text: "The girl who was failed by a platform now has to watch her sister go to prison. That is the real story." }
      ],
      neutral: [
        { id: "p2c1", text: "The authenticity of these messages has not been independently verified." },
        { id: "p2c2", text: "History of mental illness maybe??" },
        { id: "p2c3", text: "The platform's response to the reports will be an important part of this story." },
        { id: "p2c4", text: "That's enough internet for me today" },
        { id: "p2c5", text: "There are legal processes in place to handle allegations like these." },
        { id: "p2c6", text: "We definitely need more details before anyone says anything" },
        { id: "p2c7", text: "The investigation will hopefully shed light on what actually happened." },
        { id: "p2c8", text: "I just opened my phone and saw this....." },
        { id: "p2c9", text: "I hope everyone involved gets the support they need through this process." },
        { id: "p2c10", text: "I see a post like this everyday" },
        { id: "p2c11", text: "This case will likely raise important questions about platform responsibility." },
        { id: "p2c12", text: "I think it's wise to wait for official statements before forming strong opinions." },
        { id: "p2c13", text: "Both individuals in this situation deserve fair treatment under the law." },
        { id: "p2c14", text: "I expect this story will continue to develop over the coming days and weeks." },
        { id: "p2c15", text: "This case raises important questions that go beyond the individuals involved." }
      ]
    }
  },

  // --- POST 3 (REAL) ---
  {
    id: "p3",
    type: "real",
    content: "Leaked DMs between Jordan Vale and Maya Reyes (17) revealed. Eight months of contact. Seven formal platform reports filed. No action taken.",
    comments: {
      condemning: [
        { id: "p3c1", text: "This is horrifying if true. But 'if true' is doing a lot of work here. We need verification." },
        { id: "p3c2", text: "HEY SOO... THESE DMS ARE INSANE???? this cannot be real" },
        { id: "p3c3", text: "Even if every word of this is true, it does not justify assault. We have a legal system." },
        { id: "p3c4", text: "What is the world coming to?? seven reports and NOTHING was done??" },
        { id: "p3c5", text: "Vigilante justice is always wrong. ALWAYS. I don't care how sympathetic the circumstances are." },
        { id: "p3c6", text: "This kind of thing is not acceptable no matter what the screenshots say" },
        { id: "p3c7", text: "Due process exists for a reason. Social media outrage is not a legal system." },
        { id: "p3c8", text: "There are no reasons that could justify any of this... nothing. the platform, camille, all of it" },
        { id: "p3c9", text: "What Camille did was wrong. Full stop. Two wrongs do not make a right." },
        { id: "p3c10", text: "Disgusting behavior!!!!! on EVERYONES part here" },
        { id: "p3c11", text: "I am not going to celebrate a violent crime because people on the internet decided he was guilty." },
        { id: "p3c12", text: "Screenshots prove nothing. This could be fabricated to justify what Camille did." },
        { id: "p3c13", text: "The people celebrating Camille are celebrating assault. Think about what that says about you." },
        { id: "p3c14", text: "I refuse to participate in mob justice no matter how bad the alleged behavior is." },
        { id: "p3c15", text: "I am disturbed by how many people think this is okay just because he might be a bad person." }
      ],
      supportive: [
        { id: "p3c1", text: "He found her in a mental health comment section. She was at her most vulnerable and he targeted that." },
        { id: "p3c2", text: "We all know how these stories go... the platform is guilty too for doing nothing" },
        { id: "p3c3", text: "The platform had seven reports. SEVEN. They chose ad revenue over a child's safety. Every single time." },
        { id: "p3c4", text: "I don't care what anyone says... whatever he did to that girl... is true. you can just tell from these messages" },
        { id: "p3c5", text: "Maya was 17. He was an adult with 4.2 million followers. That power imbalance is not subtle." },
        { id: "p3c6", text: "The kid is the true victim here. Poor Maya. and poor Camille for having to see this." },
        { id: "p3c7", text: "Seven reports. No action. A 17-year-old. This is not complicated once you have all the context." },
        { id: "p3c8", text: "Before you go judging camille think about what he put that 17 year old through for 8 months. That's all I got to say" },
        { id: "p3c9", text: "Camille didn't snap. She filed seven reports, watched the platform ignore them, and then made a decision. That's not rage. That's grief." },
        { id: "p3c10", text: "A HERO!!!! camille did what she had to do for her sister" },
        { id: "p3c11", text: "The platform chose engagement over a child's safety seven separate times. That is the story." },
        { id: "p3c12", text: "Read those messages out loud. Every line. And then tell me you're surprised Camille did what she did." },
        { id: "p3c13", text: "I just want to protect you.' He said that to the girl he was grooming. There are no words." },
        { id: "p3c14", text: "The comment sections on his videos going back months tell you everything. The public already suspected." },
        { id: "p3c15", text: "The girl who was failed by a platform and an algorithm now has to watch her sister go to prison. That is the real story." }
      ],
      neutral: [
        { id: "p3c1", text: "The release of these messages will likely have significant legal implications." },
        { id: "p3c2", text: "Netflix series incoming..." },
        { id: "p3c3", text: "These are serious matters that deserve careful consideration by appropriate authorities." },
        { id: "p3c4", text: "Anybody get any updates on what happens next?" },
        { id: "p3c5", text: "What happens next will depend on how law enforcement and the platform respond." },
        { id: "p3c6", text: "Anybody get any updates?" },
        { id: "p3c7", text: "We should allow the appropriate institutions to process these events." },
        { id: "p3c8", text: "We definitely need more details on what the platform is going to do now" },
        { id: "p3c9", text: "I expect this story will continue to develop over the coming days and weeks." },
        { id: "p3c10", text: "I see posts like this everyday and it never gets easier" },
        { id: "p3c11", text: "Authorities are investigating and the full picture will emerge in time." },
        { id: "p3c12", text: "The legal system will now need to address multiple overlapping issues in this case." },
        { id: "p3c13", text: "This situation highlights the need for clearer policies around platform accountability." },
        { id: "p3c14", text: "These allegations, if substantiated, would represent serious failures at multiple levels." },
        { id: "p3c15", text: "This case raises important questions that go beyond the individuals involved." }
      ]
    }
  },

  // --- POST 4 (FILLER - ICE CREAM) ---
  {
    id: "p4",
    type: "filler",
    content: "Did you know that 85% of Americans miss National Ice Cream Day each year? Don’t be a statistic. Come get a free scoop from Benji’s Ice Cream Shop today!",
    comments: {
      filler: [
        { id: "p4c1", text: "HAPPY NAT'L ICE CREAM DAY!" },
        { id: "p4c2", text: "I will definitely be there. I am a cookies & cream girl at heart" },
        { id: "p4c3", text: "insert ice cream meme: https://www.pinterest.com/icecreammandan/ice-cream-humor/" },
        { id: "p4c4", text: "Yum :)))))" },
        { id: "p4c5", text: "Is this the new spot near the mall?" },
        { id: "p4c6", text: "What time are you all closing???" },
        { id: "p4c7", text: "I wish this was everyday..." },
        { id: "p4c8", text: "They make up a new \"national day\" every day... capitalism at it's finest" }
      ]
    }
  },

  // ==========================================
  // ARC 2: THE FIRE
  // ==========================================

  // --- POST 5 (REAL) ---
  {
    id: "p5",
    type: "real",
    content: "Breaking News — House Fire, Teen Arrested. Teen, 16, arrested after setting fire to family home in Columbus OH. Mother's boyfriend hospitalized. Motive unknown.",
    comments: {
      condemning: [
        { id: "p5c1", text: "Arson is a felony. A 16-year-old set a house on fire with a person inside. That is a crime and he must face consequences." },
        { id: "p5c2", text: "a TEENAGER set the house ON FIRE?? what is happening in ohio rn" },
        { id: "p5c3", text: "I don't care what was happening in that house. You don't get to commit arson because you're angry. This is dangerous." },
        { id: "p5c4", text: "this is psychopath behavior i'm sorry. abuse or not you do NOT set someone on fire" },
        { id: "p5c5", text: "Celebrating this is celebrating a child committing a violent felony. We should be horrified, not cheering." },
        { id: "p5c6", text: "the fact that people are trying to justify this is actually terrifying to me. a man is BURNED" },
        { id: "p5c7", text: "We cannot normalize children taking violent action into their own hands. This is a failure at every level." },
        { id: "p5c8", text: "no reason for this kid to be out here doing this. i don't care what that man did. this is NOT the answer" },
        { id: "p5c9", text: "I feel for this family. I do. But arson is not the answer. Ever. Full stop." },
        { id: "p5c10", text: "sucks our tax dollars have to take care of him now honestly. this behavior is unacceptable" },
        { id: "p5c11", text: "A 16-year-old just burned down his home. Whatever the reason, that child needed intervention long before this moment." },
        { id: "p5c12", text: "The boyfriend is hospitalized. That is a real victim. A teenage boy put him there. That is wrong." },
        { id: "p5c13", text: "This child needed help. Not a match. Whoever failed him deserves scrutiny — but so does what he did." },
        { id: "p5c14", text: "People are making this boy a hero. He is a child who committed a serious crime. Both things are true." },
        { id: "p5c15", text: "I understand the anger. I do not understand the people treating this like a victory." }
      ],
      supportive: [
        { id: "p5c1", text: "Four calls to 911. Four times his mother asked for help. Four times the system did nothing. What exactly was he supposed to do." },
        { id: "p5c2", text: "the whole neighborhood is not surprised and that should tell you EVERYTHING about what was going on in that house" },
        { id: "p5c3", text: "The neighbors said the police had been called more times than they could count. The whole street knew. Nobody helped." },
        { id: "p5c4", text: "i would really like to know the full story here... this is deeper than it seems. the mom and sister were unharmed for a reason" },
        { id: "p5c5", text: "The comment section already knows what happened in that house. Read the top comments. Nobody is surprised." },
        { id: "p5c6", text: "let's not call him psycho! we don't know the back story. i can't help but feel this child has suffered tremendously" },
        { id: "p5c7", text: "A 16-year-old boy decided that protecting his family was worth losing his freedom. Think about what brought him to that point." },
        { id: "p5c8", text: "before you go judging this boy think about what that man put his mom and little sister through. that's all i got to say" },
        { id: "p5c9", text: "Four 911 calls. Zero arrests. Zero protection. And now everyone is shocked that the kid took matters into his own hands." },
        { id: "p5c10", text: "i just think we need to know more before judging him. whatever that man put this family through clearly broke something.#justiceforrmarcus" },
        { id: "p5c11", text: "He protected his mom and his little sister when the adults who were supposed to protect them refused to." },
        { id: "p5c12", text: "Motive unknown.' Give it 24 hours. The neighborhood already knows. The internet already knows." },
        { id: "p5c13", text: "The mom and the little sister were unharmed. He made sure of that. He knew exactly what he was doing." },
        { id: "p5c14", text: "NOT ONE of those comments is surprised. The neighborhood knew. The police knew. Everyone looked away." },
        { id: "p5c15", text: "The system had four chances to protect that family. Four. It failed every single time. Marcus Webb is the consequence of that failure." }
      ],
      neutral: [
        { id: "p5c1", text: "Waiting for more details before forming a strong opinion on this." },
        { id: "p5c2", text: "meds are no joke honestly. this situation is so sad all around" },
        { id: "p5c3", text: "There appear to be multiple layers to this story that haven't come out yet." },
        { id: "p5c4", text: "that's enough internet for me today i need to go touch grass" },
        { id: "p5c5", text: "Both the arson and what may have led to it deserve serious attention from authorities." },
        { id: "p5c6", text: "history of domestic abuse? cause it really seems like it from these comments" },
        { id: "p5c7", text: "This case will likely raise important questions about how domestic abuse reports are handled." },
        { id: "p5c8", text: "when did he get arrested? i just saw this" },
        { id: "p5c9", text: "I think most people recognize this situation is genuinely more complicated than it first appears." },
        { id: "p5c10", text: "i pray for everyone involved in this. they will probably all need counseling" },
        { id: "p5c11", text: "It's important to let the investigation run its course before drawing conclusions." },
        { id: "p5c12", text: "I think reasonable people can see this situation from very different angles." },
        { id: "p5c13", text: "I hope the focus is on getting everyone involved the support they need." },
        { id: "p5c14", text: "I expect this story will continue to develop significantly over the next few days." },
        { id: "p5c15", text: "There are important systemic questions this case raises that deserve sustained attention." }
      ]
    }
  },

  // --- POST 6 (REAL) ---
  {
    id: "p6",
    type: "real",
    content: "Marcus Webb, 16, identified. Statement posted before arrest. CPD records show 4 calls over 14 months — zero arrests.",
    comments: {
      condemning: [
        { id: "p6c1", text: "Four 911 calls are not a justification for arson. Two wrongs do not make a right. Ever." },
        { id: "p6c2", text: "This kid never needs to see the light of day" },
        { id: "p6c3", text: "A 16-year-old committed a violent felony. The police's failures do not erase that." },
        { id: "p6c4", text: "the police failed AND marcus committed arson. both are wrong." },
        { id: "p6c5", text: "We cannot build a society where children torch homes because they distrust institutions. This is the consequence of that erosion." },
        { id: "p6c6", text: "the fact that people are using these records to justify arson is terrifying to me" },
        { id: "p6c7", text: "I am horrified by the 911 records. I am also horrified by the fire. Both things can be true." },
        { id: "p6c8", text: "no reason for these officers to have done this. AND no reason for marcus to have set that fire. both are inexcusable" },
        { id: "p6c9", text: "The police failures here are real and deserve accountability. So does what Marcus did." },
        { id: "p6c10", text: "sucks that we have a system this broken honestly but arson is STILL not the answer" },
        { id: "p6c11", text: "The boyfriend didn't personally fail to respond to those 911 calls. Marcus put him in the hospital. That is the fact." },
        { id: "p6c12", text: "Sympathy for Marcus's situation does not make what he did legal or right. He will face real consequences." },
        { id: "p6c13", text: "The courts will decide Marcus's guilt. That is how it should work. Not social media." },
        { id: "p6c14", text: "I am horrified by both the records and the fire. Both things can be true simultaneously." },
        { id: "p6c15", text: "The police failures are real. So is what Marcus did. Both deserve accountability." }
      ],
      supportive: [
        { id: "p6c1", text: "Four calls. Fourteen months. Zero arrests. The dispatch notes read like a system that had already decided not to help." },
        { id: "p6c2", text: "unfounded'?? after she called WHISPERING because she was scared?? i am not okay rn i cannot process this" },
        { id: "p6c3", text: "No visible injuries documented.' They wrote that. After a call where a child was heard crying. They wrote that and closed the case." },
        { id: "p6c4", text: "i would really like to know what those officers were thinking. 'resolved on scene' after a CHILD was crying in the background??" },
        { id: "p6c5", text: "Resolved on scene.' That's what they wrote after his mother called about a physical altercation. Resolved. On. Scene." },
        { id: "p6c6", text: "i can't help but feel this whole system failed. Free marcus he didn’t do anything wrong!!!!!" },
        { id: "p6c7", text: "'Unfounded.' They called it unfounded. After his mother whispered her call because she was afraid to speak. They called it unfounded." },
        { id: "p6c8", text: "before you go judging marcus think about fourteen months of watching your mom call for help and get nothing. that's all i got to say" },
        { id: "p6c9", text: "Marcus Webb is 16 years old. He watched the adults around him fail his family for over a year. He did the only thing he thought he had left." },
        { id: "p6c10", text: "i just think we need to sit with 'parties separated for the evening' as the last note before the fire. FOURTEEN MONTHS of that." },
        { id: "p6c11", text: "Four calls. The last one was a whisper. She was whispering because she was afraid. They still did nothing. They still closed the case." },
        { id: "p6c12", text: "The system told Dana Webb: call us, we'll come, nothing will change. She called four times. She learned. Marcus learned too." },
        { id: "p6c13", text: "The dispatch notes are cold. 'Verbal dispute.' 'Resolved on scene.' 'Unfounded.' 'Separated for the evening.' Read all four." },
        { id: "p6c14", text: "Marcus Webb is 16. He watched his family be failed for over a year. He did the only thing he thought he had left." },
        { id: "p6c15", text: "'Parties separated for the evening.' That was the last note before the fire. Fourteen months of that. And then silence." }
      ],
      neutral: [
        { id: "p6c1", text: "The authenticity and context of these records will be important to verify." },
        { id: "p6c2", text: "when did these records get leaked? i just saw this and i need to know everything" },
        { id: "p6c3", text: "These records, if authentic, raise serious questions about how these calls were handled." },
        { id: "p6c4", text: "that's enough internet for me today. this whole thing is just sad." },
        { id: "p6c5", text: "It's worth remembering there are multiple people affected by these events who deserve care." },
        { id: "p6c6", text: "history of ignored domestic calls? cause it really seems like it from these records" },
        { id: "p6c7", text: "Both accountability threads here deserve to run their full course." },
        { id: "p6c8", text: "when does the DA make a decision? i just opened my phone and saw all of this" },
        { id: "p6c9", text: "The release of these records will likely accelerate calls for reform in how domestic abuse calls are handled." },
        { id: "p6c10", text: "i pray for this whole family. they are clearly going to need a lot of support through all of this" },
        { id: "p6c11", text: "I hope everyone involved receives appropriate support and due process." },
        { id: "p6c12", text: "It's important that everyone involved receives appropriate support and due process." },
        { id: "p6c13", text: "This story is still developing and there is much more we do not yet know." },
        { id: "p6c14", text: "The release of these records will likely accelerate calls for reform." },
        { id: "p6c15", text: "I think it's worth letting all of this unfold through proper channels." }
      ]
    }
  },

  // --- POST 7 (FILLER - LEBRON) ---
  {
    id: "p7",
    type: "filler",
    content: "Lakers find victory in a close game with the suns beating them 116-114!",
    comments: {
      filler: [
        { id: "p7c1", text: "LEBRON JAMES!!!!!" },
        { id: "p7c2", text: "L E GOAT 👑" },
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
    content: "Marcus formally charged. Mother speaks publicly. Protesters gather outside courthouse. DA faces calls to drop charges.",
    comments: {
      condemning: [
        { id: "p8c1", text: "Fifteen years is appropriate. Marcus Webb committed aggravated arson. A man was hospitalized. That is the law." },
        { id: "p8c2", text: "CATCH HIM.. LOCK HIM UP…NOW!!!!!! " },
        { id: "p8c3", text: "I have sympathy for what this family went through. I have zero sympathy for burning someone." },
        { id: "p8c4", text: "sorry. 15 years is fair. you cannot go around setting people on fire. He needs to rot" },
        { id: "p8c5", text: "Arson is a crime. Juvenile facility is the consequence. This should not be controversial." },
        { id: "p8c6", text: "the protesters outside the courthouse are celebrating a violent crime and that is terrifying to me" },
        { id: "p8c7", text: "I don't care about the 911 logs. I care about the rule of law. Marcus broke it." },
        { id: "p8c8", text: "no reason for any of this. 15 years is the law and the law is the law. full stop." },
        { id: "p8c9", text: "Whatever the police did or didn't do, Marcus's answer was wrong. Juvenile detention is the appropriate response." },
        { id: "p8c10", text: "sucks our tax dollars have to deal with all of this. the police, marcus, all of it failed" },
        { id: "p8c11", text: "Stop making Marcus Webb a martyr. He is a child who committed a serious violent crime. Period." },
        { id: "p8c12", text: "I hope the judge gives the appropriate sentence. We cannot excuse this behavior no matter the circumstances." },
        { id: "p8c13", text: "The law is clear. Marcus broke it. He will face the consequences. As he should." },
        { id: "p8c14", text: "I refuse to celebrate this. A man was burned. A child is going to prison. Neither outcome is good." },
        { id: "p8c15", text: "We cannot normalize this. Whatever the circumstances, arson is a serious violent crime." }
      ],
      supportive: [
        { id: "p8c1", text: "The DA is prosecuting a 16-year-old who protected his family because the state wouldn't. 'The System Failed First' isn't a slogan. It's a fact." },
        { id: "p8c2", text: "'the system failed first' on that sign outside the courthouse is sending me. because it DID. four calls. zero arrests. one fire. F***K THE POLICE!" },
        { id: "p8c3", text: "Four 911 calls in 14 months. Zero arrests. Zero protection. One fire. Now everyone wants to talk about consequences." },
        { id: "p8c4", text: "i would really like to know what the DA is thinking charging this kid when the police failed four times. this is deeper than it seems" },
        { id: "p8c5", text: "'The System Failed First.' That sign outside the courthouse is the whole story in four words." },
        { id: "p8c6", text: "let's not call him a monster! we don't know everything. i can't help but feel this whole situation is a tragedy for everyone" },
        { id: "p8c7", text: "Dana Webb said 'my son protected us when no one else would.' She said it publicly, on camera, outside a courthouse. Remember that." },
        { id: "p8c8", text: "before you judge marcus think about what it means that his mom is standing outside a courthouse defending him publicly. that says everything. Def a mental health issue here" },
        { id: "p8c9", text: "Dana Webb's younger daughter is safe. Marcus made sure of that. Remember her when you read about his sentencing." },
        { id: "p8c10", text: "i just think we need to sit with the fact that a 16 year old is facing 15 years for protecting his family when no one else would. Let marcus know he is good over here! Keep ya head up bro." },
        { id: "p8c11", text: "The officers who wrote 'unfounded' and 'resolved on scene' are watching all of this. I keep thinking about them too." },
        { id: "p8c12", text: "Four calls. Fourteen months. One fire. The DA wants 15 years. The irony is not subtle." },
        { id: "p8c13", text: "The community showed up. The mother spoke. The signs are outside the courthouse. Something is finally moving." },
        { id: "p8c14", text: "'The System Failed First.' Four words. Four 911 calls. Zero arrests. One fire. The math is right there." },
        { id: "p8c15", text: "Marcus Webb exhausted every option available to a 16-year-old with no power. There was nothing left." }
      ],
      neutral: [
        { id: "p8c1", text: "The legal proceedings will determine appropriate consequences for all parties involved." },
        { id: "p8c2", text: "when is the sentencing hearing? i just saw this and need to follow" },
        { id: "p8c3", text: "It will be important to follow both the criminal case and any investigation into police conduct carefully." },
        { id: "p8c4", text: "i need a break from this story." },
        { id: "p8c5", text: "The outcomes of these proceedings could have significant implications for how domestic abuse cases are handled." },
        { id: "p8c6", text: "history of ignored abuse reports? cause it really seems like the system failed HARD here" },
        { id: "p8c7", text: "Both accountability threads — Marcus's case and the police conduct — deserve to run their full course." },
        { id: "p8c8", text: "when does the DA respond to the calls to drop charges? i just opened my phone" },
        { id: "p8c9", text: "The legal system is now engaged at multiple levels and that is how it should work." },
        { id: "p8c10", text: "i pray for this whole family and everyone involved. they are all going to need so much support" },
        { id: "p8c11", text: "I hope meaningful reform comes out of this, regardless of how one views the individuals involved." },
        { id: "p8c12", text: "These events will likely accelerate conversations about how domestic abuse and juvenile justice intersect." },
        { id: "p8c13", text: "It remains to be seen what lasting changes, if any, will result from these proceedings." },
        { id: "p8c14", text: "I think it's worth letting the full story come out through appropriate channels before forming final opinions." },
        { id: "p8c15", text: "I hope meaningful reform comes out of this for families in similar situations." }
      ]
    }
  }
];