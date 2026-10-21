/**
 * MINDSTEP module definitions.
 * Order defines the recommended learning path.
 */
import type { z } from "zod";
import type { moduleSchema } from "./schema";

export const DISCLAIMER =
  "MINDSTEP is educational. It cannot diagnose anyone, and this lesson does not replace assessment by a qualified health professional.";

export type LearningModule = z.infer<typeof moduleSchema>;

export const modules: LearningModule[] = [
  {
    id: "mental-health-fundamentals",
    slug: "fundamentals",
    order: 1,
    title: "Mental health fundamentals",
    summary:
      "What mental health actually is, what affects it, and why an educated community matters.",
    problem:
      "Most people can describe malaria. Very few can describe depression, yet WHO's 2021 assessment found most Ghanaians alive with depression go untreated.",
    estimatedMinutes: 12,
    lessonIds: ["what-is-mental-health", "how-people-learn-recovery"],
    quizQuestionIds: ["q-fund-1", "q-fund-2", "q-fund-3", "q-fund-4"],
  },
  {
    id: "stress-coping",
    slug: "stress-coping",
    order: 2,
    title: "Stress and coping",
    summary:
      "How stress builds, what it does day to day, and coping habits that hold up under real pressure.",
    problem:
      "Stress is treated as normal and ignorable, but unmanaged stress feeds the biggest barriers to seeking help later.",
    estimatedMinutes: 12,
    lessonIds: ["stress-basics", "coping-skills"],
    quizQuestionIds: ["q-stress-1", "q-stress-2", "q-stress-3", "q-stress-4"],
  },
  {
    id: "understanding-anxiety",
    slug: "understanding-anxiety",
    order: 3,
    title: "Understanding anxiety",
    summary:
      "The difference between normal worry and ongoing anxiety, and how education describes the concepts.",
    problem:
      "Worry is routinely called 'overthinking' or mocked as fear, which teaches people not to speak about it.",
    estimatedMinutes: 12,
    lessonIds: ["anxiety-basics", "anxiety-everyday"],
    quizQuestionIds: ["q-anx-1", "q-anx-2", "q-anx-3", "q-anx-4"],
  },
  {
    id: "understanding-depression",
    slug: "understanding-depression",
    order: 4,
    title: "Understanding depression",
    summary:
      "How persistent low mood is understood educationally, and why it is described as treatable.",
    problem:
      "Persistent low mood is often read as weakness or laziness. Misread, it stays hidden, and untreated.",
    estimatedMinutes: 14,
    lessonIds: ["depression-basics", "depression-treatable"],
    quizQuestionIds: ["q-dep-1", "q-dep-2", "q-dep-3", "q-dep-4"],
  },
  {
    id: "myths-stigma",
    slug: "myths-stigma",
    order: 5,
    title: "Mental health myths and stigma",
    summary:
      "The common myths in Ghanaian communities, what evidence says, and how stigma shows up in daily life.",
    problem:
      "In one study of a rural Ghanaian district, stigma touched at least 7 in 10 participants across economic, social and psychological life.",
    estimatedMinutes: 14,
    lessonIds: ["common-myths", "stigma-everyday"],
    quizQuestionIds: ["q-myth-1", "q-myth-2", "q-myth-3", "q-myth-4"],
  },
  {
    id: "supportive-communication",
    slug: "supportive-communication",
    order: 6,
    title: "Supportive communication",
    summary:
      "Listening skills, helpful phrases, unhelpful ones, and the practice of responding, not fixing.",
    problem:
      "Knowing 'stigma is bad' doesn't help you answer a friend at night. Support is a practice skill.",
    estimatedMinutes: 15,
    lessonIds: ["listening-basics", "helpful-phrases"],
    quizQuestionIds: ["q-comm-1", "q-comm-2", "q-comm-3", "q-comm-4"],
  },
  {
    id: "when-to-seek-help",
    slug: "when-to-seek-help",
    order: 7,
    title: "When professional help may be appropriate",
    summary:
      "Signals education can point to, what a first contact looks like, and what it is NOT able to promise.",
    problem:
      "Many people don't know a marker of 'time to ask for help', or fear what professional help involves.",
    estimatedMinutes: 13,
    lessonIds: ["signals-to-seek-help", "first-contact"],
    quizQuestionIds: ["q-help-1", "q-help-2", "q-help-3", "q-help-4"],
  },
  {
    id: "navigating-services-ghana",
    slug: "navigating-services",
    order: 8,
    title: "Navigating mental health services in Ghana",
    summary:
      "Verified national services, primary care after NHIS reform, and questions to ask before visiting.",
    problem:
      "People can't use services they can't find. Verified, dated information is the antidote to 'I don't know where to start'.",
    estimatedMinutes: 13,
    lessonIds: ["ghana-service-map", "practical-steps"],
    quizQuestionIds: ["q-nav-1", "q-nav-2", "q-nav-3", "q-nav-4"],
  },
];

export const moduleMap: Record<string, LearningModule> = Object.fromEntries(
  modules.map((m) => [m.id, m]),
);
