# MINDSTEP — Health References Register

Every substantive health or health-system claim shipped in MINDSTEP content maps to a source below. Access date for all URLs: **2026-10-18**. In-app citations use reference IDs (`R1`–`R10`) defined in `src/content/references.ts`, which carries the same metadata as this register.

## Review standard

A claim may be published when ALL of the following hold:

1. It matches what the cited source actually states (checked at access date).
2. The source is WHO, a Ghanaian public institution, peer-reviewed research, or official national guidance.
3. Where a claim rests on a single-district or single-country study, the in-app text scopes the claim honestly ("in one rural Ghanaian district…", "in WHO's 2021 assessment…").
4. Educational content never implies diagnosis of the reader and never states that a reader "has" a condition.

## Register

### R1 — WHO (2026), *Expanding Universal Health Coverage for Mental Health in Ghana* (case study, SIMH), 1 June 2026
- URL: https://www.who.int/publications/m/item/expanding-universal-health-coverage-for-mental-health-in-ghana--integration-of-services-into-the-national-health-insurance-scheme
- **Claims it supports**
  - Mental health services were included in Ghana's NHIS from 2024 (psychosis, anxiety, bipolar disorder, depression as the initial insured package). → Modules: *navigating-services-ghana*, *when-to-seek-help* ("cost/insurance" points).
  - Before 2024 mental health services were largely financially inaccessible; 1.4% of the government health budget went to mental health. → *navigating-services-ghana*.
  - Stigma, cultural beliefs and limited mental health literacy hinder help-seeking and delay access to care. → *myths-stigma* framing; landing-page problem statement.
  - WHO's 2021 SIMH situational assessment estimated treatment coverage from 0.61% (major depressive disorder) to 33.21% (schizophrenia). → *myths-stigma* ("this is common and largely untreated" — always phrased as WHO's assessment, never as "you probably have…").
  - Psychological distress costs Ghana nearly 7% of GDP per the 2020 Mental Health Investment Case; estimated ROI up to 7:1 for treating depression. → landing page / *mental-health-fundamentals*.
  - Over 870 primary-healthcare providers were mhGAP-trained 2022–2024; 3,000+ completed WHO QualityRights e-training. → *navigating-services-ghana* (that trained primary-care staff exist; "ask at your nearest health centre whether mental health services are offered — more clinics added them after 2024"; phrased with "many"/"increasingly", never "all").
- **Not claimed:** anything about MINDSTEP effectiveness; NHIS coverage of every district facility (MINDSTEP tells users to confirm at the facility).

### R2 — Nazari et al. (2023), *BMC Psychiatry* 23 — systematic review & meta-analysis
- URL: https://pubmed.ncbi.nlm.nih.gov/37667229/ · DOI: 10.1186/s12888-023-05143-7
- **Claims it supports**
  - Web-based education for young people improved mental health literacy knowledge (pooled SMD 0.70, 95% CI 0.16–1.25). → *docs/research.md*; landing-page research section; *mental-health-fundamentals* ("why practise — knowledge alone moves facts reliably").
  - Pooled effects on stigma (SMD −0.20, 95% CI −0.48 to 0.08) and help-seeking intentions/attitudes (SMD 0.48, 95% CI −0.50 to 1.46) were not statistically significant. → the central design argument: education must be paired with practice and navigation; stated in research section on the landing page and in *myths-stigma* ("knowing facts alone rarely changes how we act around others — practice and real contact help"; no statistics surfaced in lesson text).
  - Most included studies were non-randomised with moderate-to-serious risk of bias. → *docs/research.md* limitations.

### R3 — Afriyie et al. (2026), *Cambridge Prisms: Global Mental Health* 13(e8) — Sekyere South District study
- URL: https://doi.org/10.1017/gmh.2025.10118 · https://pmc.ncbi.nlm.nih.gov/articles/PMC12835938/
- **Claims it supports (always scoped: "in a study of one rural Ghanaian district…")**
  - High measured stigma across economic (76.8–80.2%), social (77.1–81.2%) and psychological (71.9–82.8%) dimensions (n=419; Nov 2020–Mar 2021). → *myths-stigma* lesson intro (scoped).
  - Dangerousness stereotype endorsed by 58.7%; fear of casual infection reported by 41.7% of participants. → *myths-stigma* myth cards ("some people believe…a study found…" — descriptive, not universal).
  - Internalized shame (OR 0.53) and structural barriers in healthcare (OR 0.48) most strongly reduced help-seeking odds; 56.3% preferred self-management of emotional problems. → *when-to-seek-help* + scenario feedback copy ("shame is one of the strongest measured reasons people don't seek help — feeling reluctant is common, not a personal failure").
  - Cross-sectional, single-district design is a limitation the lesson text keeps intact ("evidence from one district, and one point in time").

### R4 — WHO AFRO (2022), *WHO AIMS Report on Ghana's Mental Health System (2020)*
- URL: https://www.afro.who.int/sites/default/files/2022-11/WHO%20AIMS%202020%20Report%20on%20Ghana's%20mental%20health%20system.pdf
- **Claims it supports**
  - Ghana has three mental-health hospitals whose services are regulated by the MHA; mental healthcare is integrated into primary healthcare via GHS facilities. → Support Navigator directory structure and *navigating-services-ghana*.
  - The MHA runs a mental health hotline providing crisis support and suicide-prevention services. → *safety page* + Support Navigator helpline entry.
  - 1,705 traditional/faith-based facilities nationwide; MHA has developed guidelines to regulate practice in these facilities. → *myths-stigma* + *navigating-services-ghana* (respectful treatment of faith-based pathways; "seeking spiritual support is common — for many conditions it can be combined with medical care; MHA has published guidelines for faith-based practice").

### R5 — Ghana News Agency (2022), "Mental Health Authority call centre launched"
- URL: https://gna.org.gh/2022/09/mental-health-authority-call-centre-launched/
- **Claims it supports:** the MHA call centre launched September 2022 with the toll-free number **0800 678 678** to provide psychosocial support, including to people with suicidal thoughts. → safety page + navigator entry (status: **verified**, dated 2026-10-18).

### R6 — Mental Health Authority of Ghana, *Annual Report 2022*
- URL: https://mha-ghana.com/wp-content/uploads/2025/03/2022-Annual-Report.pdf
- **Claims it supports:** launch of the MHA call centre and activation of the toll-free line 0800 678 678; the call centre provides toll-free psychological first aid to individuals with suicidal ideation. → safety page (corroborates R5).

### R7 — Mental Health Authority of Ghana, official website (incl. hospitals directory)
- URLs: https://mha-ghana.com/ · https://mha-ghana.com/hospitals/
- **Claims it supports**
  - The three psychiatric hospitals under the MHA: **Accra Psychiatric Hospital, Pantang Hospital, Ankaful Psychiatric Hospital**. → Navigator entries (verified: existence, regulation, contact channel listed by MHA = central toll-free line + info@mha.gov.gh).
  - MHA contact: Authority line 0303 964 878 (website contact block), info@mha.gov.gh. → Navigator "Mental Health Authority (head office)" entry, phone flagged verified-from-official-site with access date.
- **Not claimed:** street-level addresses, opening hours, or facility-specific direct lines (not verifiable at access date → omitted or marked `awaiting verification`).

### R8 — Find a Helpline (independent index), Ghana country page
- URL: https://findahelpline.com/countries/gh
- **Claims it supports:** independent cross-listing of the National Mental Health and Suicide Prevention Helpline (0800 678 678). → corroboration for the helpline's verified status; also listed as an external authoritative directory the user can consult outside MINDSTEP.

### R9 — WHO (2015), *Global standards for quality health-care services for adolescents* (vol. 1)
- URL: https://www.who.int/publications/i/item/9789240011717
- **Claims it supports:** adolescent-competent service principles (confidentiality, accessibility, inclusivity) inform the *when-to-seek-help* lesson's "what to expect from a good first contact" points, and the product's own privacy defaults (minimal data, no sensitive disclosures).

### R10 — WHO (2019), *Guidelines on mental health promotive and preventive interventions for adolescents*
- URL: https://www.who.int/publications/i/item/9789240011854
- **Claims it supports:** the framing that promotive/preventive mental health content should be delivered in accessible, non-clinical language and connected to schools, communities and peers — the basis for the Scenario Lab's peer-centred design and the avoided clinical tone.

### R11 — WCAG 2.2 (W3C) · used for the accessibility engineering target, not a health claim.
### R12 — Nielsen Norman Group, 10 Usability Heuristics · used for the UX audit rubric.

### Teaching-content claims NOT drawn from a single citation (baseline clinical consensus)

Lesson content in *understanding-anxiety* and *understanding-depression* describes widely agreed, plain-language concepts ("anxiety is a normal response that becomes much harder to manage when it persists over time", "depression is a condition that affects mood, thinking and activity and is treatable"). These are consistent with WHO's fact sheets and the cited WHO reports rather than restatements of one study. Lesson text never lists symptoms as a diagnostic checklist; symptom-style examples are always framed as "everyone's experience differs — only a health professional can assess" and are followed by an explicit educational-information disclaimer. Where a specific phrasing leans on WHO's depression/anxiety fact sheets, users see the WHO institutional citation on the lesson's sources list.

## Verification ledger (Support Navigator)

| Service | Status at 2026-10-18 | Evidence |
|---|---|---|
| National Mental Health & Suicide Prevention Helpline — 0800 678 678 | **verified** | R5 (news), R6 (annual report), R4 (WHO AIMS), R7 (MHA site), R8 (independent index) |
| National emergency number — 112 | **verified** | Published national emergency number for Ghana; corroborated on international/NGO safety pages |
| Accra Psychiatric Hospital (Greater Accra) | **verified (existence/regulation)** · direct line `awaiting verification` | R4, R7 |
| Pantang Hospital (Greater Accra) | **verified (existence/regulation)** · direct line `awaiting verification` | R4, R7 |
| Ankaful Psychiatric Hospital (Central) | **verified (existence/regulation)** · direct line `awaiting verification` | R4, R7 |
| Mental Health Authority head office (Accra) | **verified (contact as published on mha-ghana.com)** · address detail `awaiting verification` | R7 |
| Other facilities/directories named online | **not listed** unless verifiable via R4/R7; authoritative external directories linked instead | — |

The directory UI renders each service's verification status, verification date and source link. Re-verification is an administrative workflow (`/admin` → services → re-verify, which appends to `service_verifications`).
