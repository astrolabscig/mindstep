# MINDSTEP — Research Brief

Product: **MINDSTEP** — a mental health literacy and support-navigation web platform for Ghana.
Tagline: *Understand your mind. Practise what you learn. Know your next step.*
Prepared for the AXELLEMD programming internship assignment, "Rethinking Health Education" (submission deadline: 16 October 2026).
Last updated: 18 October 2026.

---

## 1. Problem statement

Mental health conditions are common and costly in Ghana, but the large majority of affected people never receive care, and the barriers they face are strongly shaped by **stigma and low mental health literacy** rather than only by service availability.

Specifically:

- Estimated national treatment coverage for priority conditions was extremely low in WHO's 2021 Special Initiative for Mental Health situational assessment — from **0.61% for major depressive disorder to 33.21% for schizophrenia** (WHO, 2026).
- WHO attributes much of the delay in help-seeking to **stigma, cultural beliefs and limited mental health literacy**, in addition to underfunding and an overstretched workforce (WHO, 2026).
- In a rural district community study, stigma prevalence ranged from roughly **72% to 83%** across psychological, social, economic and structural dimensions; **58.7%** endorsed dangerousness stereotypes; **56.3%** preferred to rely on self-management of emotional problems, and **54.9%** saw professional help as a last resort (Afriyie et al., 2026 — Sekyere South District, Ashanti Region).
- In a systematic review of web-based mental health education for 10–25 year olds, interventions **improved mental health literacy knowledge (SMD = 0.70, 95% CI 0.16–1.25) but did not significantly improve stigma (SMD = −0.20, 95% CI −0.48 to 0.08) or help-seeking intentions/attitudes (SMD = 0.48, 95% CI −0.50 to 1.46)** (Nazari et al., 2023).

**The gap:** most existing health-education experiences stop at *presenting information*. That is exactly the level at which the current evidence shows web education working — and the level at which the evidence shows it failing to change behaviour. People learn *facts* about mental health, but stigma and help-seeking — the two outcomes that actually determine whether someone reaches care in Ghana — are not moved by information alone. MINDSTEP is designed to close that specific gap by turning knowledge into practice: understanding → practising supportive responses → knowing a realistic next step, including where to find real services in Ghana.

## 2. Intended audience and use cases

**Primary audience:** young adults and students in Ghana (roughly 16–30), who
- are heavy users of social media where mental health information (and misinformation) circulates,
- are living through their first experiences of academic, employment and financial stress,
- most often encounter mental distress first in *other people* — a friend, roommate, sibling or classmate — before ever consulting a professional.

**Initial use cases**

1. A student notices a friend has withdrawn and doesn't know what to say → practices supportive conversation in a realistic branching scenario → learns concrete phrases and what not to say → learns what "a next step" looks like.
2. A young person has heard conflicting claims online (e.g. "mental illness is spiritual; hospitals can't help") → learns what the evidence says in a Ghanaian context, including the role families of faith play and the limits of the claim → checks their understanding with a short quiz.
3. A person is worried about themselves → learns how mental health concepts are defined educationally, understands clearly that the application cannot diagnose them → prepares questions for a health professional → finds real, verified services (helplines, hospitals) they can contact.
4. A health worker/champion, teacher or campus peer-supporter uses the scenario practice as a reusable training aid.

**Not the audience/use case:** diagnosis, treatment, crisis intervention or emergency monitoring. See `docs/safety-and-privacy.md`.

## 3. Research question

> How should a digital health-education experience for Ghana be designed so that it moves *beyond* presenting information — to practising supportive responses and navigating real services — given that the strongest published evidence shows web-based education improves knowledge but not stigma or help-seeking?

## 4. Evidence summary

### Established evidence (distinguishable from design inference)

- **E1 — System context.** Ghana's mental health services are underfunded and concentrated in three psychiatric hospitals in southern Ghana; Ghana's 2012 Mental Health Law set an ambitious community-based, rights-based framework, and mental health services were included in the National Health Insurance Scheme (NHIS) from 2024 (WHO, 2026).
- **E2 — Treatment gap.** WHO's 2021 SIMH situational assessment estimated treatment coverage between 0.61% (major depressive disorder) and 33.21% (schizophrenia) (WHO, 2026).
- **E3 — Economic argument.** Psychological distress is estimated to cost Ghana nearly 7% of GDP — estimated to exceed the economic burden of malaria — and Ghana's 2020 Mental Health Investment Case estimated up to a 7-Cedi return per 1 Cedi invested in treating depression (WHO, 2026).
- **E4 — Stigma barrier in rural Ghana.** In Sekyere South District (n = 419; patients, caregivers, health workers; Nov 2020–Mar 2021), economic stigma affected 76.8–80.2%, social stigma 77.1–81.2%, and psychological stigma 71.9–82.8% of participants; structural barriers in healthcare (OR = 0.48) and internalized shame (OR = 0.53) most strongly reduced help-seeking odds; combined economic and psychological stigma had a multiplicative effect (OR = 0.41). Misinformation contributed substantially (41.7% feared casual infection transmission; 58.7% endorsed dangerousness stereotypes) (Afriyie et al., 2026).
- **E5 — Web education works for knowledge only.** Web-based educational interventions for young people improved mental health literacy knowledge with a pooled SMD of 0.70 (95% CI 0.16–1.25), with no statistically significant pooled effect on stigma (SMD −0.20) or help-seeking intentions/attitudes (SMD 0.48); most included studies were non-randomised with moderate-to-serious risk of bias (Nazari et al., 2023).
- **E6 — Helpline exists.** The Mental Health Authority of Ghana launched a toll-free national mental health and suicide-prevention call centre in September 2022 (`0800678678`), providing psychosocial support including to people with suicidal thoughts (Ghana News Agency, 2022; MHA Annual Report 2022; WHO AIMS Ghana, 2022). This is published on the MHA website and the number is cross-listed by the independent "Find a Helpline" index. It is therefore included in MINDSTEP's support directory with "verified" status and dated sources.
- **E7 — Service geography.** Mental healthcare is integrated into primary and regional/district healthcare under the Ghana Health Service, in addition to the three psychiatric hospitals (Accra Psychiatric, Pantang, Ankaful), regulated by the Mental Health Authority (WHO AIMS Ghana 2020 report, 2022).

### Design inference (evidence-motivated but not directly tested)

- **D1.** Because information alone demonstrably under-performs on stigma and help-seeking, a product that claims to "solve" mental health education with reading material alone is repeating the known weak pattern. Practice (branching scenarios), personalised review and explicit next-step navigation are hypotheses for *why* MINDSTEP might do better.
- **D2.** Because the dominant feared/actual encounters are interpersonal (E4: verbal abuse 81.2%, family exclusion, dangerousness stereotype), the "practice layer" should train the user's responses *about other people* — not just self-management of the user's own mood. This requires teaching supportive communication as a skill.
- **D3.** Because structural barriers halved help-seeking odds in E4, education that ends in generic "seek help" would ignore the strongest measured barrier; a directory of *real, verifiable* services with visible verification status is a core feature, not an appendix.
- **D4.** Because self-stigma (internalized shame, OR = 0.53) is a leading deterrent, the product's tone must be non-judgmental, non-shaming, and normalise learning about mental health — including treating a "worked answer" in a practice scenario as feedback, not failure.

### Hypotheses requiring future testing

- **H1.** Learners who complete at least one branching scenario retain lesson content better than learners who complete lessons only. (Testable: in-app knowledge-check performance, scenario vs. lesson-only cohort analysis.)
- **H2.** Learners exposed to MINDSTEP's support navigator ("next step" cards appended to every lesson/quiz/scenario) more often report concrete next steps than learners exposed to text-only "seek help" messages. (Requires user studies with validated measures — e.g. ATSPPH-SF — which MINDSTEP does not collect.)
- **H3.** Explainable recommendations (why a lesson is recommended) drive more revisits than opaque ranked lists.

## 5. Evidence limitations

- **Nazari et al. (2023):** pooled results dominated by non-randomised studies (moderate-to-serious risk of bias); outcomes by self-report; short follow-up. Knowledge effect should therefore be read as "consistent signal", not a precise effect size. Their central caution is used directly in our positioning: web education that improves knowledge does not thereby improve stigma or help-seeking.
- **Afriyie et al. (2026):** a single rural district (Sekyere South, Ashanti Region); cross-sectional design cannot establish causation; mixture of patients, caregivers and healthcare workers anonymises group differences; data collected Nov 2020–Mar 2021. **Must not be presented as nationally representative.** MINDSTEP cites it as "evidence from one district" only.
- **WHO (2026):** a programme case study describing system-level reform, not an effectiveness trial of a digital education product; percentages such as the treatment-coverage figures derive from WHO's own cited 2021 assessment and retain their original instrumentation limits.
- **MHA helpline:** verification is of *publication* (MHA site, GNA report, annual report, WHO AIMS, Find a Helpline) — MINDSTEP cannot independently test that the line is live at any moment, and states this plainly in the directory.
- No Ghanaian user research (interviews, surveys, usability tests) was performed for this project; every audience characteristic above is inferred from published sources and must be re-validated with real users. This is a disclosed limitation, and shaping MINDSTEP's *own* evaluation around it is designed in (`docs/limitations.md`).

## 6. Existing approaches and their limitations

| Existing approach | What it does well | Why it is not enough |
|---|---|---|
| Leaflets, campus talks, TV/radio campaigns (MHA/GHS health promotion) | Broad reach; local language familiarity | One-way transmission; no practice; nothing to act on "Tuesday morning when a friend says something worrying" |
| Static health content sites (news portals, NGO pages) | Low-cost, accessible information | Information-only; exactly the model the evidence shows improving knowledge without shifting stigma or help-seeking; often unverifiable sourcing |
| Social media mental health content | Engaging, destigmatising conversation | Mixed quality; myths spread as readily as facts; no structure for beginners; no service navigation |
| International digital therapeutics / mood apps | Clinically evaluated in their home countries | Validated elsewhere, not in Ghana; often implicit "for personal mood management"; rarely map to local services; commercial cost/privacy model |
| Traditional/faith-based healing pathways (1,705 registered facilities nationally per WHO AIMS) | Trusted, accessible community presence | WHO notes care-seeking often starts here; MHA has published practice guidelines; digital literacy education should respect not erase these pathways while credibly pointing to medical care for conditions requiring it |

**The observable gap:** no widely-used, credible, Ghana-specific digital experience pairs (a) plain-language mental health concepts, (b) *practise-the-conversation* scenarios with consequences and feedback, and (c) a verified map of real national services with an honest verified/unverified distinction, plus a transparent educational (never clinical) progress model. That gap is what MINDSTEP occupies.

## 7. Product opportunity

MINDSTEP is an **evidence-informed mental health literacy and support navigation platform** for Ghana, built on the principle:

> **Understand → Practise → Take a next step.**

- **Understand** — eight structured modules with source-cited lessons and embedded knowledge checks.
- **Practise** — a Scenario Lab of branching, consequence-carrying situations (a friend withdraws; someone is overwhelmed; a myth is repeated; someone is considering contacting a professional; a worrying online post) where choices move the story and feedback is non-shaming.
- **Take a next step** — every lesson, quiz and scenario resolves into an optional, concrete action (prepare questions for a provider, identify a trusted person, open the support navigator) rather than a dead end or a promise.
- **Own the progress legitimately** — lesson completion, quiz performance by topic, scenarios practised, review list. Metrics are transparently calculated and explicitly *educational*; no mood scores, no wellness index, no diagnosis.

## 8. What MINDSTEP deliberately does *not* do

- Diagnose, screen for diagnosis, or interpret quiz answers clinically. Quiz scores are described only as educational knowledge indicators, with an explicit statement that they are not clinical risk scores.
- Provide therapy, match users to private practitioners, act as a monitored crisis channel, or auto-detect danger. The safety pathway is a static, always-accessible guidance page with the verified national helpline and emergency number, not a monitoring service.
- Make effectiveness claims. Our own effectiveness is a hypothesis to be tested; `docs/qa-report.md` reports only what was actually measured.
- Replace the valued role of family, faith and community contexts implied by E4/E6; content engages with myths respectfully (e.g. it explains why the "mental illness is contagious" belief is not supported by evidence, and why community trust networks remain part of good pathways to care).

## 9. Evaluation metrics (for future, not yet collected)

Because no user research exists yet, MINDSTEP defines its future evaluation plan rather than claiming results:

1. **Knowledge:** pre/post topic quiz performance (in-app, transparent scoring).
2. **Practice:** scenarios completed to terminal resolution; proportion of second attempts that improve feedback class (H1 diagnostic).
3. **Navigation:** support-navigator searches; actions planned and marked complete (H2 proxy only).
4. **Return:** verified re-visits within 30 days; lesson revisit list usage.
5. **Wellbeing/stigma/help-seeking:** only via an external study with validated instruments (e.g. ATSPPH-SF); not collected in-app.

Product built today measures (1)–(4) honestly, and displays human-readable "how is this calculated?" text for each.

## 10. Bibliography

Access date for all URLs: 2026-10-18 (retrieved 18 October 2026). All sources were retrieved, inspected and are cited with their supporting claim-mapping in `docs/health-references.md`.

1. World Health Organization. *Expanding Universal Health Coverage for Mental Health in Ghana: Integration of Services into the National Health Insurance Scheme* (case study, WHO Special Initiative for Mental Health), published 1 June 2026. https://www.who.int/publications/m/item/expanding-universal-health-coverage-for-mental-health-in-ghana--integration-of-services-into-the-national-health-insurance-scheme (PDF: https://cdn.who.int/media/docs/default-source/mental-health/special-initiative/ghana_case_study_final.pdf). Supports E1, E2, E3.
2. Nazari, A., Garmaroudi, G.R., Rahimi Foroushani, A., Hosseinnia, M., et al. "The effect of web-based educational interventions on mental health literacy, stigma and help-seeking intentions/attitudes in young people: systematic review and meta-analysis." *BMC Psychiatry* 23 (2023). DOI: 10.1186/s12888-023-05143-7. https://pubmed.ncbi.nlm.nih.gov/37667229/. Supports E5.
3. Afriyie, E.K., Brantuo, E.K.N., Ankomah, S.E., Kumah, E., Otchere, G., Adekore, P.W., Amankwah, J.A. "Effects of stigma on help-seeking behavior in mental health: A community-based study in Ghana's Sekyere South District in the Ashanti region." *Cambridge Prisms: Global Mental Health* 13(e8), published online 17 December 2025. DOI: 10.1017/gmh.2025.10118. https://pmc.ncbi.nlm.nih.gov/articles/PMC12835938/. Supports E4.
4. World Health Organization Regional Office for Africa. *WHO Mental Health Atlas–AIMS Report on Ghana's Mental Health System (2020)*, 2022. https://www.afro.who.int/sites/default/files/2022-11/WHO%20AIMS%202020%20Report%20on%20Ghana's%20mental%20health%20system.pdf. Supports E6, E7.
5. Ghana News Agency. "Mental Health Authority call centre launched." 21 September 2022. https://gna.org.gh/2022/09/mental-health-authority-call-centre-launched/. Supports E6 (launch date, toll-free number, purpose).
6. Mental Health Authority of Ghana. *Annual Report 2022*. https://mha-ghana.com/wp-content/uploads/2025/03/2022-Annual-Report.pdf. Supports E6 (call-centre launch, toll-free activation).
7. Mental Health Authority of Ghana. Official website (hospitals directory; contact information). https://mha-ghana.com/ and https://mha-ghana.com/hospitals/. Supports E6 and directory entries in the Support Navigator.
8. Find a Helpline (independent international helpline index). "Helplines in Ghana." https://findahelpline.com/countries/gh. Supports E6 (cross-listing of the national helpline).
9. World Health Organization. *Global standards for quality health-care services for adolescents: a guide to implement a standards-driven approach to improve the quality of health-care services for adolescents* *(vol. 1: Standards and criteria)*, 2015. https://www.who.int/publications/i/item/9789240011717. Supports adolescent-centred service principles used in the design principles of `docs/architecture.md`.
10. World Health Organization. *Guidelines on mental health promotive and preventive interventions for adolescents*, 2019. https://www.who.int/publications/i/item/9789240011854. Supports inclusion of adolescent/young-adult-appropriate framing and the emphasis on schools/communities in lesson framing.
11. W3C. *Web Content Accessibility Guidelines (WCAG) 2.2*, W3C Recommendation. https://www.w3.org/TR/WCAG22/. Supports the engineering accessibility target in `docs/architecture.md`.
12. Nielsen Norman Group. "10 Usability Heuristics for User Interface Design." https://www.nngroup.com/articles/ten-usability-heuristics/. Supports the UX audit checklist in `docs/qa-report.md` (Audit 2).

### Notes on citation integrity

- Every statistic quoted in MINDSTEP content traces to one of the sources above; the mapping lives in `docs/health-references.md`.
- No institutional endorsement is claimed. WHO, MHA, GHS and publishers of the cited studies are not partners or sponsors of this project.
- No service-listing was published as "verified" unless its number/purpose appeared on the Mental Health Authority's own website and could additionally be corroborated by at least one of: GNA news coverage, the MHA annual report, the WHO AIMS report, or the Find a Helpline index. Unverifiable online directories were used only to identify facilities whose basic identity is confirmed (name, region), with their phone/website flagged `awaiting verification` in the application and never shown as verified numbers.

## 11. Delivery-mode research (added 18 October 2026)

After an internal design review found the original lesson pages too dense (long prose, no visuals, no voice), the content *delivery* was rebuilt around three documented patterns. These are **design patterns with supporting literature, not effectiveness claims about MINDSTEP itself** — any claim that they improve outcomes in this product would need the evaluation in section 9.

1. **Micro-learning: one focused unit at a time.** A scoping body of work on micro-learning in health education (e.g. "A microlearning mApp raises health competence: hybrid service design for health education", [PMC4464728](https://pmc.ncbi.nlm.nih.gov/articles/PMC4464728), 2015, and related reviews) consistently associates short, focused mobile units with higher learner satisfaction and improved knowledge over long-form reading. Applied in MINDSTEP as the **Focus mode lesson deck**: each lesson becomes a sequence of single-point cards with a visible progress indicator.
2. **Progressive disclosure: overview first, details on demand.** Nielsen Norman Group's research on progressive disclosure (Shneiderman's mantra; NN/g "Progressive Disclosure", 2018, https://www.nngroup.com/articles/progressive-disclosure/) shows that showing only what is needed for the current decision reduces cognitive load without losing depth. Applied as: every point card shows one attention line; the remaining prose sits behind a single "More on this →" tap; deeper `detail` and `example` layers are already part of the content schema. The full article view is always available (never removed), so heavy readers lose nothing.
3. **Card-deck interaction (Duolingo-style pacing).** The widespread consumer pattern — one idea per screen, big type, a single "Continue" action, progress dots, a hand-authored summary card at the end — is used for pacing. Its benefit here is attention management, not gamification; there are no streaks or rewards.
4. **Voice — bundled offline neural audio (updated 18 October 2026).** The
   Microsoft Edge neural TTS endpoint used earlier rejected synthesis
   (Microsoft tightened its socket auth; the `msedge-tts` library is dead),
   and the machine's only installed device voices are legacy robotic SAPI
   ones. The working, fully-local solution: **Piper** (rhasspy/piper) — an
   offline neural TTS engine — is used *once at build time* by
   `scripts/generate-voice.ts` to render every lesson card to a bundled MP3
   (`public/voice/…`, ~17 MB). At runtime the app plays static files. No
   cloud calls, no API keys, no paid service, and a genuinely natural voice
   (`en_US-amy-medium`, MIT-licensed). Honest boundaries: it is a stock
   voice, not a clone of a real person (cloning needs the person's consent).
   The device speech synthesis remains as a fallback path.
5. **Uniform illustration system.** A single SVG family (one stroke colour, two accent tones, identical geometric composition — see `src/components/ui/illustration.tsx`) provides per-module spot illustrations and per-point cards. Illustrations are decorative-comprehension aids, labelled for screen readers; they deliberately carry no clinical imagery.

**Integrity note:** these choices govern *how existing verified content is presented*; no facts, statistics or citations in the lessons changed. The key line on each card is always the lesson's own first sentence, extracted verbatim by `src/lib/domain/points.ts` (unit-tested), never rewritten by machine.

### §11.1 The topics model (added 19 October 2026)

A full content-lead pass then replaced the course framing in the primary experience:
`/topics` presents **24 self-contained cards across 9 themes** (overwhelm, low mood,
worry, sleep, why we react, mental health issues, talking & helping, myths, getting help)
— free exploration, no sequence, no quizzes or progress mechanics in the flow. The
condition-overview theme was added on 21 October 2026 to close a literacy gap: it
explains mechanisms behind behaviour and gives plain-language overviews of depression,
anxiety, trauma/PTSD, bipolar disorder, OCD, psychosis, substance use and eating
disorders. These are educational, source-backed and explicitly not diagnostic. Cards reuse the same delivery patterns
(§11 items 1–5): one point per card, progressive disclosure via native `<details>`,
bundled Piper audio generated per card by `scripts/generate-voice-cards.ts`
(scripts mirrored to `docs/voice/*.txt`), and one uniform green illustration family.
Full mapping, audit table and expert-review flags: `docs/content-audit.md`,
`docs/illustration-map.md`, `docs/content-gaps.md`. The legacy lesson/quiz routes
remain as documentation of the earlier model and are pending deletion.
