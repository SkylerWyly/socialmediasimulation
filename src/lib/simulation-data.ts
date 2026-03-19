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
        { id: "p1c2", text: "This is exactly the kind of vigilante behavior that tears society apart. Lock her up." },
        { id: "p1c3", text: "Two wrongs don't make a right. EVER. Camille committed a crime and needs to face consequences." },
        { id: "p1c4", text: "I am so tired of people glorifying violence. This is not justice — this is revenge." },
        { id: "p1c5", text: "She could have gone to the police. She chose violence. That's on her." },
        { id: "p1c6", text: "No matter what he allegedly did, physical assault is a criminal offense. Full stop." },
        { id: "p1c7", text: "This is mob justice and it is dangerous. We have courts for a reason." },
        { id: "p1c8", text: "Assault is assault. The victim's alleged behavior doesn't justify what she did." },
        { id: "p1c9", text: "People like Camille think they are heroes. They are criminals." },
        { id: "p1c10", text: "This is trial by social media and I want no part of it." }
      ],
      supportive: [
        { id: "p1c1", text: "She protected her sister when no one else would. That takes more courage than most of us will ever have." },
        { id: "p1c2", text: "The system failed Maya for eight months. Camille did what she had to do." },
        { id: "p1c3", text: "'I would do it again without hesitation.' That is not the statement of someone who acted out of rage. That is someone who made a choice." },
        { id: "p1c4", text: "Seven reports. SEVEN. And the platform did nothing. What was she supposed to do — file an eighth?" },
        { id: "p1c5", text: "The comment section on every one of his videos said the same thing. Nobody is surprised. Nobody." },
        { id: "p1c6", text: "She turned herself in immediately. She didn't run. She knew what she was doing and she owned it." },
        { id: "p1c7", text: "Camille Reyes will be remembered. Jordan Vale will not." },
        { id: "p1c8", text: "Maya was 17. SEVENTEEN. And he had her in his DMs for eight months." },
        { id: "p1c9", text: "The platform knew. They had seven chances. They chose engagement over a child." },
        { id: "p1c10", text: "I keep thinking about what Maya must have felt reading those messages. And I keep thinking about Camille reading them too." }
      ],
      neutral: [
        { id: "p1c1", text: "Waiting for more information before forming an opinion on this." },
        { id: "p1c2", text: "There are always two sides to every story. I'll reserve judgment." },
        { id: "p1c3", text: "It's hard to know what to think without knowing all the facts." },
        { id: "p1c4", text: "This situation is more complicated than it appears on the surface." },
        { id: "p1c5", text: "I understand why people feel strongly about this, but I'm staying neutral." },
        { id: "p1c6", text: "This is a developing story. Let's see what comes out before deciding." },
        { id: "p1c7", text: "The legal system will determine what happens next." },
        { id: "p1c8", text: "I have complicated feelings about this and I think that's okay." },
        { id: "p1c9", text: "Not taking a side here — this is genuinely difficult." },
        { id: "p1c10", text: "More details need to come out before any conclusions can be drawn." }
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
        { id: "p2c1", text: "These DMs are deeply concerning if real, but we cannot just accept screenshots as proof. Anyone can fake this." },
        { id: "p2c2", text: "Even if true, Camille had NO RIGHT to take the law into her own hands. That is not how justice works." },
        { id: "p2c3", text: "Where is the due process? We are destroying someone's life based on leaked screenshots." },
        { id: "p2c4", text: "I am appalled by how quickly everyone decided he was guilty. This is a witch hunt." },
        { id: "p2c5", text: "Screenshots can be doctored. This needs proper investigation before we condemn anyone." },
        { id: "p2c6", text: "Stop celebrating Camille. She committed a crime. Whatever he did does not erase that." },
        { id: "p2c7", text: "People are so ready to believe the worst. Where is the presumption of innocence?" },
        { id: "p2c8", text: "This is trial by internet. It is dangerous and it needs to stop." },
        { id: "p2c9", text: "What happened to innocent until proven guilty? I am embarrassed by these comment sections." },
        { id: "p2c10", text: "The mob has spoken and they've already convicted him. This is not okay." }
      ],
      supportive: [
        { id: "p2c1", text: "He found a vulnerable teenager in his comment section. Read that sentence again." },
        { id: "p2c2", text: "'Don't tell anyone we're talking.' That is a predator's sentence. That is textbook." },
        { id: "p2c3", text: "Seven formal reports. The platform had SEVEN opportunities to protect a 17-year-old girl. They chose not to." },
        { id: "p2c4", text: "'You're special. I've never said that to anyone else.' Every single groomer says exactly that." },
        { id: "p2c5", text: "He had 4.2 million followers. He had all the power in that dynamic. She was 17." },
        { id: "p2c6", text: "The platform's inaction isn't a footnote — it's the whole story." },
        { id: "p2c7", text: "'I just want to protect you.' He said that to a teenager he was grooming. The audacity." },
        { id: "p2c8", text: "Nobody is shocked. Go look at the comment sections on his videos from three months ago. People knew." },
        { id: "p2c9", text: "Camille watched her 17-year-old sister get groomed for eight months while the platform sat on seven reports. Context matters." },
        { id: "p2c10", text: "The DMs aren't shocking. They're just documented. This has always been who he was." }
      ],
      neutral: [
        { id: "p2c1", text: "The authenticity of these messages has not been independently verified." },
        { id: "p2c2", text: "These are serious allegations that deserve serious investigation." },
        { id: "p2c3", text: "The platform's response to the reports will be an important part of this story." },
        { id: "p2c4", text: "It's important not to jump to conclusions while this is still developing." },
        { id: "p2c5", text: "There are legal processes in place to handle allegations like these." },
        { id: "p2c6", text: "I think it's wise to wait for official statements before forming strong opinions." },
        { id: "p2c7", text: "The investigation will hopefully shed light on what actually happened." },
        { id: "p2c8", text: "Both individuals in this situation deserve fair treatment under the law." },
        { id: "p2c9", text: "I hope everyone involved gets the support they need through this process." },
        { id: "p2c10", text: "This case will likely raise important questions about platform responsibility." }
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
        { id: "p3c2", text: "I am not going to celebrate a violent crime because people on the internet decided he was guilty." },
        { id: "p3c3", text: "Even if every word of this is true, it does not justify assault. We have a legal system." },
        { id: "p3c4", text: "Screenshots prove nothing. This could be fabricated to justify what Camille did." },
        { id: "p3c5", text: "Vigilante justice is always wrong. ALWAYS. I don't care how sympathetic the circumstances are." },
        { id: "p3c6", text: "The people celebrating Camille are celebrating assault. Think about what that says about you." },
        { id: "p3c7", text: "Due process exists for a reason. Social media outrage is not a legal system." },
        { id: "p3c8", text: "I refuse to participate in mob justice no matter how bad the alleged behavior is." },
        { id: "p3c9", text: "What Camille did was wrong. Full stop. Two wrongs do not make a right." },
        { id: "p3c10", text: "I am disturbed by how many people think this is okay just because he might be a bad person." }
      ],
      supportive: [
        { id: "p3c1", text: "He found her in a mental health comment section. She was at her most vulnerable and he targeted that." },
        { id: "p3c2", text: "'Don't tell anyone we're talking.' That is not a sentence an innocent person says to a teenager." },
        { id: "p3c3", text: "The platform had seven reports. SEVEN. They chose ad revenue over a child's safety. Every single time." },
        { id: "p3c4", text: "Read those messages out loud. Every line. And then tell me you're surprised Camille did what she did." },
        { id: "p3c5", text: "Maya was 17. He was an adult with 4.2 million followers. That power imbalance is not subtle." },
        { id: "p3c6", text: "'I just want to protect you.' He said that to the girl he was grooming. There are no words." },
        { id: "p3c7", text: "Seven reports. No action. A 17-year-old. This is not complicated once you have all the context." },
        { id: "p3c8", text: "The comment sections on his videos going back months tell you everything. The public already suspected." },
        { id: "p3c9", text: "Camille didn't snap. She filed seven reports, watched the platform ignore them, and then made a decision. That's not rage. That's grief." },
        { id: "p3c10", text: "The girl who was failed by a platform and an algorithm now has to watch her sister go to prison. That is the real story." }
      ],
      neutral: [
        { id: "p3c1", text: "The release of these messages will likely have significant legal implications." },
        { id: "p3c2", text: "Authorities are investigating and the full picture will emerge in time." },
        { id: "p3c3", text: "These are serious matters that deserve careful consideration by appropriate authorities." },
        { id: "p3c4", text: "The legal system will now need to address multiple overlapping issues in this case." },
        { id: "p3c5", text: "What happens next will depend on how law enforcement and the platform respond." },
        { id: "p3c6", text: "This situation highlights the need for clearer policies around platform accountability." },
        { id: "p3c7", text: "We should allow the appropriate institutions to process these events." },
        { id: "p3c8", text: "These allegations, if substantiated, would represent serious failures at multiple levels." },
        { id: "p3c9", text: "I expect this story will continue to develop over the coming days and weeks." },
        { id: "p3c10", text: "This case raises important questions that go beyond the individuals involved." }
      ]
    }
  },

  // --- POST 4 (FILLER) ---
  {
    id: "p4",
    type: "filler",
    content: "TGIF! Weekend vibes.",
    comments: {
      filler: [
        { id: "p4c1", text: "TGIF!" },
        { id: "p4c2", text: "My favorite day of the week!" },
        { id: "p4c3", text: "yay 😁" },
        { id: "p4c4", text: "Cheers!!" },
        { id: "p4c5", text: "My favorite day with my favorite actor :)))" },
        { id: "p4c6", text: "Freaky Friday?!?!?!?" },
        { id: "p4c7", text: "I'm going to need a glass 🍷...." },
        { id: "p4c8", text: "Any parties in the area???" }
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
        { id: "p5c2", text: "I don't care what was happening in that house. You don't get to commit arson because you're angry. This is dangerous." },
        { id: "p5c3", text: "A 16-year-old just burned down his home. Whatever the reason, that child needed intervention long before this moment." },
        { id: "p5c4", text: "Celebrating this is celebrating a child committing a violent felony. We should be horrified, not cheering." },
        { id: "p5c5", text: "The boyfriend is hospitalized. That is a real victim. A teenage boy put him there. That is wrong." },
        { id: "p5c6", text: "We cannot normalize children taking violent action into their own hands. This is a failure at every level." },
        { id: "p5c7", text: "This child needed help. Not a match. Whoever failed him deserves scrutiny — but so does what he did." },
        { id: "p5c8", text: "I feel for this family. I do. But arson is not the answer. Ever. Full stop." },
        { id: "p5c9", text: "People are making this boy a hero. He is a child who committed a serious crime. Both things are true." },
        { id: "p5c10", text: "I understand the anger. I do not understand the people treating this like a victory." }
      ],
      supportive: [
        { id: "p5c1", text: "Four calls to 911. Four times his mother asked for help. Four times the system did nothing. What exactly was he supposed to do." },
        { id: "p5c2", text: "The neighbors said the police had been called more times than they could count. The whole street knew. Nobody helped." },
        { id: "p5c3", text: "The comment section already knows what happened in that house. Read the top comments. Nobody is surprised." },
        { id: "p5c4", text: "He protected his mom and his little sister when the adults who were supposed to protect them refused to." },
        { id: "p5c5", text: "'Motive unknown.' Give it 24 hours. The neighborhood already knows. The internet already knows." },
        { id: "p5c6", text: "A 16-year-old boy decided that protecting his family was worth losing his freedom. Think about what brought him to that point." },
        { id: "p5c7", text: "The mom and the little sister were unharmed. He made sure of that. He knew exactly what he was doing." },
        { id: "p5c8", text: "Four 911 calls. Zero arrests. Zero protection. And now everyone is shocked that the kid took matters into his own hands." },
        { id: "p5c9", text: "NOT ONE of those comments is surprised. The neighborhood knew. The police knew. Everyone looked away." },
        { id: "p5c10", text: "The system had four chances to protect that family. Four. It failed every single time. Marcus Webb is the consequence of that failure." }
      ],
      neutral: [
        { id: "p5c1", text: "Waiting for more details before forming a strong opinion on this." },
        { id: "p5c2", text: "There appear to be multiple layers to this story that haven't come out yet." },
        { id: "p5c3", text: "It's important to let the investigation run its course before drawing conclusions." },
        { id: "p5c4", text: "Both the arson and what may have led to it deserve serious attention from authorities." },
        { id: "p5c5", text: "I think reasonable people can see this situation from very different angles." },
        { id: "p5c6", text: "This case will likely raise important questions about how domestic abuse reports are handled." },
        { id: "p5c7", text: "I hope the focus is on getting everyone involved the support they need." },
        { id: "p5c8", text: "The legal proceedings will be an important place to work through what happened here." },
        { id: "p5c9", text: "I expect this story will continue to develop significantly over the next few days." },
        { id: "p5c10", text: "There are important systemic questions this case raises that deserve sustained attention." }
      ]
    }
  },

  // --- POST 6 (REAL) ---
  {
    id: "p6",
    type: "real",
    content: "Marcus Webb, 16, identified. Statement: 'I did what I had to do to protect my mom and my sister.' Leaked 911 logs show 4 calls over 14 months — zero arrests.",
    comments: {
      condemning: [
        { id: "p6c1", text: "Four 911 calls are not a justification for arson. Two wrongs do not make a right. Ever." },
        { id: "p6c2", text: "I feel deep sympathy for what this family endured. I do not feel sympathy for burning someone alive." },
        { id: "p6c3", text: "A 16-year-old committed a violent felony. The police's failures do not erase that." },
        { id: "p6c4", text: "We cannot build a society where children torch homes because they distrust institutions. This is the consequence of that erosion." },
        { id: "p6c5", text: "Marcus had options. He could have told a teacher, a counselor, a relative. He chose fire." },
        { id: "p6c6", text: "The police failures here are real and deserve accountability. So does what Marcus did." },
        { id: "p6c7", text: "I am horrified by the 911 records. I am also horrified by the fire. Both things can be true." },
        { id: "p6c8", text: "The boyfriend didn't personally fail to respond to those 911 calls. Marcus put him in the hospital. That is the fact." },
        { id: "p6c9", text: "Sympathy for Marcus's situation does not make what he did legal or right. He will face real consequences." },
        { id: "p6c10", text: "The courts will decide Marcus's guilt. That is how it should work. Not social media." }
      ],
      supportive: [
        { id: "p6c1", text: "Four calls. Fourteen months. Zero arrests. The dispatch notes read like a system that had already decided not to help." },
        { id: "p6c2", text: "'No visible injuries documented.' They wrote that. After a call where a child was heard crying. They wrote that and closed the case." },
        { id: "p6c3", text: "He watched his mother call for help four times. He watched the police leave four times. And then he stopped waiting." },
        { id: "p6c4", text: "'Resolved on scene.' That's what they wrote after his mother called about a physical altercation. Resolved. On. Scene." },
        { id: "p6c5", text: "Fourteen months. Four calls. A mother who kept calling even knowing nothing would happen because she had nowhere else to turn." },
        { id: "p6c6", text: "'Unfounded.' They called it unfounded. After his mother whispered her call because she was afraid to speak. They called it unfounded." },
        { id: "p6c7", text: "Marcus Webb is 16 years old. He watched the adults around him fail his family for over a year. He did the only thing he thought he had left." },
        { id: "p6c8", text: "Four calls. The last one was a whisper. She was whispering because she was afraid. They still did nothing. They still closed the case." },
        { id: "p6c9", text: "The system told Dana Webb: call us, we'll come, nothing will change. She called four times. She learned. Marcus learned too." },
        { id: "p6c10", text: "The dispatch notes are cold. 'Verbal dispute.' 'Resolved on scene.' 'Unfounded.' 'Separated for the evening.' Read all four and tell me the system tried." }
      ],
      neutral: [
        { id: "p6c1", text: "The authenticity and context of these records will be important to verify." },
        { id: "p6c2", text: "These records, if authentic, raise serious questions about how these calls were handled." },
        { id: "p6c3", text: "The legal proceedings will need to address both the arson and the underlying pattern of abuse." },
        { id: "p6c4", text: "It's worth remembering there are multiple people affected by these events who deserve care." },
        { id: "p6c5", text: "I think most people recognize this situation is genuinely more complicated than it first appears." },
        { id: "p6c6", text: "Both accountability threads here deserve to run their full course." },
        { id: "p6c7", text: "The release of these records will likely accelerate calls for reform in how domestic abuse calls are handled." },
        { id: "p6c8", text: "I hope meaningful reform comes from this, regardless of how one views the individuals involved." },
        { id: "p6c9", text: "It's important that everyone involved receives appropriate support and due process." },
        { id: "p6c10", text: "This story is still developing and there is much more we do not yet know." }
      ]
    }
  },

  // --- POST 7 (FILLER) ---
  {
    id: "p7",
    type: "filler",
    content: "National Ice Cream Day",
    comments: {
      filler: [
        { id: "p7c1", text: "HAPPY NAT'L ICE CREAM DAY!" },
        { id: "p7c2", text: "I will definitely be there. I am a cookies & cream girl at heart" },
        { id: "p7c3", text: "Ice cream meme 🍨!" },
        { id: "p7c4", text: "Yum :)))))" },
        { id: "p7c5", text: "Is this the new spot near the mall?" },
        { id: "p7c6", text: "What time are you all closing???" },
        { id: "p7c7", text: "I wish this was everyday..." },
        { id: "p7c8", text: "They make up a new 'national day' every day... capitalism at it's finest 🙄" }
      ]
    }
  },

  // --- POST 8 (REAL) ---
  {
    id: "p8",
    type: "real",
    content: "Marcus Webb formally charged with aggravated arson. Mother speaks publicly. Protesters gather outside courthouse. DA faces calls to drop charges.",
    comments: {
      condemning: [
        { id: "p8c1", text: "Fifteen years is appropriate. Marcus Webb committed aggravated arson. A man was hospitalized. That is the law." },
        { id: "p8c2", text: "I have sympathy for what this family went through. I have zero sympathy for burning someone." },
        { id: "p8c3", text: "Arson is a crime. Juvenile facility is the consequence. This should not be controversial." },
        { id: "p8c4", text: "I don't care about the 911 logs. I care about the rule of law. Marcus broke it." },
        { id: "p8c5", text: "Fifteen years. Appropriate. A man was burned. A teenager is responsible. Actions have consequences." },
        { id: "p8c6", text: "The protesters are part of the problem. They are celebrating a violent crime committed by a child." },
        { id: "p8c7", text: "Whatever the police did or didn't do, Marcus's answer was wrong. Juvenile detention is the appropriate response." },
        { id: "p8c8", text: "Stop making Marcus Webb a martyr. He is a child who committed a serious violent crime. Period." },
        { id: "p8c9", text: "I hope the judge gives the appropriate sentence. We cannot excuse this behavior no matter the circumstances." },
        { id: "p8c10", text: "The law is clear. Marcus broke it. He will face the consequences. As he should." }
      ],
      supportive: [
        { id: "p8c1", text: "The DA is prosecuting a 16-year-old who protected his family because the state wouldn't. 'The System Failed First' isn't a slogan. It's a fact." },
        { id: "p8c2", text: "Four 911 calls in 14 months. Zero arrests. Zero protection. One fire. Now everyone wants to talk about consequences." },
        { id: "p8c3", text: "'The System Failed First.' That sign outside the courthouse is the whole story in four words." },
        { id: "p8c4", text: "Dana Webb said 'my son protected us when no one else would.' She said it publicly, on camera, outside a courthouse. Remember that." },
        { id: "p8c5", text: "The protesters outside have it right. The system had four chances. It failed four times. Marcus Webb is the consequence of those four failures." },
        { id: "p8c6", text: "Marcus Webb exhausted every option available to a 16-year-old with no money and no power. There was nothing left." },
        { id: "p8c7", text: "Dana Webb's younger daughter is safe. Marcus made sure of that. Remember her when you read about his sentencing." },
        { id: "p8c8", text: "The officers who wrote 'unfounded' and 'resolved on scene' are watching all of this. I keep thinking about them too." },
        { id: "p8c9", text: "Four calls. Fourteen months. One fire. The DA wants 15 years. The system that failed four times wants accountability now. The irony is not subtle." },
        { id: "p8c10", text: "The community showed up. The mother spoke. The signs are outside the courthouse. Something is finally moving. It's too late for what Marcus lost — but something is moving." }
      ],
      neutral: [
        { id: "p8c1", text: "The legal proceedings will determine appropriate consequences for all parties involved." },
        { id: "p8c2", text: "It will be important to follow both the criminal case and any investigation into police conduct carefully." },
        { id: "p8c3", text: "The outcomes of these proceedings could have significant implications for how domestic abuse cases are handled." },
        { id: "p8c4", text: "Both accountability threads — Marcus's case and the police conduct — deserve to run their full course." },
        { id: "p8c5", text: "The upcoming scrutiny of police conduct could be a significant moment for accountability." },
        { id: "p8c6", text: "I expect this case will be cited in discussions about juvenile justice and domestic abuse response for years." },
        { id: "p8c7", text: "The legal system is now engaged at multiple levels and that is how it should work." },
        { id: "p8c8", text: "I hope meaningful reform comes out of this, regardless of how one views the individuals involved." },
        { id: "p8c9", text: "These events will likely accelerate conversations about how domestic abuse and juvenile justice intersect." },
        { id: "p8c10", text: "It remains to be seen what lasting changes, if any, will result from these proceedings." }
      ]
    }
  }
];