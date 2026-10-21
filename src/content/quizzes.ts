import type { quizQuestionSchema } from "./schema";
import type { z } from "zod";

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

/**
 * 32 questions, 4 per module. Every question carries per-option feedback,
 * the educational principle, and the references backing the answer.
 * Scores here are EDUCATIONAL knowledge indicators, never clinical ones.
 */
export const questions: QuizQuestion[] = [
  /* Module 1. Fundamentals */
  {
    id: "q-fund-1",
    moduleId: "mental-health-fundamentals",
    prompt:
      "Which statement best reflects how WHO describes mental health?",
    options: [
      { text: "The absence of any mental disorder", feedback: "WHO describes mental health as more than the absence of disorder, it includes managing stress, functioning and participating in community life." },
      { text: "A spectrum that everyone sits on", feedback: "Correct. Mental health is a spectrum involving stress management, functioning and participation, not a dividing line between normal and mad." },
      { text: "A fixed state you either have or don't", feedback: "Mental health is dynamic and sits on a spectrum. People move along it over time." },
      { text: "Something only clinicians can influence", feedback: "Health systems play a role, but communities, families and daily habits all shape mental health." },
    ],
    correctIndex: 1,
    principle: "Mental health is a spectrum involving stress management, functioning and participation, not a dividing line.",
    referenceIds: ["R1", "R10"],
  },
  {
    id: "q-fund-2",
    moduleId: "mental-health-fundamentals",
    prompt:
      "In WHO's 2021 situational assessment for Ghana, what proportion of Ghanaians with major depression were estimated to be receiving treatment?",
    options: [
      { text: "About 1 in 100 (0.6%)", feedback: "Correct, 0.61%. Most people living with depression were estimated to receive no care, which is why education that leads to action matters." },
      { text: "About 1 in 10 (11%)", feedback: "Too high. The estimated treatment coverage for major depressive disorder was 0.61%. Most received no care." },
      { text: "About half (50%)", feedback: "Far too high. Coverage was estimated at 0.61% for major depression in the 2021 assessment." },
      { text: "The assessment did not cover depression", feedback: "It did. Major depressive disorder was one of the priority conditions assessed, at 0.61% coverage." },
    ],
    correctIndex: 0,
    principle: "Know the scale of the treatment gap: WHO's 2021 assessment put depression treatment coverage at 0.61%.",
    referenceIds: ["R1"],
  },
  {
    id: "q-fund-3",
    moduleId: "mental-health-fundamentals",
    prompt:
      "A 2023 systematic review (Nazari et al.) found that web-based mental health education for young people reliably improved which outcome?",
    options: [
      { text: "Stigma levels", feedback: "No. Pooled stigma change was not statistically significant in that review." },
      { text: "Help-seeking intentions", feedback: "No. Pooled help-seeking effects were not statistically significant either." },
      { text: "Mental health literacy knowledge", feedback: "Correct. Knowledge improved (SMD 0.70), which is precisely why MINDSTEP insists on practice and navigation beyond facts." },
      { text: "Clinical symptoms", feedback: "No, the review measured literacy, stigma and help-seeking outcomes, not symptom change." },
    ],
    correctIndex: 2,
    principle: "Evidence pattern: web education moves knowledge reliably; stigma and help-seeking need more than information.",
    referenceIds: ["R2"],
  },
  {
    id: "q-fund-4",
    moduleId: "mental-health-fundamentals",
    prompt:
      "A hall-mate tells you their brother 'changed completely last month'. What is the appropriate role for you after learning from this lesson?",
    options: [
      { text: "Assess which condition he has", feedback: "Labelling people with diagnoses is clinical work. Recognising that attention may be needed is the appropriate educational role." },
      { text: "Recognise that attention may be needed and support a next step", feedback: "Correct. Education enables recognition and support; the brother's next step could be a chat with a health centre or the national helpline." },
      { text: "Wait quietly; involving yourself makes stigma worse", feedback: "Silence usually deepens the delay. Respectful support and pointing to help reduce it." },
      { text: "Spread news so people can help him", feedback: "Sharing without consent breaches trust and can increase stigma. Support belongs with the person." },
    ],
    correctIndex: 1,
    principle: "Recognition and support are educational roles; assessment is clinical.",
    referenceIds: ["R1", "R10"],
  },

  /* Module 2. Stress & coping */
  {
    id: "q-stress-1",
    moduleId: "stress-coping",
    prompt:
      "When is sustained stress educationally significant, even though stress itself is a normal response?",
    options: [
      { text: "Whenever you feel nervous before an event", feedback: "Pre-event nerves are normal and usually fade after it." },
      { text: "When the pressure outlasts your recovery. Day after day", feedback: "Correct. Duration without recovery is the pattern worth acting on early." },
      { text: "Only when others comment that you look stressed", feedback: "Waiting for others to confirm delays noticing. Self-observation and honesty matter." },
      { text: "Never. Stress is always harmless", feedback: "Sustained stress without recovery commonly affects sleep, mood, focus and relationships." },
    ],
    correctIndex: 1,
    principle: "Stress is normal; the concern is sustained demand without recovery.",
    referenceIds: ["R10"],
  },
  {
    id: "q-stress-2",
    moduleId: "stress-coping",
    prompt:
      "Which grouping best describes common everyday effects of sustained stress?",
    options: [
      { text: "Body, mind and behaviour", feedback: "Correct. Sleep/tension, concentration/worry, and snapping/avoiding are common groups, and they vary person to person." },
      { text: "Fever, cough and rash", feedback: "Those are physical illness symptoms, not the typical stress triad." },
      { text: "A universal checklist everyone shares", feedback: "Effects vary; there is no single universal list, and none of these is a diagnostic checklist." },
      { text: "Only emotional signs", feedback: "Body effects (sleep, appetite, tension) are common too." },
    ],
    correctIndex: 0,
    principle: "Common groups: body, mind, behaviour. Always varying, never a checklist.",
    referenceIds: ["R10"],
  },
  {
    id: "q-stress-3",
    moduleId: "stress-coping",
    prompt:
      "Your term fees pressure cannot change tonight. Which coping response best fits this reality?",
    options: [
      { text: "Skip dinner to save money and study harder", feedback: "This deletes the recovery functions. Food and rest, that sustained coping depends on." },
      { text: "Steady yourself (rest, breathing), then plan the money conversation for tomorrow", feedback: "Correct, when a situation cannot change tonight, emotion-focused coping carries the load and planning waits for morning." },
      { text: "Stay up all night applying bursaries you don't qualify for", feedback: "Rest loss deepens the load and the plan is unrealistic tonight." },
      { text: "Ignore it until exams finish", feedback: "Avoidance deepens stress over time." },
    ],
    correctIndex: 1,
    principle: "Mix coping families: when problems can't change now, emotion-focused coping carries; planning waits.",
    referenceIds: ["R10"],
  },
  {
    id: "q-stress-4",
    moduleId: "stress-coping",
    prompt:
      "What is a 'minimum viable routine' in this course?",
    options: [
      { text: "A perfect routine you can keep for three days", feedback: "Perfect-but-short routines collapse; the module argues for the version that survives a bad week." },
      { text: "The smallest version of sleep, food, movement and connection you can defend even in your worst week", feedback: "Correct. Coping that survives real life is defendable, repeatable and small." },
      { text: "A clinical plan prescribed by a professional", feedback: "MINDSTEP doesn't prescribe; this refers to your own defendable baseline." },
      { text: "Missing meals to afford therapy", feedback: "Undermines the routine you're trying to defend." },
    ],
    correctIndex: 1,
    principle: "Build the routine that survives your worst week, not the one that impresses your best.",
    referenceIds: ["R10"],
  },

  /* Module 3. Anxiety */
  {
    id: "q-anx-1",
    moduleId: "understanding-anxiety",
    prompt:
      "Educationally, which pattern distinguishes worrying that may deserve attention from ordinary pre-event worry?",
    options: [
      { text: "It is intense", feedback: "Intensity alone isn't the marker; strong-but-fleeting worry is common and passes." },
      { text: "It persists long after situations pass and starts limiting life", feedback: "Correct. Persistence plus functional impact is the pattern education flags, not any single symptom." },
      { text: "It happens to everyone", feedback: "Commonality isn't the marker either; persistence and limitation are." },
      { text: "It is about exams", feedback: "The topic doesn't determine significance; the pattern does." },
    ],
    correctIndex: 1,
    principle: "Persisting + life-limiting, the two qualities that matter educationally.",
    referenceIds: ["R10"],
  },
  {
    id: "q-anx-2",
    moduleId: "understanding-anxiety",
    prompt:
      "Since 2024, which of the following is true about anxiety care in Ghana per WHO's case study?",
    options: [
      { text: "Anxiety is now one of four conditions included in the NHIS package", feedback: "Correct. Anxiety, depression, psychosis and bipolar disorder entered the NHIS mental health package from 2024." },
      { text: "Anxiety has no treatment in Ghana", feedback: "Treatment exists and has expanded, including trained primary-care staff." },
      { text: "Only the three psychiatric hospitals may treat anxiety", feedback: "Primary and regional facilities were part of the expansion; hospital concentration is the very problem the reform addresses." },
      { text: "Costs are unchanged for anxiety care", feedback: "The NHIS inclusion is specifically about financial access." },
    ],
    correctIndex: 0,
    principle: "Four conditions. Depression, anxiety, psychosis, bipolar. Entered NHIS coverage from 2024.",
    referenceIds: ["R1"],
  },
  {
    id: "q-anx-3",
    moduleId: "understanding-anxiety",
    prompt:
      "A friend is panicking before their first seminar. Which response best supports them?",
    options: [
      { text: "'You overthink everything. Just relax.'", feedback: "Judges the feeling. Shame is a measured driver of silence, and this invites hiding." },
      { text: "'This looks heavy. I'll sit with you before you go in. What would help?'", feedback: "Correct. Presence, gentle naming, and an offer with choices outperform advice." },
      { text: "'Others have it worse than you do.'", feedback: "Ranking pain against others' closes the conversation." },
      { text: "Walk away to give them 'space'", feedback: "Abandoning an anxious person to cope alone is not support; presence is helpful even in silence." },
    ],
    correctIndex: 1,
    principle: "Presence + naming + offering choices beats advice and judgement.",
    referenceIds: ["R10"],
  },
  {
    id: "q-anx-4",
    moduleId: "understanding-anxiety",
    prompt:
      "After weeks of avoidance following a trotro accident, a friend now skips all lectures off-campus. What is the strongest educational take?",
    options: [
      { text: "He is exaggerating a minor event", feedback: "Dismissing it reproduces stigma; the fear outlived the danger and reshaped his life." },
      { text: "He can diagnose himself using MINDSTEP", feedback: "No. MINDSTEP is educational and cannot diagnose anyone." },
      { text: "The pattern may deserve professional attention; you could support that conversation", feedback: "Correct. Persistent, life-limiting patterns are when pointing to professional support is a caring act." },
      { text: "Force him onto a trotro to break the fear", feedback: "Pressure without consent typically deepens distress and distrust." },
    ],
    correctIndex: 2,
    principle: "Persistent avoidance that reshapes life is a signal to support, not to judge.",
    referenceIds: ["R10"],
  },

  /* Module 4. Depression */
  {
    id: "q-dep-1",
    moduleId: "understanding-depression",
    prompt:
      "Educationally, what distinguishes persistent low mood from a bad week?",
    options: [
      { text: "It lasts days", feedback: "Days are within ordinary rhythm; the educational marker is weeks with life interference." },
      { text: "It persists, involves mood/thinking/activity, and interferes with daily life", feedback: "Correct. Persistence plus functional impact, phrased in general terms, not as a checklist." },
      { text: "It can't be treated", feedback: "Depression is treated as treatable and recoverable." },
      { text: "It always looks identical in everyone", feedback: "Symptoms vary; there's no single universal picture." },
    ],
    correctIndex: 1,
    principle: "Persistent + interfering. General educational markers, never a diagnostic checklist.",
    referenceIds: ["R1", "R10"],
  },
  {
    id: "q-dep-2",
    moduleId: "understanding-depression",
    prompt:
      "Why is 'snap out of it' harmful in this context?",
    options: [
      { text: "It is spoken too quickly", feedback: "Speed isn't the core issue; the framing is." },
      { text: "It rewrites a health condition into a personal failing", feedback: "Correct, like telling someone with fever to walk it off, it adds shame to illness." },
      { text: "Nobody recovers", feedback: "Many people do recover, which is the hopeful point of this module." },
      { text: "It is rude but harmless", feedback: "Shame is a measured strong barrier to help-seeking; harm is real." },
    ],
    correctIndex: 1,
    principle: "'Snap out of it' converts illness into character flaw and deepens shame.",
    referenceIds: ["R1", "R3"],
  },
  {
    id: "q-dep-3",
    moduleId: "understanding-depression",
    prompt: "Which statement about treatment is true and appropriately scoped?",
    options: [
      { text: "MINDSTEP can recommend the right medication", feedback: "No. Medication decisions belong to qualified clinicians, not apps." },
      { text: "Treatment forms (talking support, medication, social support) are chosen by clinicians", feedback: "Correct. Decisions are clinical; education explains the landscape without prescribing." },
      { text: "Recovery is impossible without leaving Ghana", feedback: "Care exists nationally, and access expanded via primary care and NHIS from 2024." },
      { text: "Treatment always fails", feedback: "WHO frames recovery as the expected story; hopelessness is part of the myth-set this course contests." },
    ],
    correctIndex: 1,
    principle: "Treatment decisions are clinical; education explains and supports, never prescribes.",
    referenceIds: ["R1", "R10"],
  },
  {
    id: "q-dep-4",
    moduleId: "understanding-depression",
    prompt:
      "A talented footballer has missed three weeks of training. Following this module's spirit, the best coach response is:",
    options: [
      { text: "Publicly bench him to motivate change", feedback: "Public shaming deepens shame, the measured barrier to seeking help." },
      { text: "Ask privately, with openness to what has changed for him", feedback: "Correct. Respect plus private noticing; health, not laziness, may explain it." },
      { text: "Fine him", feedback: "Punishment adds the structural stigma the research measured." },
      { text: "Diagnose why he is absent", feedback: "Diagnosis is not the coach's role; private, respectful inquiry is." },
    ],
    correctIndex: 1,
    principle: "Notice privately, ask with respect, never judge publicly.",
    referenceIds: ["R1", "R3"],
  },

  /* Module 5. Myths & stigma */
  {
    id: "q-myth-1",
    moduleId: "myths-stigma",
    prompt:
      "In the Sekyere South District study, what share of participants held the dangerousness stereotype about people with mental illness?",
    options: [
      { text: "58.7%", feedback: "Correct, a majority belief measured in one district study, not a national figure." },
      { text: "5.9%", feedback: "Understated by an order of magnitude." },
      { text: "98.7%", feedback: "Overstated; the measured share was 58.7% in that single-district study." },
      { text: "The study did not measure this", feedback: "It did. Dangerousness stereotypes at 58.7% was a key driver of stigma." },
    ],
    correctIndex: 0,
    principle: "One-district scope matters: dangerousness stereotypes were held by 58.7% of that study's participants.",
    referenceIds: ["R3"],
  },
  {
    id: "q-myth-2",
    moduleId: "myths-stigma",
    prompt:
      "An uncle says: 'Hospitals cannot help, this thing is spiritual.' Following the module, the strongest correction:",
    options: [
      { text: "Mock the belief to show it is outdated", feedback: "Humiliation deepens stigma; correction must not attack the person." },
      { text: "Respect the belief, cite what changed (insured care since 2024), offer to show the toll-free line", feedback: "Correct. Respect → evidence → offer; faith and medicine are not enemies, and the offer is concrete." },
      { text: "Say nothing; correction is disrespectful in Ghanaian contexts", feedback: "Respectful engagement is both possible and necessary. Silence leaves myths unchallenged." },
      { text: "Argue that spirits do not exist", feedback: "That attack on belief is neither respectful nor evidence-based in the way the lesson teaches." },
    ],
    correctIndex: 1,
    principle: "Correcting myths: respect → specific evidence → practical offer.",
    referenceIds: ["R3", "R4"],
  },
  {
    id: "q-myth-3",
    moduleId: "myths-stigma",
    prompt:
      "Which stigma dimension in the district study most strongly reduced the odds of seeking help?",
    options: [
      { text: "Structural barriers in healthcare (OR 0.48)", feedback: "Correct. Measured as the strongest single deterrent, followed by internalized shame (OR 0.53)." },
      { text: "Fear of casual infection", feedback: "A real measured fear (41.7%) and a powerful myth, but the regression's strongest odds-reducer was structural." },
      { text: "Workplace pay cuts", feedback: "Economic stigma mattered (OR 0.62), but not the strongest measured." },
      { text: "None significantly reduced help-seeking", feedback: "All measured forms significantly reduced help-seeking odds." },
    ],
    correctIndex: 0,
    principle: "Structural barriers cut help-seeking odds roughly in half. Naming services concretely matters.",
    referenceIds: ["R3"],
  },
  {
    id: "q-myth-4",
    moduleId: "myths-stigma",
    prompt:
      "'I shouldn't need help'. Following the module on self-stigma, what is the practice that breaks the spiral?",
    options: [
      { text: "Suppress the sentence and act tough", feedback: "Suppression feeds the shame spiral instead of interrupting it." },
      { text: "Catch the absorbed sentence and replace it with the evidence-based one", feedback: "Correct. Self-stigma is a learnable practice of catching and replacing absorbed sentences." },
      { text: "Post the feeling publicly for validation", feedback: "Vulnerability can help, but publicly posting without support isn't the module's practice." },
      { text: "Wait until someone else raises it", feedback: "Delays care; self-stigma's power is its silence." },
    ],
    correctIndex: 1,
    principle: "Self-stigma breaks by catching absorbed sentences and replacing them with measured truths.",
    referenceIds: ["R3"],
  },

  /* Module 6. Supportive communication */
  {
    id: "q-comm-1",
    moduleId: "supportive-communication",
    prompt: "Which trio captures judgement-free listening?",
    options: [
      { text: "Diagnose, advise, encourage", feedback: "Diagnosis and advice belong elsewhere; they can close a conversation." },
      { text: "Don't interrupt, reflect meaning, ask open questions", feedback: "Correct, the goal is that the person leaves lighter, not solved." },
      { text: "Agree with everything they say", feedback: "Reflection proves comprehension, not agreement." },
      { text: "Silence, judging silently, and a friend-style joke", feedback: "Silence alone without reflection can read as indifference." },
    ],
    correctIndex: 1,
    principle: "Listening = not interrupting, reflecting meaning, open questions.",
    referenceIds: ["R10"],
  },
  {
    id: "q-comm-2",
    moduleId: "supportive-communication",
    prompt:
      "A hostel-mate says 'I don't see the point anymore'. The best first response:",
    options: [
      { text: "'Say more about that. Since when?'", feedback: "Correct. Open, present, non-judging; ten quiet seconds beat a solution list." },
      { text: "'Come on. Exams end soon!'", feedback: "Minimises and redirects; closes the door." },
      { text: "'Same here last week, mine was worse.'", feedback: "Hijacks the moment to your own story." },
      { text: "'Have you tried a timetable?'", feedback: "Fixing too fast converts their moment into your agenda." },
    ],
    correctIndex: 0,
    principle: "Open questions outperform fixes, comparisons and hijacks.",
    referenceIds: ["R10"],
  },
  {
    id: "q-comm-3",
    moduleId: "supportive-communication",
    prompt:
      "A friend says 'at least you're not in my shoes.' Which choice best sequences faith language respectfully?",
    options: [
      { text: "'Have you even prayed properly?'", feedback: "Prayer as first response can read as 'stop talking'." },
      { text: "'Let's keep plan A. Do you want to pray together after we load your clinic report tomorrow?'", feedback: "Correct. Care first and faith beside, never instead of." },
      { text: "'Faith doesn't help with these things.'", feedback: "Attacks belief; the lesson explicitly protects faith as part of Ghanaian support networks." },
      { text: "Say nothing about faith at all, ever", feedback: "Silence about faith can still honour belief, but offering to hold both is the taught practice." },
    ],
    correctIndex: 1,
    principle: "Sequencing: respect the person's faith; let it co-exist with professional care.",
    referenceIds: ["R10", "R9"],
  },
  {
    id: "q-comm-4",
    moduleId: "supportive-communication",
    prompt:
      "What does healthy support-boundary language sound like?",
    options: [
      { text: "'I'm now your counsellor. Tell me everything.'", feedback: "Roles blur; friendship isn't therapy." },
      { text: "'I care about this, and I can walk with you to talk with someone trained.'", feedback: "Correct. Care plus pointing to competent help, exactly WHO's peer-support principle." },
      { text: "'This is too heavy for me. Leave me out.'", feedback: "A hard no; care disappears." },
      { text: "'I will handle this myself and tell you what to do.'", feedback: "Overreach; you become judge and therapist." },
    ],
    correctIndex: 1,
    principle: "Peer support points to competent help; boundaries protect both people.",
    referenceIds: ["R10", "R9"],
  },

  /* Module 7, when to seek help */
  {
    id: "q-help-1",
    moduleId: "when-to-seek-help",
    prompt:
      "Which example is an educational signal that professional attention may be worth considering?",
    options: [
      { text: "Two months of steadily shrinking everyday functioning", feedback: "Correct. General persistence and shrinking functioning are educational markers. Not a diagnosis." },
      { text: "One stressful day before a quiz", feedback: "Stress peaks before events and fades; this doesn't match the persistence pattern." },
      { text: "Feeling sad after grief", feedback: "Grief has its own natural rhythm and isn't the signal described." },
      { text: "A single headache", feedback: "Physical complaints alone here aren't the pattern the lesson means." },
    ],
    correctIndex: 0,
    principle: "Educational signals generalise; they are attention-questions, not diagnostic criteria.",
    referenceIds: ["R10"],
  },
  {
    id: "q-help-2",
    moduleId: "when-to-seek-help",
    prompt: "Why does shame matter so much in the decision to seek help?",
    options: [
      { text: "It's just social noise with no measured impact", feedback: "It has measured impact: it reduced help-seeking odds about half in a district study." },
      { text: "Fear of being judged delays the first step against evidence of benefit", feedback: "Correct. Measured OR ≈0.53; treating asking as strength addresses it directly." },
      { text: "Because seeking help costs too much universally", feedback: "Costs matter but are now partly addressed by NHIS coverage from 2024; shame is a distinct barrier." },
      { text: "Because professionals always reject stigmatised clients", feedback: "Confidential, respectful attention is an explicit WHO expectation, and a standard to ask for." },
    ],
    correctIndex: 1,
    principle: "Shame is a measured strong barrier. Naming it openly is the counter-moves.",
    referenceIds: ["R3"],
  },
  {
    id: "q-help-3",
    moduleId: "when-to-seek-help",
    prompt:
      "What does WHO's adolescent service standard explicitly make an expectation for good care?",
    options: [
      { text: "Confidentiality and respectful, non-judgemental care", feedback: "Correct. Asking 'who sees my information?' is fair, not rude." },
      { text: "Parental presence at every visit", feedback: "Not a WHO expectation for adolescents; confidentiality is the standard." },
      { text: "Same-day cure", feedback: "Nobody promises cures; good care still includes questions and follow-up." },
      { text: "Payment only via cash", feedback: "Not the expectation, and NHIS coverage expanded from 2024." },
    ],
    correctIndex: 0,
    principle: "Dignity and confidentiality are explicit WHO standards, not favours.",
    referenceIds: ["R9"],
  },
  {
    id: "q-help-4",
    moduleId: "when-to-seek-help",
    prompt:
      "A student called the national helpline at 10pm during exam week. What did that call require of them?",
    options: [
      { text: "An appointment booking and payment in advance", feedback: "The MHA toll-free line exists specifically to be reachable; prep notes help but payment isn't part of phoning." },
      { text: "Nothing but the decision to make the call, it is toll-free and confidential", feedback: "Correct. Cost was zero and confidentiality made nobody aware at hall." },
      { text: "A smart phone with data", feedback: "No, it is a phone line." },
      { text: "A parent's consent", feedback: "Not required for the helpline; asking who sees your information is fair." },
    ],
    correctIndex: 1,
    principle: "Low-barrier entry is the point of the helpline; cost and confidentiality shouldn't scare anyone off.",
    referenceIds: ["R5", "R6"],
  },

  /* Module 8. Service navigation */
  {
    id: "q-nav-1",
    moduleId: "navigating-services-ghana",
    prompt: "How many specialist psychiatric hospitals does the MHA regulate, per WHO's AIMS report?",
    options: [
      { text: "Three. Accra Psychiatric, Pantang, Ankaful", feedback: "Correct, with mental healthcare additionally integrated via regional/district hospitals and primary care." },
      { text: "One", feedback: "Three, all regulated by the MHA." },
      { text: "Ten", feedback: "Too high, the verified count is three specialist hospitals (see the MHA website)." },
      { text: "None. Ghana lacks such hospitals", feedback: "Three distinct specialist hospitals exist and are verified on the MHA website." },
    ],
    correctIndex: 0,
    principle: "The service backbone: three specialist hospitals + regional/district + primary care.",
    referenceIds: ["R4", "R7"],
  },
  {
    id: "q-nav-2",
    moduleId: "navigating-services-ghana",
    prompt:
      "Which caution best reflects how MINDSTEP treats service information?",
    options: [
      { text: "Trust every listing indefinitely", feedback: "Listings change; MINDSTEP displays verification dates and asks you to re-check." },
      { text: "Check the verification date before trusting any listing", feedback: "Correct. Dated verification, amber for unverified, links to official directories, never invented data." },
      { text: "Never believe any platform including MINDSTEP", feedback: "Too strong; you should verify, which MINDSTEP does by dating and sourcing every claim." },
      { text: "Trust a stranger's WhatsApp forward instead", feedback: "Fictional or unverified numbers are exactly what the platform refuses to publish." },
    ],
    correctIndex: 1,
    principle: "Dated sources beat vibes: treat service info as data with a freshness date.",
    referenceIds: ["R7", "R8"],
  },
  {
    id: "q-nav-3",
    moduleId: "navigating-services-ghana",
    prompt:
      "Before a first clinic visit, which preparation best matches the module's guidance?",
    options: [
      { text: "Write when it started, what changed, what you tried; prepare four questions; take your NHIS card", feedback: "Correct. Notes, questions, card, and optionally a trusted person, make the assessment stronger." },
      { text: "Arrive unprepared and let the professional lead entirely", feedback: "Preparation works in your favour; unstructured visits often leave with unclear next steps." },
      { text: "Read all the medication names online", feedback: "Not needed, this is educational preparation, not treatment research." },
      { text: "Borrow money for a private hospital", feedback: "Not required; primary care access expanded and NHIS covers several conditions now." },
    ],
    correctIndex: 0,
    principle: "Five minutes of preparation makes the whole first visit stronger.",
    referenceIds: ["R1", "R7"],
  },
  {
    id: "q-nav-4",
    moduleId: "navigating-services-ghana",
    prompt:
      "If a service entry in MINDSTEP is marked amber ('awaiting verification'), what should you do?",
    options: [
      { text: "Trust it anyway. Amber is just an aesthetic", feedback: "Amber means unverified. Travel time is a cost; a wrong number is worse than none." },
      { text: "Verify by calling or checking the cited official source before you travel", feedback: "Correct, the user's own verification protects them; MINDSTEP refuses to fill gaps with guesses." },
      { text: "Report MINDSTEP to regulators", feedback: "The amber mark is the honest disclosure, not a defect; verify before travel instead." },
      { text: "Never seek help anywhere again", feedback: "An overreaction that costs care; re-check the official directory instead." },
    ],
    correctIndex: 1,
    principle: "Unverified ≠ rejected: verify independently before acting on it.",
    referenceIds: ["R7"],
  },
];
