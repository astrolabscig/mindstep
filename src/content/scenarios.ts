import type { scenarioSchema } from "./schema";
import type { z } from "zod";

export type Scenario = z.infer<typeof scenarioSchema>;

/**
 * Six branching scenarios. Every branch terminates at an id whose node
 * sends further choices to an END marker; the graph is validated at
 * import time in `src/content/index.ts` and again in unit tests.
 *
 * Design rules encoded here:
 * - `best` and `acceptable` both continue the story with learning;
 *   every path ends in the same constructive end summary.
 * - `poor` choices loop back through a consequence node that lets the
 *   user try again. Feedback is instructive, never shaming.
 */
export const scenarios: Scenario[] = [
  {
    id: "friend-withdrawn",
    title: "Ama has gone quiet",
    summary: "A close friend has stopped turning up and now avoids you.",
    context:
      "Ama, a 20-year-old level-200 student, stopped attending study group three weeks ago. Her texts became replies of one word. Today you saw her buying food alone at 2pm; she said 'I'm fine' with a flat face and walked off.",
    moduleId: "supportive-communication",
    minutes: 6,
    nodes: [
      {
        id: "n1",
        narration:
          "You knock on her door in the hall. She opens midway and says she's busy.",
        prompt: "You have one minute. What do you do?",
        choices: [
          {
            id: "push",
            text: "'Ama, you have to talk to me. What is wrong with you?'",
            quality: "poor",
            strengths:
              "You care enough to act today, which many people never do, and care is the raw material support needs.",
            limitations:
              "'What is wrong with you' frames her silence as a defect. A pressured question tends to produce a shorter exit, not a longer conversation.",
            consequence:
              "Ama says 'I said I'm busy' and closes the door. You hear nothing for two more days.",
            next: "retry-1",
          },
          {
            id: "notice-open",
            text: "'I've noticed you've not come to study group. No pressure. I left you two jars of water and a note. I'm around if you want to talk.'",
            quality: "best",
            strengths:
              "You noticed a specific change out loud, removed pressure, and left something concrete that says 'you are not invisible to me'.",
            limitations:
              "Leaving the initiative with her may still feel hard for her; withdrawal can delay her response whatever you say.",
            consequence:
              "Ama says nothing, but 40 minutes later texts: 'Thanks for the water. Sorry about today.' The conversation hasn't opened yet, but it hasn't closed either.",
            next: "n2",
          },
          {
            id: "wait-outside",
            text: "Say nothing heavy, just 'Okay, see you around' and step away fast",
            quality: "acceptable",
            strengths:
              "You respect her space in the moment, which avoids escalating a small contact into a confrontation.",
            limitations:
              "You had a real opening and passed it without naming the change you've noticed. Weeks of silence can follow an unspoken window.",
            consequence:
              "Ama seems relieved. You feel a small pang of having left things unsaid, and plan to come back better prepared next time.",
            next: "return-1",
          },
        ],
      },
      {
        id: "retry-1",
        narration:
          "The door is shut. You promised yourself a better second move.",
        prompt: "Same moment. What do you do instead?",
        choices: [
          {
            id: "leave-note",
            text: "Slide a small note under the door: 'I'm not pushing. When you're ready, I'm in room 21 whenever.'",
            quality: "best",
            strengths:
              "Repair without pressure: you acknowledged that your first push didn't land and re-opened contact without demanding a response.",
            limitations:
              "You still don't know why she's withdrawn, the door is open, not the conversation.",
            consequence:
              "Ama texts that evening: 'sorry for closing the door. it's just heavy lately.'",
            next: "n2",
          },
          {
            id: "keep-pressing",
            text: "Knock again and repeat that she must open up",
            quality: "poor",
            strengths: "Persistence comes from care and shows you did not give up on her.",
            limitations:
              "Repeated pressure converts worry into surveillance in her eyes. Silence usually grows sheltered, not shared.",
            consequence:
              "No reply at all this time. The gap widens and you feel frustrated rather than helpful.",
            next: "retry-1",
          },
        ],
      },
      {
        id: "return-1",
        narration:
          "You left without naming the change. Two days later you text Ama.",
        prompt: "What do you send?",
        choices: [
          {
            id: "honest-text",
            text: "'No pressure, but I miss you at group, and I noticed you've been distant. I'm here whenever.'",
            quality: "best",
            strengths:
              "You named the specific change you noticed, expressed missing rather than accusing, and offered availability without a deadline.",
            limitations:
              "A text can be easier to ignore than a face. Expect a reply on her timeline, not yours.",
            consequence:
              "Ama replies hours later: 'thank you. can we talk after lectures on Friday?'",
            next: "n2",
          },
          {
            id: "casual-text",
            text: "'Hey, all good? 😊'. Keep it light, don't mention anything",
            quality: "poor",
            strengths: "You protected the relationship from awkwardness in the short term.",
            limitations:
              "The 'all good?' closed the very conversation you came for; light small talk cannot carry a heavy truth",
            consequence: "Ama replies 'yes, all good 🙂'. The silence continues another week.",
            next: "honest-text-fix",
          },
        ],
      },
      {
        id: "honest-text-fix",
        narration:
          "The light reply did not open anything. You decide to try one more.",
        prompt: "What do you send now?",
        choices: [
          {
            id: "second-attempt",
            text: "'I hear you. If anything is heavy lately, I'm around. No pressure, whenever.'",
            quality: "best",
            strengths: "You acknowledged her reply instead of ignoring it, and re-offered without pressure.",
            limitations: "Texts move slowly; you may need to decode her real availability.",
            consequence: "She replies on Friday: 'it's a lot lately. can we sit after lectures?'",
            next: "n2",
          },
          {
            id: "drop-it",
            text: "Leave it. She clearly doesn't want to engage",
            quality: "poor",
            strengths: "You read her short reply as distance and respected apparent boundaries.",
            limitations:
              "Withdrawn people commonly stop reaching out first. Waiting alone often means never. Dropping it turns a temporary pause into a lost friendship during her hardest month.",
            consequence: "The silence extends. At month end you hear from a mutual friend that Ama stopped attending lectures entirely. You feel regret that you interpreted her silence as indifference.",
            next: "end",
          },
        ],
      },
      {
        id: "n2",
        narration:
          "Friday. Ama talks: everything at home got hard and she has been dreading opening her day.",
        prompt: "How do you respond to this opening?",
        choices: [
          {
            id: "listen",
            text: "'That sounds really heavy. Since when? I'm listening.'",
            quality: "best",
            strengths:
              "You let her lead, asked an open question, reflected rather than fixed. This is the listening skill in real use.",
            limitations:
              "You now carry something heavy without knowing where help exists yet. Prepare a next step, not just sympathy.",
            consequence:
              "Ama talks for ten minutes without interruption. At the end she says, 'I haven't said that out loud to anyone.'",
            next: "n3",
          },
          {
            id: "advise",
            text: "'You should honestly just go see a counsellor, that's not normal.'",
            quality: "poor",
            strengths: "You correctly sense she may deserve real support and remembered services exist.",
            limitations:
              "'That's not normal' judges her before she has even finished. Advice before listening converts a conversation into a referral order.",
            consequence:
              "Ama goes quiet: 'maybe you're right. anyway.' She ends the meeting early.",
            next: "advise-repair",
          },
          {
            id: "compare",
            text: "'Honestly I had it worse last semester. Waters will pass.'",
            quality: "poor",
            strengths: "You tried to normalise her pain by sharing experience.",
            limitations: "Comparing pain competes for attention instead of listening to hers.",
            consequence:
              "Ama shifts the conversation to your story. She says 'okay' twice and leaves.",
            next: "compare-repair",
          },
        ],
      },
      {
        id: "advise-repair",
        narration: "She ended the meeting early. You realise you jumped too quickly.",
        prompt: "Do you repair now or let her breathe?",
        choices: [
          {
            id: "repair",
            text: "Text: 'Sorry. I moved to advice before hearing you. Whenever you want to talk more, I'll listen first.'",
            quality: "best",
            strengths: "Honest repair protects the relationship and names your own error without demanding forgiveness.",
            limitations: "Repair is an offer; whether she re-opens remains her choice.",
            consequence:
              "She never replies that week, but Friday after next she calls you, talking longer than before.",
            next: "n3",
          },
          {
            id: "leave-it",
            text: "Give her space indefinitely",
            quality: "poor",
            strengths: "Space is real; after a rough exchange, breathing room helps.",
            limitations:
              "'Indefinitely' usually becomes never; an unrepaired rupture plus withdrawal is a bad combination.",
            consequence:
              "Weeks pass. Ama goes a whole month without lectures and you only learn later.",
            next: "end",
          },
        ],
      },
      {
        id: "compare-repair",
        narration: "She left the conversation without a plan. You want to fix this.",
        prompt: "What now?",
        choices: [
          {
            id: "return-to-her",
            text: "'Earlier I made it about me. That was wrong. What has it been like for you?'",
            quality: "best",
            strengths: "You re-centred her experience and apologised for hijacking without self-flagellation.",
            limitations: "You still can't give her the fix she may want; be ready for slow honesty.",
            consequence: "Ama talks. Ten minutes of listening, then: 'So what do I even do?'",
            next: "n3",
          },
          {
            id: "drop-it-2",
            text: "Let it go; she didn't seem to want talking anyway",
            quality: "poor",
            strengths: "You noticed her disengagement and considered her comfort.",
            limitations:
              "Disengagement after a hijack is disappointment, not consent to abandon. Dropping it now reinforces her feeling unheard.",
            consequence: "Ama shelves everything for another month.",
            next: "end",
          },
        ],
      },
      {
        id: "n3",
        narration:
          "Ama says: 'So what do I even do about all of it? I don't want to worry home.'",
        prompt: "How do you support her next step?",
        choices: [
          {
            id: "offer-options",
            text: "'A few options: the free national line 0800 678 678 is confidential. Or the health centre here. I can sit with you if you call.'",
            quality: "best",
            strengths:
              "You offered real, verified options with hers in control, and company, not pressure. This is 'know your next step' working as designed.",
            limitations:
              "Options still cost her courage; don't mistake offering for the moment everything is fixed.",
            consequence:
              "Ama asks one clarifying question, saves the number, and says she'll think about it. She agrees to sit with you again on Monday.",
            next: "end",
          },
          {
            id: "do-it-for-her",
            text: "Call the helpline yourself while she watches",
            quality: "poor",
            strengths: "You modelled the step and reduced the fear of the unknown.",
            limitations:
              "A helpline call made 'for' her removes her agency exactly when recovery starts with owning the first contact.",
            consequence:
              "The adviser asks to speak with Ama; Ama freezes and hands the phone back. Nothing lands.",
            next: "agency-fix",
          },
          {
            id: "promise-fix",
            text: "'Don't tell anyone. I'll fix it for you personally.'",
            quality: "poor",
            strengths: "Loyalty and protectiveness are obvious in this offer.",
            limitations:
              "You cannot be her professional support, and secrecy isolates her. Boundaries protect both of you.",
            consequence:
              "A week later nothing has changed; Ama senses you're overwhelmed and stops confiding to spare you.",
            next: "agency-fix",
          },
        ],
      },
      {
        id: "agency-fix",
        narration: "That approach didn't carry her forward. The moment is still open.",
        prompt: "Try again. What's the better move?",
        choices: [
          {
            id: "restore-agency",
            text: "'The step is yours, whenever it feels possible. I'll be beside you either way.'",
            quality: "best",
            strengths: "You returned ownership of the step to her while keeping company. Presence and agency together.",
            limitations: "She may still need time; 'beside you' means waiting well, not waiting forever.",
            consequence: "Ama says 'okay. maybe Monday.' Monday, she dials with you in the room.",
            next: "end",
          },
        ],
      },
      {
        id: "end",
        narration: "Whatever the exact path, the conversation here mattered because someone treated Ama's silence as a signal, not a mood.",
        prompt: "You've reached the end of this scenario.",
        choices: [],
      },
    ],
    startNodeId: "n1",
    end: {
      principles: [
        "Withdrawal that lasts weeks deserves a specific, gentle naming, not silence and not pressure.",
        "Listen first, repair honestly, keep her agency in every option; presence outperforms fixing.",
        "Offer verified, real options (free line, nearby care) without doing it 'for' her.",
      ],
      nextStep: "Practise listening once more in another conversation, or open the support directory to see what calling in your region actually involves.",
      nextStepLink: "/scenarios",
    },
  },
  {
    id: "myth-rebuttal",
    title: "Uncle Kwame has strong opinions",
    summary: "A family conversation turns into a debate about mental illness.",
    context:
      "At a family gathering, your uncle Kwame says loudly: 'That neighbour's son is bipolar because he's cursed. Keep your children away before they catch it. Hospital can't help such things.' Silence settles over the room. Heads turn toward you.",
    moduleId: "myths-stigma",
    minutes: 5,
    nodes: [
      {
        id: "n1",
        narration:
          "Everyone expects a response. Your uncle looks certain; the room looks uncomfortable.",
        prompt: "You respond by…",
        choices: [
          {
            id: "confront",
            text: "'That's ignorance. Mental illness isn't a curse and it isn't contagious.'",
            quality: "acceptable",
            strengths:
              "Your facts are correct: neither dangerousness nor contagion holds up, and knowing them matters.",
            limitations:
              "Leading with 'ignorance' attacks the person instead of the claim, and attacked elders defend rather than learn.",
            consequence:
              "Uncle Kwame bristles. Several cousins nod privately but nobody speaks again; the room gets colder rather than wiser.",
            next: "repair-1",
          },
          {
            id: "respect-evidence-offer",
            text: "'I used to wonder that too. Interesting thing. Treatment for these conditions entered the national insurance in 2024, and they run a free line people actually call. I'll show you after we eat if you like.'",
            quality: "best",
            strengths:
              "You modelled respectful engagement, offered evidence with a personal touch, and closed with a concrete action, not a defeat.",
            limitations:
              "Changing a belief at a family table takes repetition. Don't expect a single sentence to convert a conviction.",
            consequence:
              "Kwame grunts, but later at the table he asks, 'Which line again?' Two cousins lean in to hear. You share the number 0800 678 678 with them.",
            next: "n2",
          },
          {
            id: "silence",
            text: "Eat quietly, the moment will pass",
            quality: "poor",
            strengths:
              "You kept family peace today, and sometimes a moment is simply not your fight.",
            limitations:
              "Silence lets dangerousness and contagion myths stand unchallenged. Children absorb them as fact. The moment passed, the myth didn't.",
            consequence:
              "The topic moves on. Two weeks later a cousin quietly asks you whether mental illness is contagious.",
            next: "silence-repair",
          },
        ],
      },
      {
        id: "silence-repair",
        narration:
          "Your cousin's question gives you a smaller, less pressured conversation.",
        prompt: "What do you begin with?",
        choices: [
          {
            id: "cousin-teach",
            text: "'No. You can't catch it like measles. It's a health condition, like high blood pressure.'",
            quality: "best",
            strengths:
              "A simple, accurate analogy with a familiar condition; one-on-one beats public correction for a young person.",
            limitations:
              "One conversation doesn't replace the family myth; plant the number in more minds.",
            consequence:
              "She asks follow up questions. You offer to show her the support directory so she knows what exists locally.",
            next: "n2",
          },
          {
            id: "cousin-shrug",
            text: "'Something like that. Hard to explain'",
            quality: "poor",
            strengths: "You avoided overwhelming a young person with too much detail.",
            limitations:
              "Evasion confirms her fear; the myth travels in unexplained silences.",
            consequence:
              "She starts avoiding the neighbour's son. The myth now has a second holder in your family.",
            next: "end",
          },
        ],
      },
      {
        id: "repair-1",
        narration:
          "Facing a bristling uncle, you may repair by softening without conceding.",
        prompt: "How do you continue?",
        choices: [
          {
            id: "soften",
            text: "'Sorry, that came out harsh. What I meant is, hospital treatment genuinely improved. Shall I show you the free line?'",
            quality: "best",
            strengths:
              "You repaired tone without abandoning the evidence. Humility with backbone is the combination that persuades elders.",
            limitations:
              "Correction still costs you standing today; persistence over years is the realistic frame.",
            consequence:
              "Kwame half-smiles: 'Okay. Show me that thing.' The line 0800 678 678 lands on two family phones.",
            next: "n2",
          },
          {
            id: "double-down",
            text: "Repeat that he is ignorant, louder",
            quality: "poor",
            strengths: "You refused to let a harmful myth ride without challenge.",
            limitations:
              "Volume is not persuasion. Public humiliation of an elder typically locks the myth in with his supporters.",
            consequence:
              "Two uncles join his side. Myth correction just became a family feud instead of education.",
            next: "end",
          },
        ],
      },
      {
        id: "n2",
        narration:
          "Later, one cousin messages: 'That was bold. My roommate has been struggling and some of us whispered about it being spiritual.'",
        prompt: "What do you send?",
        choices: [
          {
            id: "offer-path",
            text: "'Conditions with medical sides deserve medical care too, and families that pray faithfully still combine the two. Would you like the number and how a first call works?'",
            quality: "best",
            strengths:
              "You respected the spiritual framing while connecting care, and offered the practical 'how', which the MHA free line makes easy.",
            limitations:
              "You can offer; you can't make the first call for her, and readiness has its own clock.",
            consequence:
              "She asks two more questions and saves the number. Her roommate hears about the helpline from a friend, not from a lecture.",
            next: "end",
          },
          {
            id: "dismiss-spiritual",
            text: "'Forget spiritual talk. Just send her to a hospital.'",
            quality: "poor",
            strengths: "The medical advice itself is not wrong.",
            limitations:
              "Dismissing belief breaks trust before the practical help lands; 1,705 religious facilities operating under MHA guidance show how central those pathways are.",
            consequence:
              "She answers politely and never messages again. The roommate learns nothing of the line.",
            next: "end",
          },
        ],
      },
      {
        id: "end",
        narration: "Myths travel in families. So do corrections, when they respect.",
        prompt: "You've reached the end of this scenario.",
        choices: [],
      },
    ],
    startNodeId: "n1",
    end: {
      principles: [
        "Correct myths with the sequence respect → specific evidence → concrete offer; humiliation locks myths in.",
        "Contagion and dangerousness have no evidence behind them; one calm analogy beats a loud argument.",
        "Faith and medicine can work together. Many people draw strength from both.",
      ],
      nextStep: "Open the myths cards to see how to answer with evidence and a concrete offer.",
      nextStepLink: "/topics#myths",
    },
  },
  {
    id: "exam-overwhelm",
    title: "Kingsley's four-week spiral",
    summary: "A course-mate is drowning in academic pressure during the semester.",
    context:
      "It's week 9. Kingsley, your course-mate, failed two quizzes, missed a lab report, and tells you at the rear of the lecture hall: 'Honestly, I don't even think I belong here.' He has not slept properly in the hostel since fees week.",
    moduleId: "stress-coping",
    minutes: 6,
    nodes: [
      {
        id: "n1",
        narration:
          "He speaks half-jokingly, as youth often codes real weight as banter.",
        prompt: "How do you take it?",
        choices: [
          {
            id: "joke-back",
            text: "'Man, who does belong here? 😂 Come, let's go and chop.'",
            quality: "acceptable",
            strengths:
              "You kept the connection warm and refused to exile him from your company during a rough patch.",
            limitations:
              "Matching his code as a joke keeps the real weight invisible; nobody hears 'are you okay?' tonight.",
            consequence:
              "He laughs, and you both survive the afternoon. The missed sleep and the two weeks of dread continue unnoticed.",
            next: "end",
          },
          {
            id: "check-in",
            text: "'That didn't sound like a joke all the way down. How are things actually, since fees week?'",
            quality: "best",
            strengths:
              "You heard the coded distress and gently rejected the disguise without embarrassing him in public.",
            limitations:
              "You will then have to be ready to hold whatever he shares. Listening is the commitment you've just made.",
            consequence:
              "His smile fades a notch. 'Honestly? I've been sleeping 4 hours. Labs, fees, quizzes, it's piling.' You both shift to the corridor.",
            next: "n2",
          },
          {
            id: "lecture-advice",
            text: "'You need discipline. Wake earlier and read; no excuses.'",
            quality: "poor",
            strengths: "You meant well and pointed at something he can influence (routine).",
            limitations:
              "'No excuses' reads as judgement of effort at a moment when his actual complaint is overload plus debt stress. Shame deepens, sleep suffers more.",
            consequence:
              "Kingsley nods silently, and you don't hear him mention struggling again for three weeks.",
            next: "lecture-repair",
          },
        ],
      },
      {
        id: "lecture-repair",
        narration: "He fell silent. You want to repair the moment.",
        prompt: "What do you do?",
        choices: [
          {
            id: "apologize",
            text: "'That sounded like pressure on top of pressure. Sorry. How are things really?'",
            quality: "best",
            strengths: "You owned the mis-step and re-opened with a real question.",
            limitations: "He may not re-open the same day. Repair takes patience.",
            consequence: "He exhales: 'Honestly? Overwhelmed.' The corridor conversation happens.",
            next: "n2",
          },
          {
            id: "let-it-go",
            text: "Move on; maybe he'll bounce back on his own",
            quality: "poor",
            strengths: "Giving space avoids crowding a proud friend.",
            limitations:
              "The joke-disguise plus your 'no excuses' has taught him concealment works. When it cracks, it may crack badly.",
            consequence:
              "Three weeks later he misses two consecutive deadlines and stops attending readings entirely.",
            next: "end",
          },
        ],
      },
      {
        id: "n2",
        narration:
          "In the corridor, Kingsley lists it: fees debt, failed quizzes, 4 hours of sleep, and a voice telling him he doesn't belong.",
        prompt: "What do you offer first?",
        choices: [
          {
            id: "triangle",
            text: "'Okay, three things. Tonight: sleep, non-negotiable. Tomorrow: we draft the recovery plan for the lab report. Third: let's find out whether the counselling unit can help with the fees pressure too.'",
            quality: "best",
            strengths:
              "You split an unmanageable cloud into three concrete, sequenced actions, starting with the body. This is the stress advice in action.",
            limitations:
              "Plans require follow-through; the friendship is now carrying a schedule.",
            consequence:
              "He says it feels less mountain-like written down. You get a shared note started.",
            next: "n3",
          },
          {
            id: "all-on-you",
            text: "'Don't worry. I'll write the lab report for you personally.'",
            quality: "poor",
            strengths: "Solidarity instead of distance; you offered before being asked.",
            limitations:
              "Doing his work doesn't address sleep or belonging, invites academic-integrity trouble, and quietly tells him he cannot carry his own load.",
            consequence:
              "Night one the report gets written; the debt, the 4 hours of sleep and the belonging-voice stay exactly the same.",
            next: "fix-repair",
          },
          {
            id: "minimize",
            text: "'Everybody struggles. You'll be fine. Just push through.'",
            quality: "poor",
            strengths: "Normalising struggles has a kernel of truth: most students hit a wall.",
            limitations:
              "'Just push through' adds pressure while removing permission to name it. Exactly how overload calcifies.",
            consequence:
              "He nods, thanks you, withdraws. You see him sleeping even less two weeks later.",
            next: "fix-repair",
          },
        ],
      },
      {
        id: "fix-repair",
        narration: "The quick offer didn't actually address the pile.",
        prompt: "Try again. What's the better move?",
        choices: [
          {
            id: "redo-triangle",
            text: "'Let me try that again properly. Sleep first. Then plan. Then help for the fees pressure.'",
            quality: "best",
            strengths: "You recognised the pattern and corrected course substantially without giving up.",
            limitations:
              "He might doubt your timeline given the earlier chat; expect to be asked twice.",
            consequence: "He lets you draft the three-step note on both phones.",
            next: "n3",
          },
        ],
      },
      {
        id: "n3",
        narration:
          "A week later, the shared note shows sleep has improved, but the fees pressure is still eating him and he says the 'I don't belong' voice hasn't left.",
        prompt: "What do you do with the part the note cannot fix?",
        choices: [
          {
            id: "offer-services",
            text: "'The fees part needs people with authority. Let's check the counselling unit together. The 'I don't belong' part deserves support too, and there might be options. I can go with you.'",
            quality: "best",
            strengths:
              "You separated the solvable (schedule) from the structural (fees, belonging). And you offered to accompany, not to hand over.",
            limitations:
              "It may take more than one visit; walking with someone is a series, not an event.",
            consequence:
              "Wednesday, you both go. He speaks for himself; you stay in the waiting area. He comes out with an appointment card and mentions the voice out loud for the first time to a professional, because he was there.",
            next: "end",
          },
          {
            id: "wait-more",
            text: "'Give it time; things will settle after exams.'",
            quality: "poor",
            strengths: "Patience is a virtue in some moments; exams will pass.",
            limitations:
              "'After exams' is the classic deferral that lets structural stress (fees, belonging) run unchecked into worse.",
            consequence:
              "Exam week arrives with 4 hours of sleep and the voice still there. The recovery plan now has a hole where the structural part should have been.",
            next: "redo-services",
          },
        ],
      },
      {
        id: "redo-services",
        narration: "'After exams' didn't treat anything structural.",
        prompt: "Do you return to the structural part?",
        choices: [
          {
            id: "return-structure",
            text: "'Exams won't fix this part. Can we still try the counselling unit this week?'",
            quality: "best",
            strengths: "You returned with initiative, fixed the deferral pattern before it calcified, and kept his agency.",
            limitations: "He may resist until after exams; persistence means gentle re-offering, not pressure.",
            consequence: "He agrees. The visit happens. The structural part enters the plan at last.",
            next: "end",
          },
        ],
      },
      {
        id: "end",
        narration:
          "Kingsley's spiral was not a discipline problem, and knowing that requires more than good intentions.",
        prompt: "You've reached the end of this scenario.",
        choices: [],
      },
    ],
    startNodeId: "n1",
    end: {
      principles: [
        "Coded distress ('I don't belong here') is worth hearing underneath the joke; ask the real question gently.",
        "Split unmanageable piles into sequence. Body first, plan second, structural help third; accountability over rescuing.",
        "Structural pressures (fees, belonging) need structural help. Services, not silence; go with them, never instead of them.",
      ],
      nextStep: "Open the cards on feeling overwhelmed and low mood, then try another conversation.",
      nextStepLink: "/topics#feeling-overwhelmed",
    },
  },
  {
    id: "persistent-distress",
    title: "Adwoa says she might not be okay",
    summary: "A classmate shares that distress has been going on far longer than you realised.",
    context:
      "After a lecture, Adwoa, always the performer who energised the class group chat, texts: 'Don't laugh, but I don't think I've been okay for about two months now. I've been telling everyone I'm fine.'",
    moduleId: "when-to-seek-help",
    minutes: 6,
    nodes: [
      {
        id: "n1",
        narration:
          "Two months is a long time to be quietly carrying something heavy. Her text asked for an answer.",
        prompt: "How do you respond to the text?",
        choices: [
          {
            id: "dismiss",
            text: "'Lol, you'll be fine. You're the strongest person I know!'",
            quality: "poor",
            strengths:
              "You meant to reassure her rather than make it heavy, and strength-affirming is affectionate in tone.",
            limitations:
              "Two months of concealment deserves two minutes of listening, not a compliment. 'You'll be fine' mimics the exact line she was afraid of.",
            consequence:
              "She reads it, puts the phone down, and the 'I'm fine' pattern continues unchanged for another month.",
            next: "dismiss-repair",
          },
          {
            id: "two-month-listen",
            text: "'Thank you for telling me. Two months of carrying that alone sounds heavy. Say more when you're ready. I'm here.'",
            quality: "best",
            strengths:
              "You honoured the disclosure, reflected the duration, and left pace entirely to her. Curiosity without interrogation.",
            limitations:
              "Being present through a long conversation is a commitment; you'll need patience, not quick comfort.",
            consequence:
              "She opens with how mornings have felt, then the smaller details. Missed meals, skipped classes. You mostly agree and ask what else.",
            next: "n2",
          },
          {
            id: "rush-help",
            text: "'You need professional help NOW. I'm booking you an appointment for tomorrow morning.'",
            quality: "acceptable",
            strengths:
              "Your instinct is right: two months of concealed distress deserves professional attention, and speed matters.",
            limitations:
              "'NOW' plus booking 'for' her removes the agency she'll need in the room itself. A frightened first visit works better owned.",
            consequence:
              "She calls you, half-laughing, half-shaky: 'You've booked me?! I'm scared, but… okay.' The visit happens, but she talks less than she could have.",
            next: "agency-check",
          },
        ],
      },
      {
        id: "dismiss-repair",
        narration: "Her reply arrives two hours later: 'ok, thanks', the words of concealment again.",
        prompt: "Try again. What do you send?",
        choices: [
          {
            id: "reopen",
            text: "'I gave you a compliment when you gave me something real. I'm sorry. Tell me more if you want.'",
            quality: "best",
            strengths:
              "You acknowledged your mis-step explicitly and re-offered the listening space.",
            limitations:
              "Repair mid-conversation is harder; expect her to test whether you'll hold it better this time.",
            consequence:
              "A long voice note arrives. You pay full attention and reply with reflections rather than fixes.",
            next: "n2",
          },
        ],
      },
      {
        id: "agency-check",
        narration: "You booked the visit 'for' her. She went. Shaky, not talkative.",
        prompt: "Looking ahead, what changes how you support next time?",
        choices: [
          {
            id: "own-the-visit",
            text: "'Next time, you choose the practitioner, the day, and come with your own questions. I'll be with you but it's yours.'",
            quality: "best",
            strengths:
              "You named the correction. Her ownership of care. That is person-centred support in practice.",
            limitations: "She may rely on you at first; being an originator of steps takes practice.",
            consequence:
              "At the next visit, she books the next slot herself. Different posture walking out.",
            next: "n2",
          },
          {
            id: "keep-driving",
            text: "Keep managing everything for her. She's clearly fragile",
            quality: "poor",
            strengths:
              "Your protectiveness is easy to read as love, and stability during someone's worst weeks genuinely matters.",
            limitations:
              "Care that manages everything slowly communicates 'you cannot'. Long-term recovery needs her competence the product is designed to build.",
            consequence:
              "Two months later she waits for your text before calling. The voice-recovery loop stalls.",
            next: "end",
          },
        ],
      },
      {
        id: "n2",
        narration:
          "Adwoa talks for a full evening. At the end she asks the question: 'Is this the kind of thing people even get help for?'",
        prompt: "How do you answer?",
        choices: [
          {
            id: "hope-evidence",
            text: "'People absolutely do. And in one district study, shame was the thing that most delayed people asking. You've already done the hard asking, with me.'",
            quality: "best",
            strengths:
              "You told her the truth about shame being the barrier (OR 0.53 in one district study), and re-labelled her disclosure as the hard part already done.",
            limitations:
              "You quoted research casually; be ready for her next question to be practical, where and how much.",
            consequence:
              "She exhales. 'Okay. Where would I even go?', the phrase that changes courses.",
            next: "n3",
          },
          {
            id: "vague-reassure",
            text: "'Don't stress. People get help all the time. You'll be fine.'",
            quality: "poor",
            strengths: "Reassurance carries calm and avoids overwhelming her with data.",
            limitations:
              "'All the time' without evidence, plus no next place, still leaves the door vague, and vagueness is what has hidden her for two months.",
            consequence:
              "She says 'hmm, okay.' The conversation drifts to assignments that night.",
            next: "reopen-where",
          },
        ],
      },
      {
        id: "reopen-where",
        narration: "The vague answer left 'where would I go?' unanswered.",
        prompt: "Give her something she can actually hold.",
        choices: [
          {
            id: "concrete-where",
            text: "'Concretely: the MHA free line 0800 678 678, free and confidential, or your nearest health centre. Both are real; I've checked.'",
            quality: "best",
            strengths: "You supplied two verified, dated options, one she can hold tonight.",
            limitations: "Verification dates change, so the dates in the support directory matter for her own next check.",
            consequence: "She saves the number that evening, still not dialled, but held.",
            next: "end",
          },
        ],
      },
      {
        id: "n3",
        narration: "'Where would I even go?'. She asks, real fear underneath.",
        prompt: "What do you offer?",
        choices: [
          {
            id: "offer-both",
            text: "'Two real options: the free line 0800 678 678 (confidential, free) or a health-centre visit. You can call from your car tonight or visit tomorrow. I'll go with you to either.'",
            quality: "best",
            strengths: "Two verified options, her timing, her choice. Plus accompanying company, not chauffeur.",
            limitations: "Real fear often remains between decision and dialling; that's normal.",
            consequence:
              "She says 'let me try the line first.' Two nights later she calls you after: 'They were kind. I have a place to visit on Monday.'",
            next: "end",
          },
          {
            id: "one-only",
            text: "'Just go to the big hospital in Accra tomorrow, full stop.'",
            quality: "poor",
            strengths:
              "Concrete destination beats vague words, and care there exists.",
            limitations:
              "One distant option makes help heavy; the line is free and tonight-ready. Shrinking her menu becomes another map she must conquer while afraid.",
            consequence:
              "'Tomorrow in Accra' feels like Everest and she defers it. The concealment stretches on for another two months.",
            next: "offer-both-fix",
          },
        ],
      },
      {
        id: "offer-both-fix",
        narration: "The single big-hospital plan was too heavy for now.",
        prompt: "Open the options back up. What do you redo?",
        choices: [
          {
            id: "two-options",
            text: "'Let me give you a lighter first step: the free line, anytime today. Hospital can come later if needed. Same number as before.'",
            quality: "best",
            strengths:
              "You lowered the first threshold, which is exactly what the evidence says people stalling at shame need.",
            limitations: "She may still defer; plan to sit with her when she dials.",
            consequence: "That evening from her car, she dials. The call lasts twelve minutes.",
            next: "end",
          },
        ],
      },
      {
        id: "end",
        narration:
          "Adwoa carried a heavy secret for two months. What changed it was not your perfect words but your patience, honest repair, and real numbers.",
        prompt: "You've reached the end of this scenario.",
        choices: [],
      },
    ],
    startNodeId: "n1",
    end: {
      principles: [
        "Concealed distress of months deserves real listening before advice, and repair when you misstep.",
        "Name shame as the barrier it demonstrably is; her disclosure was already the hard part.",
        "Offer verified options at her pace and with her agency: the free line and nearby care",
      ],
      nextStep: "Open the getting help cards on what a first visit looks like, or try another conversation before your own next real one.",
      nextStepLink: "/topics#getting-help",
    },
  },
  {
    id: "first-appointment",
    title: "Calling before someone else does",
    summary: "You decide to contact support for the first time, and don't know how.",
    context:
      "You've been carrying low mood and dread for six weeks. You know from MINDSTEP that shame is a barrier, but you have never called any mental health service, and you don't know who to call or what to say.",
    moduleId: "when-to-seek-help",
    minutes: 5,
    nodes: [
      {
        id: "n1",
        narration:
          "It's 8pm. Your phone screen shows the MHA free line 0800 678 678 saved but never dialled.",
        prompt: "What do you do?",
        choices: [
          {
            id: "call-now",
            text: "Call now. 'I've been low for six weeks and I don't know what to ask.'",
            quality: "best",
            strengths:
              "You made the first contact with a low bar on yourself. Honesty about not knowing is exactly what trained first-responders expect and handle.",
            limitations:
              "The call may generate next steps you'll need to act on. Have a pen or note ready.",
            consequence:
              "The responder listens, asks a couple of simple clarifying questions, and shares what nearby options look like. You write down one place and one next day. Nothing is judged; you remain you.",
            next: "n2",
          },
          {
            id: "rehearse-forever",
            text: "Rehearse the 'right words' tonight; call when the script is perfect",
            quality: "poor",
            strengths:
              "Wishing to be heard clearly is thoughtful, not procrastination. Preparation can genuinely help.",
            limitations:
              "'A perfect script' is a myth passports use to delay. The responder meets you where you start, imperfectly and honestly.",
            consequence:
              "Midnight: no script exists that satisfies you. The saved number stays unsaved-in-act for another two nights. Exactly the delay the cards warned about.",
            next: "call-fix",
          },
          {
            id: "search-web",
            text: "Search the web for 'Ghana mental health hotline' instead",
            quality: "acceptable",
            strengths:
              "You took information-seeking seriously, the first practical act in finding services (and how many people actually begin).",
            limitations:
              "Search results mix numbers from unverified directories; some may be wrong. Verification discipline matters. MINDSTEP exists partly to prevent this exact confusion.",
            consequence:
              "You find three numbers of conflicting credibility; two hours vanish in checking. Exhausted, you save the one that appears on the MHA site and delay until tomorrow, verifying it first.",
            next: "verify-first",
          },
        ],
      },
      {
        id: "call-fix",
        narration: "No perfect script arrived. Instead, a simpler truth did.",
        prompt: "What do you change?",
        choices: [
          {
            id: "imperfect-call",
            text: "Dial anyway. 'I don't have the right words; I've been low for six weeks.'",
            quality: "best",
            strengths:
              "You broke the perfection barrier and let the responder carry the structure, which is their role, not yours.",
            limitations:
              "Fast contact means you'll need to write down whatever next steps they give, a note is essential.",
            consequence:
              "The call proceeds far more smoothly than your rehearsal predicted. You end it with one next step written down.",
            next: "n2",
          },
        ],
      },
      {
        id: "verify-first",
        narration:
          "You chose to check what you found rather than call blindly. Verification discipline.",
        prompt: "How do you verify the number?",
        choices: [
          {
            id: "verify-official",
            text: "Confirm against the official MHA site (mha-ghana.com) and check the date, then call",
            quality: "best",
            strengths: "You checked an official, dated source before acting, the exact practice MINDSTEP teaches.",
            limitations: "Verification alone isn't care; the call still needs to happen, and courage is a separate step.",
            consequence:
              "The MHA site confirms 0800 678 678, published on their free call centre page. Your saved number stands. You call in the morning.",
            next: "n2",
          },
          {
            id: "verify-none",
            text: "Pick whichever number answers first",
            quality: "poor",
            strengths:
              "You optimised for speed, which respects how hard the call felt to start.",
            limitations:
              "Unverified numbers risk everything from wrong services to outright fraud. The verification dates on each service exist precisely for this.",
            consequence:
              "The number rings twice and disconnects. You've burned forty minutes and starting courage.",
            next: "end",
          },
        ],
      },
      {
        id: "n2",
        narration:
          "You've had the first call. You have one clue written down: a health centre in your district, and one question you need answered.",
        prompt: "What do you do with this clue?",
        choices: [
          {
            id: "book-and-questions",
            text: "Visit the health centre this week; bring notes on when it started, what changed, what you tried; prepare two questions: 'What happens next?' and 'What does this cost with my NHIS card?'",
            quality: "best",
            strengths:
              "You converted a call into a visit, and a visit into a structure. Notes, questions, insurance card. The prep checklist from the getting help card, in action.",
            limitations:
              "The visit may reference things you'll need to repeat or supplement; a second visit is normal, not failure.",
            consequence:
              "The assessment takes time and patience but produces a plan and a review date. You leave with more clarity than you walked in with.",
            next: "end",
          },
          {
            id: "postpone",
            text: "Wait and see if the low mood passes on its own",
            quality: "poor",
            strengths:
              "Waiting to avoid over-reacting is a reasonable-sounding instinct.",
            limitations:
              "Six weeks did not equal 'passing' yet, and the cards taught that persistence with shrinking functioning is when early attention beats crisis.",
            consequence:
              "Three weeks pass. The dread holds. You call again after it gets harder to summon the courage than it was today.",
            next: "book-fix",
          },
          {
            id: "only-line-forever",
            text: "Keep using the helpline daily instead of visiting care once",
            quality: "poor",
            strengths:
              "The line matters: it's free, confidential, and genuinely supportive. Nothing wrong with using it.",
            limitations:
              "The line is a bridge, not treatment; it guides toward care but does not replace professional assessment.",
            consequence:
              "Support comes, improvement doesn't. The responder themselves nudges: 'Have you been able to visit a facility?'",
            next: "book-fix",
          },
        ],
      },
      {
        id: "book-fix",
        narration: "Waiting quietly kept the clock running.",
        prompt: "Reset. What now?",
        choices: [
          {
            id: "visit-anyway",
            text: "Go this week with notes and two questions",
            quality: "best",
            strengths:
              "You returned to the planned path after deferral, which is harder than doing it first time.",
            limitations: "Time you lost cannot come back, but the visit still works from here.",
            consequence:
              "Same outcome as the disciplined path, one step late. You get a plan and a review date.",
            next: "end",
          },
        ],
      },
      {
        id: "end",
        narration:
          "The first contact was made. Everything after it, including this summary, was easier than the fear predicted.",
        prompt: "You've reached the end of this scenario.",
        choices: [],
      },
    ],
    startNodeId: "n1",
    end: {
      principles: [
        "Perfect scripts are a delay disguise; trained responders meet imperfect, honest first lines.",
        "Verification before action: official dated sources (mha-ghana.com), then dial.",
        "Calls open doors; visits with notes, questions and the NHIS card make the door useful.",
      ],
      nextStep: "Open the getting-help cards. Prepare your own four questions and a trusted person tonight.",
      nextStepLink: "/topics#getting-help",
    },
  },
  {
    id: "worrying-post",
    title: "Kojo's worrying post",
    summary: "A friend's online post suggests he might be in real danger.",
    context:
      "It's 11pm. Kojo, your friend from the fellowship. Posts a two-line status: 'I'm done with everything. Thanks to everyone who tried.' The comments are confused; one says 'kwasia, stop the drama'. Your chest tightens.",
    moduleId: "supportive-communication",
    minutes: 7,
    nodes: [
      {
        id: "n1",
        narration:
          "This is the moment where education meets real risk. MINDSTEP cannot monitor anyone. YOU are the safety net here, with real tools.",
        prompt: "Your first move:",
        choices: [
          {
            id: "call-directly",
            text: "Call his phone immediately. No message, no comment section",
            quality: "best",
            strengths:
              "Voice contact beats deleted-status word games; you reached him directly, personally, tonight. This is exactly the right instinct.",
            limitations:
              "You cannot know in a call what he decides next; safety is a series, not one conversation.",
            consequence:
              "He picks up after the fourth ring, voice flat: 'I'm at home. Sorry, I know that was dramatic.' He is reachable and talking.",
            next: "n2",
          },
          {
            id: "comment-publicly",
            text: "Comment publicly: 'We love you Kojo. Call me now.'",
            quality: "acceptable",
            strengths:
              "You responded fast and publicly claimed him, which tells others to take it seriously too.",
            limitations:
              "A public comment lane is where he is being mocked right now; comments can be filtered away or drowned. Voice is faster and more direct.",
            consequence:
              "Kojo replies 'call you in a bit', and does, after you also call his phone. You got there; the direct line just moved faster.",
            next: "call-fix",
          },
          {
            id: "do-nothing",
            text: "Screenshot it, wait for morning, see if he deletes it",
            quality: "poor",
            strengths:
              "You took it seriously enough to preserve evidence. Better than scroll-past.",
            limitations:
              "Waiting overnight risks the one window when a call changes everything. 'Drama' commenters are not his safety net; you are.",
            consequence:
              "By morning the post is gone. Nobody knows whether the night was safe. He texts you 'nothing happened', the fear you'll never get to check again.",
            next: "call-fix",
          },
        ],
      },
      {
        id: "call-fix",
        narration: "Whatever delayed you, the direct call still comes.",
        prompt: "Make the call now.",
        choices: [
          {
            id: "call-after-all",
            text: "Call his phone right away",
            quality: "best",
            strengths:
              "You closed the gap. Direct voice contact is the fastest, most personal path.",
            limitations: "One call begins safety; it doesn't finish it.",
            consequence: "He answers; the conversation begins.",
            next: "n2",
          },
        ],
      },
      {
        id: "n2",
        narration:
          "He's on the line and talking, though flat and vague: 'just tired of it all, I might sleep an entire week.'",
        prompt: "How do you keep the safety conversation going?",
        choices: [
          {
            id: "direct-ask",
            text: "'I have to ask straight: are you thinking of ending your life tonight?'",
            quality: "best",
            strengths:
              "Asking directly does not plant the idea. Evidence repeatedly shows direct asking reduces risk by opening honesty. You asked the safest possible question.",
            limitations:
              "An answer of 'yes' will need you to act afterwards; be ready for the emergency-helpline step.",
            consequence:
              "Long pause. 'All week I've been thinking about it. I don't want to die a coward.' Honesty enters the room, and with it, a real chance to respond.",
            next: "n3",
          },
          {
            id: "beat-around",
            text: "'Everything okay at home? Exams too close, eh?'",
            quality: "poor",
            strengths: "Concern was gentle and didn't presume the worst.",
            limitations:
              "Side-door questions pass up the direct-open window the moment gives you. Direct asking is protective, not provocative.",
            consequence:
              "'Yeah, exams eh.' The call is soft and vague. Nothing unsafe is confirmed, and nothing safe is confirmed either.",
            next: "direct-ask-fix",
          },
          {
            id: "moralize",
            text: "'Don't do anything stupid. Think of your mother. Suicide is a sin.'",
            quality: "poor",
            strengths:
              "You reached for the strongest moral anchors you know; family and faith genuinely carry many Ghanaians.",
            limitations:
              "Moralising on top of pain adds guilt to shame at the riskiest possible moment. It tends to produce both silence and concealment.",
            consequence:
              "'Yeah. Thanks.' He ends the call within a minute. You don't know his state. The night stretches.",
            next: "direct-ask-fix",
          },
        ],
      },
      {
        id: "direct-ask-fix",
        narration: "The side-door closed the main conversation. There's still a direct door.",
        prompt: "Try again on the call.",
        choices: [
          {
            id: "direct-retry",
            text: "'Straight question, because I care: are you thinking of ending your life?'",
            quality: "best",
            strengths: "You returned to direct asking, which opens the honesty the conversation needs to keep him safe tonight.",
            limitations: "You still need next steps lined up after the answer.",
            consequence: "He answers honestly this time; the real safety conversation begins.",
            next: "n3",
          },
        ],
      },
      {
        id: "n3",
        narration:
          "He says 'yes, all week.' What comes next matters more than any phrase in this app.",
        prompt: "Your next moves, tonight:",
        choices: [
          {
            id: "call-mha",
            text: "Stay on the phone with him; call 0800 678 678 together on second mode, or 112 if he's in immediate danger",
            quality: "best",
            strengths:
              "You used the verified crisis pathway precisely, and you stayed present. This is exactly what the cards teach: real numbers, real speed, presence.",
            limitations:
              "The emergency services are not a substitute for your continued follow-through tomorrow.",
            consequence:
              "The MHA line connects; the responder takes over the safety conversation professionally. You stay on one end of the call until he's settled. 112 is not needed tonight, but it is noted for the future.",
            next: "end",
          },
          {
            id: "solo-hero",
            text: "Stay up with him privately; don't involve anyone or any service tonight",
            quality: "poor",
            strengths:
              "Loyalty is real, and presence matters more than anything tonight.",
            limitations:
              "A frightened friend alone cannot responsibly hold what trained responders exist to hold. MINDSTEP is not a monitored service, and neither are you.",
            consequence:
              "Two hours of talking steady him somewhat. He sleeps by 3am. At 10am the following week, a repeat post appears, and the safety margin you could have built never got built.",
            next: "call-mha-fix",
          },
          {
            id: "peer-pressure",
            text: "Post on his wall asking friends to check on him",
            quality: "poor",
            strengths:
              "You activated the community, which sometimes saves people through sheer numbers.",
            limitations:
              "Crowd-sourcing a live risk conversation to a comment feed is not a safety pathway. The two verified numbers exist precisely for this moment.",
            consequence:
              "Dozens of comments arrive; some loving, some mocking. Nobody calls the MHA line and nobody reaches his home. He deletes the post and goes dark.",
            next: "call-mha-fix",
          },
        ],
      },
      {
        id: "call-mha-fix",
        narration: "The night is still open. The verified pathway still exists.",
        prompt: "Reset. Make the safety call.",
        choices: [
          {
            id: "crisis-path",
            text: "Stay with him and call the MHA line together (0800 678 678); 112 if danger is immediate",
            quality: "best",
            strengths:
              "The right numbers, your presence, in the right sequence. This is what 'know your next step' means when it matters most.",
            limitations: "Tomorrow still needs follow-through.",
            consequence:
              "Professional responders engage tonight; you stay present until they've taken over.",
            next: "end",
          },
        ],
      },
      {
        id: "end",
        narration:
          "A post at 11pm is not a mood, it's a moment that needed a person with real numbers. Direct asking, verified lines, your presence.",
        prompt: "You've reached the end of this scenario.",
        choices: [],
      },
    ],
    startNodeId: "n1",
    end: {
      principles: [
        "Direct asking about suicidal thoughts is protective, it opens honesty, it does not plant ideas.",
        "Call, don't comment-track: voice reaches tonight; comment feeds drown.",
        "Point to trained responders (MHA free line 0800 678 678; 112 if immediate), and stay present; you cannot hold this alone.",
      ],
      nextStep: "Open the safety page now and save both numbers to your phone. Then read the cards on talking and helping.",
      nextStepLink: "/safety",
    },
  },
  {
    id: "nametag-problem",
    title: "The labelling game",
    summary: "A group chat starts assigning diagnoses to classmates as jokes.",
    context:
      "In your level group chat, a meme circulates: photos of classmates captioned ' psychotic', 'depressive queen', 'OCD washman'. It's getting laughs. One of the pictured classmates, Yaw, is actively typing and deleting.",
    moduleId: "myths-stigma",
    minutes: 5,
    nodes: [
      {
        id: "n1",
        narration:
          "Humour is how stigma has always travelled in schools. Here it's attaching clinical labels to real faces.",
        prompt: "What do you do in the chat?",
        choices: [
          {
            id: "laugh-along",
            text: "React with 😂 like everyone else",
            quality: "poor",
            strengths:
              "Fitting in socially costs nothing in the moment; many people laugh without meaning any harm.",
            limitations:
              "Stigma spreads exactly this way. Socially as jokes until it structures people's silence. Yaw is watching reactions too.",
            consequence:
              "The meme gets twenty more laughs. Yaw goes quiet in the chat and his voice disappears from group discussions for the rest of the semester.",
            next: "counter-fix",
          },
          {
            id: "post-counter",
            text: "Post: 'Fun game until it's your face. Curable good jokes only, please.' (no lecture, light tone)",
            quality: "acceptable",
            strengths:
              "You countered in the group's own register, fast, without becoming the chat's police officer.",
            limitations:
              "A one-line counter rarely kills a meme; expect pushback or another wave in a day.",
            consequence:
              "Two cousins-like friends react; the meme gets no more upvotes. In DM, Yaw sends: 'thanks for that.'",
            next: "n2",
          },
          {
            id: "long-lecture",
            text: "Write five paragraphs about stigma research and the study statistics",
            quality: "acceptable",
            strengths:
              "You know the evidence. Dangerousness myths, OR data, the works, and you deployed it.",
            limitations:
              "Group-chat register punishes lectures; the meme scrolls past with three 'he's right but this is deep' reactions and no behaviour change.",
            consequence:
              "You feel heard by nobody. Privately, two classmates screenshot it and one mutters 'alright, professor', half-mocking.",
            next: "n2",
          },
        ],
      },
      {
        id: "counter-fix",
        narration:
          "Whatever arrived before, the chat is still open and Yaw is still reading.",
        prompt: "Try again with a register that travels.",
        choices: [
          {
            id: "light-counter",
            text: "Keep it short in the room's own register: 'Fun game until it's your face.'",
            quality: "best",
            strengths:
              "Register discipline, the joke-shaped counter reaches people a lecture can't.",
            limitations: "One line is an opening volley, not a curriculum.",
            consequence: "The stream pauses. Yaw sends you a DM later: 'thanks, man.'",
            next: "n2",
          },
          {
            id: "quiet-dm",
            text: "Say nothing publicly, but DM Yaw directly: 'That game isn't fair to you.'",
            quality: "acceptable",
            strengths:
              "You reached the person actually being harmed and showed him he isn't alone in his reading of the chat.",
            limitations:
              "The joke economy continues for everyone else; stigma in the chat is unchallenged, and Yaw may feel required to hide how much the meme reached him.",
            consequence:
              "He replies 'I appreciate you checking.' The meme still runs its course, but Yaw has one ally in the room.",
            next: "n2",
          },
        ],
      },
      {
        id: "n2",
        narration:
          "Later, Yaw texts privately: 'I actually see someone at the health centre. Please don't tell the group.'",
        prompt: "What do you do with this trust?",
        choices: [
          {
            id: "hold-trust",
            text: "'Thank you for trusting me. It stays between us. Is the centre working for you?'",
            quality: "best",
            strengths:
              "You honoured confidentiality immediately. Professionalism that builds trust, and showed interest in his care rather than his secret.",
            limitations:
              "Holding secrets is work; if his situation ever involves real danger, the safety route (wrongly named as gossip) still matters.",
            consequence:
              "He says the centre works 'mostly'. Relief enters the chat of his texts. You've become someone safe to know.",
            next: "n3",
          },
          {
            id: "spread-relief",
            text: "Tell one close friend only 'in confidence'",
            quality: "poor",
            strengths:
              "Sharing felt like unburdening; one person feels like a small circle.",
            limitations:
              "Confidence decayed to fit is how secrets reach group chats at all. Your circles overlap; his trust was yours alone.",
            consequence:
              "A week later the group chat somehow 'knows'. Yaw stops going to the health centre to avoid being 'found out'. Trust was the treatment load-bearing wall, and it cracked.",
            next: "hold-trust-fix",
          },
          {
            id: "preach-secret",
            text: "'You should tell everyone, that's how destigmatisation works!'",
            quality: "poor",
            strengths:
              "Systemic thinking: visibility does reduce stigma at population level. It's not stupid advice in principle.",
            limitations:
              "Outing someone is not destigmatisation, it's exposure without consent. Visibility must be volunteered, never extracted.",
            consequence:
              "He stops replying to you entirely. His care continues. Hidden again, now without a confidant.",
            next: "hold-trust-fix",
          },
        ],
      },
      {
        id: "hold-trust-fix",
        narration: "Trust was mishandled once. Repair has a narrow door.",
        prompt: "What do you send now?",
        choices: [
          {
            id: "apology",
            text: "Apologise concretely: 'I broke your confidence. That was mine to fail. Is there anything I can do to reduce the harm, or want me out of the group circulation for a while?'",
            quality: "best",
            strengths:
              "Concrete apology names the act, owns it entirely, and offers repair choices to the harmed person, the highest-grade friendship move under these conditions.",
            limitations:
              "Some harm cannot be taken back; apologising well is the floor, not a restore.",
            consequence:
              "Yaw replies days later: 'just stop sharing.' The friendship persists thinner, but persists, and he eventually returns to care.",
            next: "end",
          },
          {
            id: "go-quiet",
            text: "Keep your distance and hope the group chat cycle moves on.",
            quality: "poor",
            strengths:
              "Silence avoids fresh sparks; distance genuinely reduces the chance of compounding the harm this week.",
            limitations:
              "To Yaw, silence reads as confirmation that the leak was no mistake. You withdraw exactly when his trust is at its thinnest.",
            consequence:
              "You avoid an awkward conversation and lose a friendship's depth quietly. He keeps attending care, but tells no one close to him about it, which means he carries it alone.",
            next: "end",
          },
        ],
      },
      {
        id: "n3",
        narration:
          "Trust held. Weeks later the chat resumes jokes, this time, one classmate says 'okay o, we'll retire the meme, it was getting dark anyway.'",
        prompt: "Last move in this scenario:",
        choices: [
          {
            id: "affirm-and-invite",
            text: "'Appreciate that. And if anyone ever deals with real ups and downs, there's a free confidential line some of us know.' (no names, no pressure)",
            quality: "best",
            strengths:
              "You affirmed the group's shift and planted a verified resource without exposing anyone. Community change that respects privacy.",
            limitations:
              "Group norms need reinforcement over months, not one message.",
            consequence:
              "Two classmates save the number quietly. The meme retires. Yaw messages: 'that was well handled.'",
            next: "end",
          },
          {
            id: "declare-victory",
            text: "Declare loudly: 'I changed this group's culture!'",
            quality: "poor",
            strengths:
              "Credit where some is due, the chat did shift, and positive self-narrative keeps changemakers going.",
            limitations:
              "Self-credit re-centres you and can re-energise the very joke economy you countered.",
            consequence:
              "Someone revives the meme purely to test the new vigilante. Culture change resumes where it paused.",
            next: "end",
          },
        ],
      },
      {
        id: "end",
        narration:
          "Group chats are where stigma is both spread and starved, with the right register, the resource, and respect for secrets.",
        prompt: "You've reached the end of this scenario.",
        choices: [],
      },
    ],
    startNodeId: "n1",
    end: {
      principles: [
        "Diagnosis-labelling of real people as jokes is how stigma travels. Counters work best in the room's own register.",
        "Confidence held is care continued; trust is the load-bearing wall of someone else's treatment.",
        "Plant verified resources without exposing anyone; visibility must be volunteered.",
      ],
      nextStep: "Open the myths cards to see how stigma shows up in ordinary places.",
      nextStepLink: "/topics#myths",
    },
  },
];
