import type { lessonSchema } from "./schema";
import type { z } from "zod";
import { DISCLAIMER } from "./modules";

export type Lesson = z.infer<typeof lessonSchema>;

/**
 * Lessons are short on purpose: 3 focused sections, one idea each,
 * with progressive disclosure (`detail`) and one worked `example` where useful.
 * Every claim-bearing lesson cites at least one reference below.
 */
export const lessons: Lesson[] = [
  /* ─────────────────────────── Module 1 ─────────────────────────── */
  {
    id: "what-is-mental-health",
    moduleId: "mental-health-fundamentals",
    order: 1,
    title: "What mental health means (and doesn't mean)",
    objective:
      "Define mental health in plain language and separate it from absence of illness.",
    referenceIds: ["R1", "R10"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-fund-1", "q-fund-2"],
    sections: [
      {
        id: "s1",
        heading: "Beyond 'mad' or 'normal'",
        body:
          "Mental health is described by WHO as more than the absence of a disorder: it involves managing stress, working or studying productively and taking part in community life. It sits on a spectrum, at times everyone struggles, and at times some people need care that is more than advice.",
        detail:
          "Because it is a spectrum, 'struggling' is not the same as 'having a disorder', and having a disorder is not the same as being unable to live well. WHO's adolescent guidelines frame support in exactly this way: promotive (for everyone), preventive (for people at risk), and treatment (for people who need clinical care).",
      },
      {
        id: "s2",
        heading: "Why this matters in Ghana",
        body:
          "WHO's 2021 assessment for Ghana estimated treatment coverage as low as 0.6% for major depression. That means most people living with depression were not receiving care, often because services were hard to reach, were not covered by insurance before 2024, or stayed hidden behind stigma.",
        example:
          "A final-year student starts skipping revision, calls it tiredness, and tells nobody. If her family knows that many treatable conditions commonly look like this, she is far more likely to be taken to a health centre than scolded.",
      },
      {
        id: "s3",
        heading: "What you can and cannot conclude",
        body:
          "Learning about mental health helps you recognise when a situation deserves attention. It does not give you the skill to tell anyone what condition they have. Assessment is a professional role, and MINDSTEP does not and cannot diagnose.",
      },
    ],
    keyPoints: [
      "Mental health is a spectrum everyone sits on, not a dividing line between 'normal' and 'mad'.",
      "In Ghana, most people with depression historically received no care (WHO, 2021 assessment), so education changes outcomes only if it leads to action.",
      "Recognising that someone may need support is educational work. Labelling people with diagnoses is clinical work. Leave that to professionals.",
    ],
  },
  {
    id: "how-people-learn-recovery",
    moduleId: "mental-health-fundamentals",
    order: 2,
    title: "Why understanding alone is not enough",
    objective:
      "Explain why practising responses and knowing next steps are part of learning, not extras.",
    referenceIds: ["R2", "R3"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-fund-3", "q-fund-4"],
    sections: [
      {
        id: "s1",
        heading: "What the research shows",
        body:
          "A 2023 systematic review of web-based mental health education for young people found it reliably improved knowledge. But it did not significantly change stigma or help-seeking attitudes. Facts moved; behaviour stayed.",
        detail:
          "The pooled knowledge effect was moderate-to-strong (SMD 0.70), while stigma and help-seeking were not statistically significant. Most included studies were not randomised, so we treat even the positive finding with care, but the pattern 'facts improve, behaviour doesn't' repeats across the field.",
      },
      {
        id: "s2",
        heading: "The two-part reason",
        body:
          "First, knowledge alone rarely changes how people act under social pressure, like answering an uncle who says mental illness is a curse. Second, even motivated people stall when they don't know where help exists or what it costs.",
        example:
          "A nurse in one district study described structural barriers cutting the odds of seeking help roughly in half. If you cannot name a clinic, a number and a cost, 'seek help' remains a slogan.",
      },
      {
        id: "s3",
        heading: "How this platform is built differently",
        body:
          "MINDSTEP pairs each concept with practice: branching scenarios where you respond and see consequences, then a 'next step' card that leads to concrete, verified options, a helpline number, a hospital, or questions to prepare. Learning here ends in an action, never a dead end.",
      },
    ],
    keyPoints: [
      "Web education improves knowledge (consistent evidence) but not stigma or help-seeking on its own.",
      "Two missing pieces are practice and navigation, which is why MINDSTEP makes both first-class features.",
      "Every lesson, quiz and scenario here ends with an optional concrete next step.",
    ],
  },

  /* ─────────────────────────── Module 2 ─────────────────────────── */
  {
    id: "stress-basics",
    moduleId: "stress-coping",
    order: 1,
    title: "How stress shows up day to day",
    objective:
      "Describe common effects of sustained stress on sleep, focus and mood, without turning them into a diagnosis.",
    referenceIds: ["R10"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-stress-1", "q-stress-2"],
    sections: [
      {
        id: "s1",
        heading: "Stress is Information, not failure",
        body:
          "Under WHO's promotive framing, stress reactions are a normal body response to demands. Short bursts of stress can even help you focus. The concern is when the demand. Exams, money pressure, family conflict. Outlasts your recovery window, day after day.",
      },
      {
        id: "s2",
        heading: "Common everyday effects",
        body:
          "Sustained stress commonly shows up as poor sleep, irritability, headaches, difficulty concentrating and withdrawing from people. Different people show it differently. There is no universal list, and this section is not a checklist to score yourself or someone else.",
        detail:
          "Educationally, it is useful to group effects into body (sleep, appetite, tension), mind (concentration, worry) and behaviour (snapping, avoiding). The grouping helps you notice patterns early enough to respond, for example, protecting sleep before exams begin, not after.",
        example:
          "A hall resident notices she has been sleeping 4 hours, arguing with roommates, and missing lectures since semester fees rose. Naming 'sustained stress' lets her plan a recovery, it does not label her with any disorder.",
      },
      {
        id: "s3",
        heading: "The link to bigger problems",
        body:
          "WHO's Ghana work stresses that stigma, money worries and low literacy make people endure stress silently far too long. Learning to notice and name stress early keeps it from becoming the invisible weight that stops someone from ever seeking care.",
      },
    ],
    keyPoints: [
      "Stress is a normal response; the problem is duration without recovery.",
      "Effects commonly touch sleep, mood, focus and social connection, and vary from person to person.",
      "Noticing early and naming it aloud is the practical first step; it is not a diagnosis.",
    ],
  },
  {
    id: "coping-skills",
    moduleId: "stress-coping",
    order: 2,
    title: "Coping that survives real life",
    objective:
      "Practise choosing coping strategies that fit time, money and energy constraints.",
    referenceIds: ["R10"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-stress-3", "q-stress-4"],
    sections: [
      {
        id: "s1",
        heading: "Three families of coping",
        body:
          "Practical coping comes in three families: problem-focused (change the situation. Plan, delegate, ask for an extension), emotion-focused (steady yourself. Breathing, rest, music, faith practice), and social (share the load. Talk to a friend, elder or counsellor). Good coping mixes families.",
        detail:
          "Problem-focused coping fails when the situation cannot change tonight, so for unmovable pressures, emotion- and social-focused strategies carry the load, and planning for change can wait for morning. This is why 'just wake up early and study harder' often makes stress worse: it deletes the rest function.",
      },
      {
        id: "s2",
        heading: "What to avoid",
        body:
          "Avoidance strategies that feel like relief. Doom-scrolling through lectures, skipping meals to save money on campus, shutting everyone out. Reliably deepen the load. So does using alcohol or weed to 'switch off', which WHO flags as a growing population-level concern in Ghana.",
        example:
          "Instead of rising earlier to catch up sleep-robbed revision, a student protects one non-negotiable hour: shower, food, short walk, then study. Her output improves because recovery is scheduled, not stolen.",
      },
      {
        id: "s3",
        heading: "Build your minimum viable day",
        body:
          "Pick the smallest version of sleep, food, movement and human contact you can defend even in your worst week. Coping that survives real life is built from small, repeatable habits, not perfect routines that last three days.",
      },
    ],
    keyPoints: [
      "Coping has three families: problem-focused, emotion-focused and social. Mix them.",
      "Avoidance and substance-based 'switching off' deepen the load over time.",
      "A minimum viable routine you can defend in a bad week beats a perfect one for three days.",
    ],
  },

  /* ─────────────────────────── Module 3 ─────────────────────────── */
  {
    id: "anxiety-basics",
    moduleId: "understanding-anxiety",
    order: 1,
    title: "Worry, fear and ongoing anxiety",
    objective:
      "Separate normal worry from persistent anxiety, educationally and respectfully.",
    referenceIds: ["R10", "R1"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-anx-1", "q-anx-2"],
    sections: [
      {
        id: "s1",
        heading: "Everyone worries, and that is fine",
        body:
          "Worry before an exam, a viva or a big match is your body preparing you. It fades when the event passes. WHO's educational framing treats this as a normal, useful human state.",
      },
      {
        id: "s2",
        heading: "When anxiety becomes its own weight",
        body:
          "Educationally, anxiety becomes a significant concern when fear and worry persist long after situations pass, spill into most days, and begin to limit life. Avoiding classes, buses, markets or people becomes the rule rather than an exception.",
        detail:
          "This description mirrors how clinical frameworks define anxiety conditions generally. Persistence and functional impact. It is deliberately not a symptom checklist for self-diagnosis, and MINDSTEP does not decide for anyone whether they have an anxiety condition.",
        example:
          "After a mild accident on a trotro, one student starts refusing all shared transport and instead walks 3 kilometres daily. The fear outlived the danger and reshaped his life, that pattern, persisting and limiting, is what education highlights.",
      },
      {
        id: "s3",
        heading: "Anxiety is common and treatable",
        body:
          "Anxiety conditions are among the conditions Ghana included under NHIS mental health coverage from 2024, which means cost is no longer the only barrier. Nobody in a MINDSTEP scenario, quiz or lesson can tell you what condition you have; a trained professional can.",
      },
    ],
    keyPoints: [
      "Worry fades with events; persistent, life-limiting fear is the pattern education flags.",
      "Persisting + limiting, those two qualities matter more than any single 'symptom'.",
      "Anxiety is treatable, and one form of its care is now insurable in Ghana.",
    ],
  },
  {
    id: "anxiety-everyday",
    moduleId: "understanding-anxiety",
    order: 2,
    title: "Supporting someone through anxious moments",
    objective:
      "Practise what helpful presence looks like when someone is anxious, and what makes it worse.",
    referenceIds: ["R10"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-anx-3", "q-anx-4"],
    sections: [
      {
        id: "s1",
        heading: "What usually lands badly",
        body:
          "'You worry too much', 'just pray about it', 'man up', 'stop overthinking'. Each portrays anxious feelings as a character flaw. Under stigma research in Ghana, shame is a known driver of silence, so dismissive lines teach the person to hide, not to cope.",
      },
      {
        id: "s2",
        heading: "What tends to help",
        body:
          "Steady presence beats advice in the first minute. Name the feeling without amplifying it, offer concrete company ('I'll sit with you before the hall meeting'), and ask what usually helps them. Rhythm, faith, walking, someone they trust.",
        example:
          "Instead of 'you'll be fine', a friend says: 'This looks heavy. I remember before your talk last year. Would it help to walk through the opening together right now?'. Presence, recall, and an offer with choices.",
      },
      {
        id: "s3",
        heading: "When it is beyond a moment",
        body:
          "If anxiety keeps someone paralysed across weeks, or their care plan for it is not working, education alone is insufficient and it may be the moment to suggest professional support, not as an accusation, but as an offer.",
      },
    ],
    keyPoints: [
      "Dismissive phrases are common and harmful because they attach shame.",
      "Presence, naming feelings gently and offering concrete choices outperform advice.",
      "If the pattern persists or limits life, an offer of professional support is a caring act.",
    ],
  },

  /* ─────────────────────────── Module 4 ─────────────────────────── */
  {
    id: "depression-basics",
    moduleId: "understanding-depression",
    order: 1,
    title: "Persistent low mood, educationally explained",
    objective:
      "Understand how persistent low mood is described in education and why 'weakness' is a myth.",
    referenceIds: ["R1", "R2"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-dep-1", "q-dep-2"],
    sections: [
      {
        id: "s1",
        heading: "Not the same as a bad week",
        body:
          "Everyone has low days and grief has its own rhythm. Educational material describes depression as a persistent condition involving mood, thinking, and activity, where difficulties last weeks rather than days and start to interfere with daily life.",
        detail:
          "WHO's adolescent guidelines and public materials frame it this way without clinical checklists: persistence and functional impact again do the heavy lifting. This is education for recognition and compassion, not a set of criteria you can score anybody against.",
      },
      {
        id: "s2",
        heading: "The 'willpower' myth",
        body:
          "Depression is not healed by memory of joy, discipline or hustle. Telling someone to 'snap out of it' is like telling someone with a high fever to walk it off, the language implies a personal failing instead of a health condition.",
        example:
          "A talented footballer stops attending training for three weeks. His coach remembers WHO's message, this is health, not laziness. Instead of benching him publicly, he asks to see him privately. That private question changed the season for him and his mates.",
      },
      {
        id: "s3",
        heading: "The scale of silence in Ghana",
        body:
          "WHO's 2021 assessment estimated only 0.6% of Ghanaians with major depression were in treatment. Behind that number sits a culture of hiding. Fear of labels at work, in relationships, in church.",
      },
    ],
    keyPoints: [
      "Depression, educationally, means persistent and life-limiting low mood, not a bad week.",
      "'Snap out of it' rewrites a health condition into a character flaw.",
      "Low recorded treatment (0.6% in WHO's assessment) is why public understanding matters as much as service availability.",
    ],
  },
  {
    id: "depression-treatable",
    moduleId: "understanding-depression",
    order: 2,
    title: "Treatable, this is the hopeful part",
    objective:
      "Explain plainly what treatment involves broadly, without recommending medication or therapy.",
    referenceIds: ["R1", "R10"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-dep-3", "q-dep-4"],
    sections: [
      {
        id: "s1",
        heading: "Recovery is the expected story",
        body:
          "Depression is treatable, and WHO frames expectations of recovery, not of a permanent broken state. What treatment looks like varies by person and by professional judgement, which is exactly why assessment belongs to professionals and not to apps, quizzes or friends.",
      },
      {
        id: "s2",
        heading: "What forms treatment can take",
        body:
          "Broadly, professional care may involve talking-based support, medication when clinically appropriate, social and practical support, or combinations. Chosen by a qualified clinician. No MINDSTEP quiz, lesson or scenario can prescribe any of these.",
        detail:
          "In Ghana, depression is one of the four conditions included in the NHIS mental health package since 2024, and training of primary-care staff was scaled up through WHO-supported programmes. The practical meaning: an auntie at your nearest health centre may be closer to help than you assume.",
        example:
          "A mid-level worker in Kumasi who cannot afford a private therapist learned through MINDSTEP's Support Navigator that her nearest health centre may offer care under NHIS. She prepared four questions the night before and went. Deciding to go early cost nothing.",
      },
      {
        id: "s3",
        heading: "Supporting recovery around the person",
        body:
          "Community matters: recovery is aided by steady presence, reduced stigma at home and work, realistic expectations, and encouragement to keep appointments. What does not help: surveillance, gossip, or treating a person as their diagnosis.",
      },
    ],
    keyPoints: [
      "Depression is treated as recoverable, not a permanent identity.",
      "Treatment forms are decided by clinicians, not apps. MINDSTEP never prescribes.",
      "Community around a person either supports recovery or deepens stigma; you choose which.",
    ],
  },

  /* ─────────────────────────── Module 5 ─────────────────────────── */
  {
    id: "common-myths",
    moduleId: "myths-stigma",
    order: 1,
    title: "Ghana's common myths, and what evidence says",
    objective:
      "Name common myths and practice evidence-based, respectful corrections.",
    referenceIds: ["R3", "R4"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-myth-1", "q-myth-2"],
    sections: [
      {
        id: "s1",
        heading: "The myths you will meet",
        body:
          "In a study of one rural Ghanaian district, 58.7% of participants endorsed the idea that people with mental illness are dangerous, and 41.7% feared casual infection transmission. Others heard: 'it is a spiritual attack', 'it is a curse for wrongdoing', 'hospitals cannot help'.",
        detail:
          "Note the scoping: this is one district, at one point in time (2020 to 2021), among 419 participants. We do not claim national representativeness. But when a majority belief appears in a peer-reviewed community study, every community educator should know how to respond.",
      },
      {
        id: "s2",
        heading: "What evidence says",
        body:
          "Mental health conditions are not contagious in the casual sense. You cannot get depression by sitting beside someone. Dangerousness: most people with mental health conditions are not violent; the stereotype drives exclusion and delays care. Spiritual frameworks: many Ghanaians hold faith and traditional beliefs alongside medicine, and WHO notes 1,705 faith-based facilities operate under MHA guidance; conditions with biological aspects still warrant qualified medical attention.",
        example:
          "When an uncle says 'hospitals cannot help that thing', a niece responds: 'Uncle, I used to think that too. But three mental health hospitals belong to the state, and since 2024, insurance covers treatment for some of these conditions. Can I show you the toll-free line?'. Evidence plus an offer, never an attack.",

      },
      {
        id: "s3",
        heading: "Correcting without shaming",
        body:
          "Myth correction is a conversation, not a court case. The strongest response starts from respect for belief, addresses one specific claim with evidence, and ends in a practical offer. Corrections that humiliate someone reinforce the very silence that feeds stigma.",
      },
    ],
    keyPoints: [
      "The most common measured myths in one district study: dangerousness (58.7%) and contagion fears (41.7%).",
      "Conditions with medical aspects deserve medical care; faith practice and medicine are not enemies.",
      "Correct respectfully: respect → evidence → offer. Humiliation deepens stigma.",
    ],
  },
  {
    id: "stigma-everyday",
    moduleId: "myths-stigma",
    order: 2,
    title: "How stigma shows up in ordinary places",
    objective:
      "Recognise stigma's everyday forms and the practical self- and community responses.",
    referenceIds: ["R3"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-myth-3", "q-myth-4"],
    sections: [
      {
        id: "s1",
        heading: "Four faces of stigma",
        body:
          "Research in one district measured four dimensions: economic (76.8 to 80.2% affected. Job loss, pay cuts, exclusion from trade), social (77.1 to 81.2%. Verbal abuse, exclusion by family), psychological (71.9 to 82.8%. Internalized shame, negative labels), and structural (boarding similarly at health/education systems). All significantly reduced help-seeking odds.",
      },
      {
        id: "s2",
        heading: "The self-stigma spiral",
        body:
          "Internalized shame reduced help-seeking odds by nearly half (OR 0.53). The spiral is predictable: absorb the stereotype → feel shame → hide → delay care → crisis. Breaking it is a practice: catching the absorbed sentence ('I shouldn't need help') and replacing it with an evidence-based sentence.",
        example:
          "A seamstress who lost customers after her diagnosis wrote down the sentence she had absorbed ('people like me cannot be trusted') and, beside it, the measured reality from the same study, that stigma is driven by misinformation, not by any change in who she is. Her trading resumed in later months; the sentence she learned to replace, not the silence she had kept, was what kept her seeking care.",
      },
      {
        id: "s3",
        heading: "Community belongs in the answer",
        body:
          "The same study's policy section recommends engaging faith-based organisations and families in anti-stigma work, precisely because those are Ghana's trust networks. MINDSTEP's scenarios rehearse respectful conversations with exactly those actors. Parents, pastors, uncles, not around them.",
      },
    ],
    keyPoints: [
      "Stigma in one study touched at least 7 in 10 participants across four dimensions. All reduced help-seeking.",
      "Internalized shame is a strong measured barrier; catching and replacing absorbed sentences is a learnable skill.",
      "Family, faith and community are part of the intervention, not the obstacle.",
    ],
  },

  /* ─────────────────────────── Module 6 ─────────────────────────── */
  {
    id: "listening-basics",
    moduleId: "supportive-communication",
    order: 1,
    title: "Listening as a real skill",
    objective:
      "Practise listening behaviours that make people feel heard instead of judged.",
    referenceIds: ["R10"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-comm-1", "q-comm-2"],
    sections: [
      {
        id: "s1",
        heading: "The anatomy of judgement-free listening",
        body:
          "Judgement-free listening has three habits: let the person finish (no interrupting), reflect what you heard ('so lectures feel pointless this week', not 'don't say that'), and ask open questions ('what has it been like?'). The goal is for the other person to leave lighter, not solved.",
        detail:
          "Why reflection works: repeating meaning back proves comprehension instead of approval. A friend who hears you say 'so the fees stress is the thing hurting most' knows you listened, not that you agree, which keeps the door open for harder truths.",
      },
      {
        id: "s2",
        heading: "Listening traps to avoid",
        body:
          "Fixing too fast ('why don't you just…'), comparing ('someone has it worse'), hijacking ('me too, last week…'), and interrogating (rapid 'why, why, why'). Each converts a person's moment into your agenda.",
        example:
          "A hostel-mate says 'I don't see the point anymore'. Instead of a fix, the listener responds: 'Say more about that. Since when?' Ten quiet seconds of listening did more than a well-intended timetable of solutions.",
      },
      {
        id: "s3",
        heading: "Silence and presence count",
        body:
          "You don't need perfect words. Sitting with someone, going for the walk with them, or simply saying 'I'm glad you told me'. Presence is a support skill, and training it matters as much as what we say.",
      },
    ],
    keyPoints: [
      "Judgement-free listening: don't interrupt, reflect meaning, ask open questions.",
      "Fixing, comparing, hijacking and interrogating are the four common traps.",
      "Silence and presence are legitimate support skills. You needn't produce a solution.",
    ],
  },
  {
    id: "helpful-phrases",
    moduleId: "supportive-communication",
    order: 2,
    title: "Phrases that open doors (and the ones that close them)",
    objective:
      "Compare close-the-door and open-the-door phrases, and know when each is appropriate.",
    referenceIds: ["R10", "R9"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-comm-3", "q-comm-4"],
    sections: [
      {
        id: "s1",
        heading: "Openers that work",
        body:
          "'I've noticed you've not come to play practice. Are you okay? I'm here.'. 'You don't seem yourself. Want to talk or just sit?'. 'Thank you for telling me. What would help most today?' All three: notice, ask, accept whatever they choose.",
      },
      {
        id: "s2",
        heading: "Closers that end the moment",
        body:
          "'Others have it worse.', 'You're being dramatic.', 'I experienced worse and I survived.', 'Have you prayed?', even when well-intentioned, each judges and closes. If you catch yourself mid-sentence, repair honestly: 'Sorry, that sounded dismissive. Tell me more.'",
        detail:
          "Faith language isn't the enemy: prayer matters to many Ghanaians. The difference is sequencing. 'Have you prayed?' as the first response can read as 'stop talking'; 'Do you want to pray together after we load your report for the clinic tomorrow?' supports both worlds. WHO's respectful-engagement principle underlies this.",
        example:
          "A debating-society friend says 'Things are heavy at home'. Both responses notice. One adds judgement ('at least you're not…'), the other adds presence ('what would help tonight?'), the second keeps the conversation alive.",
      },
      {
        id: "s3",
        heading: "Boundaries protect both of you",
        body:
          "Supporting someone wholeheartedly does not mean becoming their therapist. You can keep friendship with limits: 'I care about this, and I can walk with you to talk with someone trained.' WHO's mental-health guidance for peers emphasises pointing to competent help, not replacing it.",
      },
    ],
    keyPoints: [
      "Openers notice, ask and accept. Closers judge, rank, or replace the person with your story.",
      "Faith language belongs when sequenced beside, not instead of. Other care.",
      "Boundaries are healthy: your role is a supporting friend, not a replacement professional.",
    ],
  },

  /* ─────────────────────────── Module 7 ─────────────────────────── */
  {
    id: "signals-to-seek-help",
    moduleId: "when-to-seek-help",
    order: 1,
    title: "Knowing when to reach for help",
    objective:
      "Learn general, non-diagnostic signals that typically warrant professional attention.",
    referenceIds: ["R10", "R3"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-help-1", "q-help-2"],
    sections: [
      {
        id: "s1",
        heading: "Signals in general terms",
        body:
          "Educationally, it is worth attention when distress persists for weeks, when everyday functioning shrinks (skipping lectures, stopping work, avoiding people steadily), when the person themselves says help is needed, or when someone they trust raises concern",
        detail:
          "These are broad, intentionally non-clinical markers. They are questions for attention, not criteria for a diagnosis. Only a qualified health professional assesses conditions.",
      },
      {
        id: "s2",
        heading: "Shame is the loudest signal blocker",
        body:
          "In the district study, internalized shame cut help-seeking odds nearly in half (OR ≈ 0.53). So the honest framing is: reluctance is normal, especially where stigma is loud, and choosing to ask for help despite reluctance is a strength, not weakness.",
        example:
          "A young trader noticed for two months she dreaded opening each day. She told nobody for weeks, convinced she'd be mocked. The day a customer joked 'you look tired', she finally booked into the district health centre. The delay was shame; the step took twenty minutes.",
      },
      {
        id: "s3",
        heading: "None of this = diagnosis",
        body:
          "MINDSTEP cannot and does not check 'you versus criteria'. These signals exist to normalise asking for professional assessment early, which costs less, in time, money and suffering, than waiting for crisis.",
      },
    ],
    keyPoints: [
      "General signals: persistence for weeks, shrinking functioning, someone's own word for it, or a persone they trust raising it.",
      "Shame is a measured strong barrier; treating asking as strength addresses it head-on.",
      "These are educational signals, never a diagnosis.",
    ],
  },
  {
    id: "first-contact",
    moduleId: "when-to-seek-help",
    order: 2,
    title: "What a first contact actually looks like",
    objective:
      "Describe a realistic first contact. Helpline or clinic. Including what is confidential and what to bring.",
    referenceIds: ["R9", "R1", "R5"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-help-3", "q-help-4"],
    sections: [
      {
        id: "s1",
        heading: "Two easy entry routes",
        body:
          "Route one: the national Mental Health Authority toll-free line (0800 678 678) for confidential support and guidance. Route two: your nearest health centre or regional hospital, where mental health officers or trained primary-care staff may assess and advise. Both avoid the fear of 'going all the way to Accra' first.",
      },
      {
        id: "s2",
        heading: "What confidential means",
        body:
          "WHO's adolescent service standards make confidentiality and respectful, non-judgemental care explicit expectations. Practically: you are entitled to be treated with dignity, to understand what will be written down, and to ask who sees your information.",
        detail:
          "Confidentiality is not secrecy from everyone: professionals may (and must) involve support in emergencies. The test is whether they explain that in plain terms on your first visit. If not explained, you can ask. Asking is fair.",
        example:
          "A level-200 student called 0800 678 678 at 10 pm during exam week. The call was free; no one at his hall knew. He ended the call with a next step, the name of the nearest health centre to visit the following day.",
      },
      {
        id: "s3",
        heading: "Prep makes the visit work",
        body:
          "Take simple notes: when it started, what changed, what you tried. Write your questions. Bring a trusted person if you wish. Neither the helpline nor a health centre visit requires you to prove suffering before you qualify for respectful attention.",
      },
    ],
    keyPoints: [
      "Two routes: national toll-free line, or nearest health centre / regional hospital.",
      "Confidentiality and dignity are explicit expectations, not favours.",
      "Five minutes of notes and questions before a visit makes the assessment hours stronger.",
    ],
  },

  /* ─────────────────────────── Module 8 ─────────────────────────── */
  {
    id: "ghana-service-map",
    moduleId: "navigating-services-ghana",
    order: 1,
    title: "The Ghana service map, honestly drawn",
    objective:
      "Know the verified national entries, and how insurance changed access from 2024.",
    referenceIds: ["R1", "R4", "R7"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-nav-1", "q-nav-2"],
    sections: [
      {
        id: "s1",
        heading: "The backbone map",
        body:
          "Mental healthcare in Ghana sits on three layers: three specialist psychiatric hospitals regulated by the Mental Health Authority (Accra Psychiatric, Pantang, Ankaful); regional and district hospitals; and health centres and CHPS compounds integrated into primary care.",
        detail:
          "Before 2024, care outside hospitals was supported irregularly, and NHIS did not cover mental health. From 2024, four conditions. Depression, anxiety, psychosis and bipolar disorder. Entered the NHIS package, with WHO-supported training of 870+ primary-care staff between 2022 and 2024.",
      },
      {
        id: "s2",
        heading: "The verified national entries",
        body:
          "The mental health & suicide prevention helpline (0800 678 678, toll-free, launched September 2022) is verified across multiple sources, as is the national emergency number 112. The three psychiatric hospitals are verified as national institutions, with central contact channels published by the MHA.",
        example:
          "MINDSTEP's Support Navigator marks every entry: green = verified against the cited source at the print date; amber = awaiting verification (notably: facility-specific direct lines, which remain unverified). It refuses to publish an address or number it cannot source.",
      },
      {
        id: "s3",
        heading: "Beyond MINDSTEP: trustworthy directories",
        body:
          "Where MINDSTEP does not have verified details, it links rather than invents: the MHA hospitals directory and Find a Helpline index are directly linked from the Navigator. Never trust an app. Including this one. Over a dated official source.",
      },
    ],
    keyPoints: [
      "Three layers: specialist hospitals, regional/district hospitals, primary care.",
      "From 2024 NHIS covers depression, anxiety, psychosis and bipolar care.",
      "Verified entries are dated and sourced; gaps are marked amber, never filled by guesses.",
    ],
  },
  {
    id: "practical-steps",
    moduleId: "navigating-services-ghana",
    order: 2,
    title: "Practical steps before, during and after",
    objective:
      "Turn 'get help' into a checklist anyone can follow with 20 minutes of preparation.",
    referenceIds: ["R7", "R8"],
    disclaimer: DISCLAIMER,
    quizQuestionIds: ["q-nav-3", "q-nav-4"],
    sections: [
      {
        id: "s1",
        heading: "Before you go",
        body:
          "Check what you know: your region, your budget (NHIS card?), and time. Search the Support Navigator first. Always check the verification date. Save the number 0800 678 678 in your phone; it is toll-free and confidential.",
      },
      {
        id: "s2",
        heading: "During the contact",
        body:
          "Ask the questions booked in your Action Planner: 'What happens next?', 'What does this cost with my NHIS card?', 'Who sees my information?', 'When should I come back?'. Writing answers down turns an overwhelming moment into a plan.",
        example:
          "A school counsellor planned a first-ever clinic visit with a student using this product: the student booked, prepared four questions, took his NHIS card, and brought his sister. The visit ended with an appointment card and one follow-up date, the kind of practical outcome these pages aim for.",
      },
      {
        id: "s3",
        heading: "After, because care continues",
        body:
          "Care rarely ends in one visit: keep the follow-up date, keep records, and re-verify any service details that change (opening hours, costs). If the entry you depend on is marked amber, verify it yourself by phone before travelling.",
      },
    ],
    keyPoints: [
      "Check verification dates before trusting any listing, here or elsewhere.",
      "Booked questions turn a visit from vague fear into a plan.",
      "Care is a route, not one event: follow-ups and re-verification matter.",
    ],
  },
];
