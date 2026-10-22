import type { ArtName } from "@/components/visual/art";
import type { ExplainName } from "@/components/visual/explainers";

/**
 * MINDSTEP topic cards, the new content model.
 *
 * NOT a course: no lessons, quizzes, levels, progress bars or forced order.
 * Free exploration; the user can enter anywhere. Each card is one short,
 * self-contained point with small concrete actions, a voice script and a
 * matching green illustration.
 *
 * Integrity rules (see docs/content-audit.md):
 *  - no diagnosing, no labels, no promises, "may", "many people";
 *  - every card cites an entry from docs/health-references.md (the repo's
 *    verified source list) or is flagged "expert review" in
 *    docs/content-gaps.md. Nothing invented.
 */

export type CardId =
  | "overwhelmed-now"
  | "too-much-to-do"
  | "feeling-flat"
  | "getting-through-today"
  | "worry-loop"
  | "body-anxiety"
  | "cant-sleep"
  | "start-the-conversation"
  | "helping-a-friend"
  | "words-dont-come"
  | "myths-that-hurt"
  | "where-to-start"
  | "why-we-snap"
  | "why-we-avoid"
  | "why-we-withdraw"
  | "why-we-cope"
  | "depression"
  | "anxiety-disorders"
  | "trauma-ptsd"
  | "bipolar"
  | "ocd"
  | "psychosis"
  | "substance-use"
  | "eating-disorders";

export type ThemeId =
  | "feeling-overwhelmed"
  | "low-mood"
  | "worry"
  | "sleep"
  | "why-we-react"
  | "mental-health-issues"
  | "talking-helping"
  | "myths"
  | "getting-help";

export type TopicCard = {
  id: CardId;
  theme: ThemeId;
  title: string;
  /** The point, 1 to 2 sentences. */
  point: string;
  /** Why it matters, 1 sentence. */
  why: string;
  /** 2 to 4 small, free, today-doable steps. */
  steps: string[];
  /** Optional recognition line. */
  ifYou?: string;
  /** Spoken, warm, ~50 to 110 words; pause marked with "...". */
  voiceScript: string;
  art: ArtName;
  /** Optional motion explainer scene attached to this card. */
  motion?: ExplainName;
  /** Source line. Small print, never the body. */
  source: string;
};

export const themes: Array<{ id: ThemeId; title: string; line: string; art: ArtName }> = [
  { id: "feeling-overwhelmed", title: "Feeling overwhelmed", line: "When it's all a bit much, and how to come back to now.", art: "overwhelmed" },
  { id: "low-mood", title: "Low mood", line: "Flat, heavy days. Small things that can help.", art: "low-mood" },
  { id: "worry", title: "Worry & anxiety", line: "When thoughts loop and the body braces.", art: "worry-ideas" },
  { id: "sleep", title: "Sleep", line: "Quiet nights start before bedtime.", art: "sleep-night" },
  { id: "why-we-react", title: "Why we react", line: "Fight, flight, freeze, avoid: what stress does, and why it is not weakness.", art: "overwhelmed" },
  { id: "mental-health-issues", title: "Mental health issues", line: "Plain explanations of common conditions, without labels or diagnosis.", art: "learning" },
  { id: "talking-helping", title: "Talking & helping", line: "What to say to someone, or about yourself.", art: "friends-talking" },
  { id: "myths", title: "Myths & facts", line: "Kind, correct answers to the things people say.", art: "community" },
  { id: "getting-help", title: "Getting help", line: "Who to call, where to walk in, what to expect.", art: "chat-bubbles" },
];

export const cards: TopicCard[] = [
  {
    id: "overwhelmed-now",
    theme: "feeling-overwhelmed",
    title: "Overwhelmed right now?",
    point: "When everything feels too big, your body needs to know it's safe first. Thinking can wait a few minutes.",
    why: "A calmer body makes better decisions. You can't think your way out of panic.",
    steps: [
      "Slow down your breathing. In for 4, out for 6. Do that five times.",
      "Look around and silently name 5 things you can see, 4 you can hear, 3 you can touch.",
      "Unclench your jaw. Drop your shoulders. Let your feet press the floor.",
      "Tell one person: \"I'm feeling overwhelmed.\" Saying it out loud takes the edge off.",
    ],
    ifYou: "If your chest feels tight and your thoughts are racing, this is for you.",
    voiceScript: "If everything feels like too much right now... that's okay. Let's slow it down. Breathe in for four... and out for six. Again. Five times if you can. Now look around you. Name five things you can see... four sounds you can hear... three things you can touch. Let your shoulders drop. Let your feet press the floor. You don't have to solve anything yet. If someone safe is nearby, tell them you're feeling overwhelmed. Saying it out loud... already helps.",
    art: "overwhelmed",
    motion: "overwhelm",
    source: "General wellbeing practice, not medical advice.",
  },
  {
    id: "too-much-to-do",
    theme: "feeling-overwhelmed",
    title: "Too much to do",
    point: "A pile of deadlines feels impossible all at once. One written list and one small start shrink it fast.",
    why: "Your brain relaxes when tasks are written down instead of circling in your head.",
    steps: [
      "Dump every task onto one paper list. All of them. Two minutes.",
      "Circle the one thing due first. Ignore the rest for now.",
      "Give it 10 minutes. Just 10. Stopping after 10 is allowed. You usually won't want to.",
      "Tell someone your deadline pressure. Lecturers and friends can adjust more than you'd expect.",
    ],
    ifYou: "If it's exam week and your chest tightens whenever you open your books, start here.",
    voiceScript: "When the work piles up, your mind keeps repeating everything at once... and that's exhausting. So trick it. Grab paper and dump every task onto one list. All of them. Two minutes. Now circle the one thing due first... and give it just ten minutes. You can stop after ten. You probably won't want to. And here's the part people forget: tell someone. A friend, a lecturer. Deadlines bend more often than you think.",
    art: "take-a-break",
    source: "General study and stress practice, not medical advice.",
  },
  {
    id: "feeling-flat",
    theme: "low-mood",
    title: "When everything feels flat",
    point: "Low mood makes everything feel far away and pointless. Movement and one small pleasant thing can lift it a little. They won't fix everything, and that's fine.",
    why: "Waiting to feel like doing things keeps you stuck; tiny actions come first, mood follows later.",
    steps: [
      "Step outside for five minutes. Sunlight, air, movement. That's the whole task.",
      "Do one small thing you used to enjoy: music, a call, a favourite food.",
      "Tell one trusted person how today really feels.",
      "If the flatness has lasted two weeks or more, book a health centre visit. That's a wise move, not a dramatic one.",
    ],
    ifYou: "If people keep saying \"you've changed\" and you can't remember the last time you enjoyed something, this is for you.",
    voiceScript: "Some days feel flat... like everything is behind glass. If that's today, start small. Step outside for five minutes. Sunlight, air, a short walk. That's the whole task. Then do one small thing you used to enjoy, music... a call... a meal you like. And tell one trusted person how today really was. Not \"I'm fine\"... the truth. If this flatness has stayed for two weeks or more, visiting a health centre is a wise move. Not dramatic. Wise.",
    art: "low-mood",
    motion: "breath-lows",
    source: "General wellbeing practice, not medical advice.",
  },
  {
    id: "getting-through-today",
    theme: "low-mood",
    title: "Getting through today",
    point: "On heavy days, shrink the goal. Don't fix your life. Just get through the next hour with the basics done.",
    why: "Small wins rebuild the feeling that things can go right.",
    steps: [
      "Drink water. Eat something, even small. Open a window or step into the light.",
      "Ask: what's the very next thing that needs doing? Do only that.",
      "Write down one thing that went even slightly okay today.",
      "Go to bed at a set time. Rest makes tomorrow lighter.",
    ],
    ifYou: "If getting out of bed already feels like an achievement. Count it as one. Then do the next hour only.",
    voiceScript: "On the heavy days, don't try to fix your life. Just get through the next hour. Drink some water. Eat something, even if it's small. Let daylight in. Then ask one question: what's the very next thing that needs doing? Do only that. Before bed, write down one thing that went even slightly okay. It counts. And keep your bedtime steady... rest makes tomorrow lighter than today felt.",
    art: "progress-path",
    motion: "young-person",
    source: "General wellbeing practice, not medical advice.",
  },
  {
    id: "worry-loop",
    theme: "worry",
    title: "Worried thoughts on repeat",
    point: "Worries love to loop at night. Writing one down and giving it a scheduled time takes its power away.",
    why: "A worry you've written down is a task; a worry circling your head is a siren.",
    steps: [
      "Write the worry down in one sentence. Name it.",
      "Ask: is there anything I can do about it today? If yes, do that one thing. If no, let it sit.",
      "Give it a worry time: 10 minutes tomorrow afternoon. When it returns tonight, say \"noted, 2pm tomorrow.\"",
      "Bring your attention back to what you're doing, out loud if you need to.",
    ],
    ifYou: "If the same thought has been running in your head all week, this is for you.",
    voiceScript: "Worries love to loop... especially at night. Here's the move. Write the worry down in one sentence. Naming it shrinks it. Ask: can I do anything about this today? If yes... do that one thing. If no... give it an appointment. Ten minutes tomorrow afternoon. When it comes back tonight, tell it: noted... two pm. Then put your attention back on what you're doing. Out loud if you have to. You're not ignoring it. You're giving it a time and place.",
    art: "worry-ideas",
    motion: "worry-locate",
    source: "Standard worry-management practice, not medical advice.",
  },
  {
    id: "body-anxiety",
    theme: "worry",
    title: "When your body braces",
    point: "A racing heart or tight chest can be your body bracing for threat. Uncomfortable, but it passes. You can help it pass faster.",
    why: "Understanding what's happening in your body takes some of the fear away.",
    steps: [
      "Sit down. Feet flat. Put one hand on your chest.",
      "Breathe out slowly, longer than you breathe in. Exhaling calms the body.",
      "Name it kindly: \"This is my body bracing. It will pass.\"",
      "If it keeps happening, or you're worried it's something physical, see a nurse or doctor to get checked.",
    ],
    ifYou: "If your heart races before speaking in public, crowds or calls, this is for you.",
    voiceScript: "Sometimes your heart races... your chest tightens... and your mind jumps to the worst. Often that's your body bracing for a threat... it's uncomfortable, but it passes. Help it along. Sit down. Feet flat. One hand on your chest. Breathe out slowly... longer than you breathe in. Say kindly: this is my body bracing... it will pass. And if it keeps happening, or you're worried it's something physical, see a nurse or doctor. Getting checked is the smart move.",
    art: "breathing-woman",
    motion: "breathe",
    source: "Physical symptoms have many causes. If they continue, get checked by a health professional.",
  },
  {
    id: "cant-sleep",
    theme: "sleep",
    title: "Can't sleep?",
    point: "Sleep comes to a quiet mind in a dark, cool room. Racing at 1am is a sign to get up, not to fight the bed.",
    why: "Protecting your sleep makes everything lighter the next day: mood, focus, worry.",
    steps: [
      "Keep one wake-up time, even weekends. It anchors your body clock.",
      "Park tomorrow: write your to-do list before bed, not in bed.",
      "Screens away 30 to 60 minutes before sleep. The light tells your brain it's daytime.",
      "Awake more than 20 minutes? Get up, do something boring in dim light, try again when sleepy.",
    ],
    ifYou: "If you know every ceiling of your room by heart, start with the wake-up time. It matters most.",
    voiceScript: "Can't sleep? Stop fighting the bed. Sleep comes to a quiet mind in a dark, cool room. Protect it like this. Keep one wake-up time... even weekends. It anchors your body clock. Before bed, park tomorrow. Write your list, then leave it. Screens away thirty to sixty minutes early... that light tells your brain it's daytime. And if you're still awake after twenty minutes, get up. Do something boring in dim light. Come back when you're sleepy.",
    art: "sleep-night",
    motion: "breathe",
    source: "Standard sleep guidance, not medical advice.",
  },
  {
    id: "start-the-conversation",
    theme: "talking-helping",
    title: "How to start the conversation",
    point: "You don't need perfect words. You need a calm moment, one honest observation, and good listening.",
    why: "Most people who open up say the first sentence from someone else is what made it possible.",
    steps: [
      "Pick a private, unhurried moment. A walk works better than a confrontation.",
      "Start with what you've seen: \"You've seemed quiet lately. How are you, really?\"",
      "Listen more than you fix. Nods and \"that sounds hard\" beat advice.",
      "End with one question: \"What would help, even a little?\"",
    ],
    ifYou: "If you've been rehearsing this conversation for days, this is your script. It doesn't need more than that.",
    voiceScript: "You don't need perfect words to check on someone. You need a calm moment... one honest observation... and good ears. Try a walk, side by side beats face to face. Start with what you've seen: you've seemed quiet lately... how are you, really? Then listen more than you fix. Nods help. \"That sounds hard\" helps. Advice can wait. End with one question: what would help, even a little? That's it. That's the whole script.",
    art: "friends-talking",
    motion: "conversation",
    source: "General communication guidance, not medical advice.",
  },
  {
    id: "helping-a-friend",
    theme: "talking-helping",
    title: "Helping a friend, without burning out",
    point: "You can be a real support without carrying everything. A friend is not a therapist, and even therapists have their own support.",
    why: "Support that exhausts the supporter doesn't last. Protecting yourself protects them too.",
    steps: [
      "Decide what you can honestly offer: listening, company, walking with them to a clinic.",
      "Help them connect to real support. Offer to sit with them while they call or walk in.",
      "Keep your own rest, meals, and study time. Cancelling all of it helps no one.",
      "If you're worried about their safety, don't carry it alone. Tell a trusted adult or a professional. That's loyalty, not betrayal.",
    ],
    ifYou: "If their name is the first thing you check in the morning and you're running on empty, this is for you.",
    voiceScript: "Helping a friend matters... and so do you. You're a friend, not a therapist. Even therapists have supervisors. So decide what you can honestly offer. Listening... company... walking with them to a clinic. Help them reach real support. Offer to sit beside them while they call. And keep your own rest, meals, and study time. Cancelling all of it helps no one. If you're ever worried about their safety, tell a trusted adult or a professional. That's not betrayal. That's loyalty.",
    art: "real-people",
    source: "General supportive practice, not medical advice.",
  },
  {
    id: "words-dont-come",
    theme: "talking-helping",
    title: "When words don't come",
    point: "You don't have to find deep words. Quiet company and small, specific offers say plenty.",
    why: "People remember who stayed, not who said the perfect sentence.",
    steps: [
      "Just sit with them. Silence with company beats silence alone.",
      "Send the simple message: \"Thinking of you. No need to reply.\"",
      "Offer something specific: \"I'm bringing food on Tuesday.\" \"Walk with me at 5?\"",
      "Keep showing up. Small and steady beats grand and once.",
    ],
    ifYou: "If you keep typing and deleting because nothing sounds right, send the short version. It's enough.",
    voiceScript: "Want to help but the words won't come? Here's a secret... people remember who stayed. Not who said the perfect thing. So just sit with them. Silence with company beats silence alone. Send the simple message: thinking of you... no need to reply. Offer something specific. I'm bringing food on Tuesday. Walk with me at five? Specific is kind. Vague is heavy. And keep showing up. Small and steady beats grand and once.",
    art: "you-matter",
    source: "General supportive practice, not medical advice.",
  },
  {
    id: "myths-that-hurt",
    theme: "myths",
    title: "Myths that hurt, and kind answers",
    point: "Mental illness is not weakness, not a curse, and not contagious. People recover and contribute, with support, like anyone with a health condition.",
    why: "Stigma is the reason people wait years to get help; a kind, correct answer can shorten that wait.",
    steps: [
      "Hear the myth calmly, then answer with a person, not a lecture: \"Ama has depression and she's still the best student in our class.\"",
      "Put the person first: \"a person living with...\", not \"a mad person\".",
      "Don't debate the fear; answer it. Fear of \"catching\" it comes from not understanding.",
      "Share what you know in small doses. One honest conversation at a time.",
    ],
    ifYou: "If you've heard \"just pray about it\" or \"it's attention-seeking\" more times than you can count, keep these answers close.",
    voiceScript: "The myths are loud. Mental illness is weakness... it's a curse... it's contagious. None of that is true. It's a health condition... and people recover and contribute, like anyone else. You don't need to win debates. Answer fear with a person: Ama has depression... and she's still the best student in our class. Say a person living with... never a mad person. Share what you know in small doses. One honest conversation at a time. That's how stigma loses.",
    art: "community",
    source: "Based on Ghanaian stigma research and treatment evidence. Summarised on our Sources page.",
  },
  {
    id: "where-to-start",
    theme: "getting-help",
    title: "Where to start getting help",
    point: "Start small and start near: walk into a health centre, or make a free phone call. You don't need a referral or a crisis to go.",
    why: "The earlier the conversation, the smaller the problem stays, and the services are free or low cost.",
    steps: [
      "Call the Mental Health Authority line: 0800 678 678. Free from any network.",
      "Or walk into your nearest health centre or polyclinic and ask to talk to someone.",
      "Bring three lines of notes: how long you've felt this, how it affects your days, what you want help with.",
      "In immediate danger, call 112 (emergency) or get to the nearest hospital now.",
    ],
    ifYou: "If you've been \"meaning to sort something out\" for months, the phone call takes less time than deciding whether to make it.",
    voiceScript: "If today is the day, start near and start small. You don't need a crisis... or a referral. Call the Mental Health Authority line: oh-eight-hundred, six seven eight, six seven eight. It's toll-free, from any network. Or walk into your nearest health centre and say you'd like to talk to someone. Bring three lines of notes: how long you've felt this... how it affects your days... what you want help with. And in immediate danger, call one-one-two or get to the nearest hospital. Today counts.",
    art: "chat-bubbles",
    motion: "loop",
    source: "Mental Health Authority of Ghana (free line). Emergency 112.",
  },
  {
    id: "why-we-snap",
    theme: "why-we-react",
    title: "Why we snap or shut down",
    point: "When the brain senses threat, the body can fight, flee, freeze, or fawn. Snapping, running, going blank, or people-pleasing may all be the same alarm, not a character flaw.",
    why: "Naming the response makes it less mysterious and gives you a moment to choose what happens next.",
    steps: [
      "Notice the body signal: hot face, tight chest, raised voice, or going numb.",
      "Name it silently: \"My alarm is on. This is a threat response.\"",
      "Buy time: slow your exhale, put both feet on the floor, and delay the next sentence.",
      "Afterwards, repair: \"I reacted strongly. I'm sorry. Can we try that again?\"",
    ],
    ifYou: "If you go from calm to snapping, or blank and silent, faster than you can explain.",
    voiceScript: "When your brain senses a threat... your body picks a survival move. Fight... flight... freeze... or fawn. That can look like snapping... running... going blank... or agreeing to everything. It is not a character flaw. It is an alarm. So notice the signal. Hot face... tight chest... raised voice... or going numb. Name it silently: my alarm is on. Then buy time. Slow your exhale. Put both feet on the floor. Delay the next sentence. And afterwards, repair. I reacted strongly. I am sorry. Can we try that again? That is how the alarm loses its grip.",
    art: "overwhelmed",
    source: "Standard stress-response education, with WHO stress guidance (R21). Educational, not a diagnosis.",
  },
  {
    id: "why-we-avoid",
    theme: "why-we-react",
    title: "Why we avoid things that scare us",
    point: "Avoiding a feared thing brings relief fast, so the brain learns that avoidance worked. The relief is real, but it teaches the fear to grow.",
    why: "The way out is usually a small, repeated step toward the fear, not waiting to feel completely ready.",
    steps: [
      "Write down the thing you're avoiding and what you fear will happen.",
      "Make one step so small it feels almost silly: open the email, walk past the room.",
      "Stay with the discomfort for 60 seconds instead of escaping it.",
      "Repeat, and let the fear learn from experience.",
    ],
    ifYou: "If you keep postponing the call, the assignment, or the conversation, and the dread grows each day.",
    voiceScript: "Avoiding something scary works... for a moment. The relief is real. But your brain learns: that worked. So the fear grows. Maybe you postpone the call... the assignment... the conversation. Each time, the dread gets heavier. The way out is not waiting to feel ready. It is a small step toward the fear. Write down what you are avoiding. Make the first step almost silly. Open the email. Walk past the room. Then stay with the discomfort for sixty seconds. Repeat. The fear learns from experience, not from a pep talk.",
    art: "worry-ideas",
    source: "WHO anxiety guidance (R15). Educational, not a diagnosis.",
  },
  {
    id: "why-we-withdraw",
    theme: "why-we-react",
    title: "Why low mood looks like distance or anger",
    point: "Low mood drains energy and interest. Cancelling, sleeping more, or sounding irritable can look like rudeness, but it is often exhaustion and shame.",
    why: "Seeing the symptom behind the behaviour makes it easier to respond with support instead of blame.",
    steps: [
      "Check the basics: sleep, food, water, daylight.",
      "Send one low-pressure message: \"I'm not okay today. No need to fix it.\"",
      "Offer specific company rather than asking them to organise it.",
      "If low mood or withdrawal lasts two weeks or more, encourage a health centre visit.",
    ],
    ifYou: "If someone you care about has gone quiet, or you have, and nobody knows what to say.",
    voiceScript: "Low mood does not always look like crying. Sometimes it looks like cancelling plans... sleeping more... or snapping at the people closest to you. That can seem like rudeness. Often it is exhaustion and shame. If this is you, check the basics. Sleep. Food. Water. Daylight. Send one low-pressure message: I am not okay today. No need to fix it. If it is someone you care about, offer specific company. Walk with me at five? Do not ask them to organise it. And if the low mood or withdrawal lasts two weeks or more, encourage a health centre visit.",
    art: "low-mood",
    motion: "young-person",
    source: "WHO depression guidance (R14). Educational, not a diagnosis.",
  },
  {
    id: "why-we-cope",
    theme: "why-we-react",
    title: "Why we cope in ways that cost us",
    point: "Alcohol, overwork, scrolling, gambling, or isolation can be attempts to escape pain. They may help for an hour, then add a new problem.",
    why: "The behaviour makes sense as coping, even when it stops helping. Shame keeps it hidden; curiosity makes it changeable.",
    steps: [
      "Name what the behaviour helps you avoid: loneliness, failure, memories, boredom.",
      "Choose one lower-cost swap for tonight: a walk, a call, a shower, a meal.",
      "Tell one person the honest version, without defending it.",
      "If you need more to feel okay, or stopping feels dangerous, get professional help.",
    ],
    ifYou: "If you notice you're doing more of something lately, and it leaves you emptier.",
    voiceScript: "Alcohol... overwork... scrolling... gambling... isolation. They can all be ways to escape pain. And they work for an hour. Then they add a new problem. That does not make you weak. It makes you human. So get curious, not ashamed. Name what the behaviour helps you avoid. Loneliness? Failure? Memories? Boredom? Then choose one lower-cost swap for tonight. A walk. A call. A shower. A meal. Tell one person the honest version. And if you need more to feel okay, or stopping feels dangerous, get professional help. Coping can change.",
    art: "loop",
    motion: "loop",
    source: "WHO substance use guidance (R20); general coping guidance.",
  },
  {
    id: "depression",
    theme: "mental-health-issues",
    title: "Depression: more than a bad day",
    point: "Depression can bring weeks of low mood or loss of interest, along with changes in sleep, appetite, energy, focus, or movement. It is a health condition, not laziness.",
    why: "It is treatable. Naming what is happening can make it easier to ask for help early.",
    steps: [
      "Note how long it has lasted and how it affects work, study, or relationships.",
      "Tell one trusted person and book a health centre or counselling visit.",
      "Keep one small routine: food, water, sleep, daylight.",
      "If you have thoughts of harming yourself, call 0800 678 678 or 112 now.",
    ],
    ifYou: "If the heaviness has lasted most days for two weeks or more, and it is changing how you live.",
    voiceScript: "Depression is more than sadness. It can bring weeks of low mood... loss of interest... changes in sleep... appetite... energy... focus... or movement. It is a health condition. Not laziness. Not a character flaw. And it is treatable. So note how long it has lasted. Notice how it affects work... study... relationships. Tell one trusted person. Book a health centre or counselling visit. Keep one small routine: food... water... sleep... daylight. And if you have thoughts of harming yourself, call the Mental Health Authority on oh-eight-hundred, six seven eight, six seven eight. Or one-one-two. Today counts.",
    art: "low-mood",
    motion: "breath-lows",
    source: "WHO depression fact sheet (R14), checked 21 Oct 2026. Educational, not a diagnosis.",
  },
  {
    id: "anxiety-disorders",
    theme: "mental-health-issues",
    title: "Anxiety: when the alarm stays on",
    point: "Anxiety becomes a health issue when worry, fear, or avoidance is intense, lasts, and gets in the way of daily life. Panic can feel physical and frightening; new or worrying physical symptoms should be checked.",
    why: "Anxiety is treatable, and avoiding everything feeds it. Small steps and support help.",
    steps: [
      "Write down what you avoid because of fear.",
      "Practise one small exposure with a safe person.",
      "Use slow exhales; reduce caffeine and sleep debt.",
      "If panic keeps returning or you stop normal activities, seek professional help.",
    ],
    ifYou: "If worry or panic is shrinking your world, and you are arranging life around it.",
    voiceScript: "Anxiety becomes a health issue when the alarm will not switch off. When worry... fear... or avoidance is intense... lasts... and gets in the way of daily life. Panic can feel physical. Racing heart... tight chest... dizziness. It is frightening. It is not usually dangerous. Still, if physical symptoms are new or worrying, get checked. And anxiety is treatable. Write down what you avoid because of fear. Practise one small exposure with a safe person. Use slow exhales. Reduce caffeine and sleep debt. And if panic keeps returning, or you stop normal activities, seek professional help. Small steps and support help.",
    art: "worry-ideas",
    motion: "breathe",
    source: "WHO anxiety disorders fact sheet (R15), checked 21 Oct 2026. Educational, not a diagnosis.",
  },
  {
    id: "trauma-ptsd",
    theme: "mental-health-issues",
    title: "Trauma: when the past stays present",
    point: "After a frightening or violent event, the body can stay on guard. Flashbacks, nightmares, numbness, or avoiding reminders are common. This is not weakness.",
    why: "Trauma can heal with safety and support; you do not have to retell everything to deserve help.",
    steps: [
      "Focus on present safety and one grounding routine.",
      "Tell a trusted person what helps and what does not.",
      "Ask for trauma-informed care; you can say no to details you do not want to share.",
      "If symptoms persist or you feel unsafe, contact a professional or the helpline.",
    ],
    ifYou: "If the danger is over, but your body still reacts as if it is happening now.",
    voiceScript: "After a frightening or violent event... the body can stay on guard. Flashbacks. Nightmares. Numbness. Avoiding reminders. Feeling jumpy or detached. These are common trauma responses. Not weakness. Not madness. Trauma can heal with safety and support. Focus on present safety. Keep one grounding routine. Tell a trusted person what helps and what does not. Ask for trauma-informed care. You can say no to details you do not want to share. And if symptoms persist, or you feel unsafe, contact a professional or the helpline. You do not have to retell everything to deserve help.",
    art: "safety-net",
    source: "WHO post-traumatic stress disorder fact sheet (R16), checked 21 Oct 2026. Educational, not a diagnosis.",
  },
  {
    id: "bipolar",
    theme: "mental-health-issues",
    title: "Bipolar disorder: highs and lows",
    point: "Bipolar disorder involves episodes of low mood and periods of unusually high energy, irritability, or reduced need for sleep. It is not the same as ordinary mood swings.",
    why: "Professional assessment matters because treatment is different from ordinary low mood.",
    steps: [
      "Track mood, sleep, and energy for a few weeks.",
      "Avoid stopping or starting medicines without a clinician.",
      "Plan early warning signs with someone you trust.",
      "If someone is unsafe or not sleeping for days, seek urgent help.",
    ],
    ifYou: "If mood shifts are extreme, last days or longer, and sleep changes with them.",
    voiceScript: "Bipolar disorder is not ordinary mood swings. It involves episodes of low mood... and periods of unusually high energy... irritability... or a much smaller need for sleep. The shifts can last days or longer. They can affect judgement... money... relationships... safety. Professional assessment matters, because treatment is different from ordinary low mood. Track mood... sleep... and energy for a few weeks. Do not stop or start medicines without a clinician. Plan early warning signs with someone you trust. And if someone is unsafe, or not sleeping for days, seek urgent help.",
    art: "progress-path",
    source: "WHO bipolar disorder fact sheet (R17), checked 21 Oct 2026. Educational, not a diagnosis.",
  },
  {
    id: "ocd",
    theme: "mental-health-issues",
    title: "OCD: when thoughts get stuck",
    point: "OCD involves unwanted intrusive thoughts and rituals or checking that try to reduce the fear. It is not just liking things tidy.",
    why: "The cycle is treatable, and shame keeps people silent. The right therapy helps.",
    steps: [
      "Name the loop: thought → fear → ritual → brief relief.",
      "Delay one ritual by two minutes; notice the fear peak and fall.",
      "Ask for CBT with exposure and response prevention.",
      "Do not force a person to stop all rituals at once; get support.",
    ],
    ifYou: "If a thought keeps returning and a ritual gives only brief relief, then the cycle starts again.",
    voiceScript: "OCD is not just liking things tidy. It involves unwanted intrusive thoughts... and rituals or checking that try to reduce the fear. Maybe a thought keeps returning. Maybe you wash... count... check... or ask for reassurance. The ritual gives brief relief. Then the cycle starts again. That is exhausting. And it is treatable. Name the loop: thought... fear... ritual... relief. Delay one ritual by two minutes. Notice the fear peak... and the fall. Ask for CBT with exposure and response prevention. Do not force someone to stop all rituals at once. Get support.",
    art: "worry-ideas",
    motion: "worry-locate",
    source: "WHO obsessive-compulsive disorder fact sheet (R18), checked 21 Oct 2026. Educational, not a diagnosis.",
  },
  {
    id: "psychosis",
    theme: "mental-health-issues",
    title: "Psychosis: when reality feels different",
    point: "Psychosis can involve hearing or seeing things others do not, unusual beliefs, confusion, or withdrawal. It can be frightening, and it is treatable.",
    why: "Early help matters. A person is not \"mad\" or dangerous because of psychosis.",
    steps: [
      "Stay calm and reduce noise and crowds.",
      "Do not argue about the experience; ask what would help them feel safe.",
      "Contact a health professional or the helpline; if there is danger, call 112.",
      "Do not leave someone alone if they are confused or at risk.",
    ],
    ifYou: "If someone's reality seems to have shifted, and they are frightened or acting unusually.",
    voiceScript: "Psychosis can involve hearing or seeing things others do not... unusual beliefs... confusion... or withdrawal. It can be frightening for the person and for those around them. A person is not mad. Not dangerous because of psychosis. And it is treatable. Stay calm. Reduce noise and crowds. Do not argue about the experience. Ask what would help them feel safe. Contact a health professional or the helpline. If there is danger, call one-one-two. And do not leave someone alone if they are confused or at risk. Early help matters.",
    art: "community",
    source: "WHO schizophrenia fact sheet (R19), checked 21 Oct 2026. Educational, not a diagnosis.",
  },
  {
    id: "substance-use",
    theme: "mental-health-issues",
    title: "Substance use: when coping becomes dependence",
    point: "Substance use becomes a health issue when drinking or drug use is hard to control, causes harm, or is needed to get through the day. It is not a moral failure.",
    why: "Treatment works, and some withdrawals can be dangerous. Getting help is safer than stopping alone.",
    steps: [
      "Notice the pattern: what you use, how often, what it replaces.",
      "Do not stop alcohol or sedatives suddenly without medical advice.",
      "Call the helpline or a health centre for options.",
      "Tell one person who can check in without shame.",
    ],
    ifYou: "If you need more to feel okay, or you keep promising to cut down and cannot.",
    voiceScript: "Substance use becomes a health issue when drinking or drug use is hard to control... causes harm... or is needed to get through the day. It is not a moral failure. It is a health issue. And treatment works. Notice the pattern. What do you use? How often? What does it replace? Do not stop alcohol or sedatives suddenly without medical advice. Some withdrawals can be dangerous. Call the helpline or a health centre for options. Tell one person who can check in without shame. Getting help is safer than stopping alone.",
    art: "take-a-break",
    motion: "loop",
    source: "WHO substance use fact sheet (R20), checked 21 Oct 2026. Educational, not a diagnosis.",
  },
  {
    id: "eating-disorders",
    theme: "mental-health-issues",
    title: "Eating disorders: when food becomes fear or shame",
    point: "Eating disorders involve serious changes in eating, body image, and control. They can affect anyone, not just young women, and are not vanity.",
    why: "They are treatable, and early help reduces harm. Comments about weight or appearance do not help.",
    steps: [
      "Tell one trusted person and a health professional.",
      "Ask for a medical check; restriction and purging can affect the heart and electrolytes.",
      "Avoid diet talk, scales, and body comments around the person.",
      "If there is fainting, chest pain, or severe restriction, seek urgent care.",
    ],
    ifYou: "If food, weight, or control has become a daily source of fear or shame.",
    voiceScript: "Eating disorders involve serious changes in eating... body image... and control. They are not vanity. They can affect anyone... not just young women. And they are treatable. Early help reduces harm. Tell one trusted person and a health professional. Ask for a medical check, because restriction and purging can affect the heart and electrolytes. Avoid diet talk... scales... and body comments around the person. And if there is fainting... chest pain... or severe restriction, seek urgent care. Food should not be a daily source of fear or shame.",
    art: "you-matter",
    motion: "young-person",
    source: "WHO mental disorders fact sheet (R13), checked 21 Oct 2026. Educational, not a diagnosis.",
  },
];

export function cardsByTheme(themeId: ThemeId): TopicCard[] {
  return cards.filter((c) => c.theme === themeId);
}

export function cardById(id: CardId): TopicCard | undefined {
  return cards.find((c) => c.id === id);
}
