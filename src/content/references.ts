import type { Reference } from "./schema";

/**
 * Source register. Mirrors `docs/health-references.md` claim-to-source mapping.
 * Access date is the date every source was last retrieved and checked.
 */
export const ACCESSED_ON = "2026-10-18";

export const references: Reference[] = [
  {
    id: "R1",
    title:
      "Expanding Universal Health Coverage for Mental Health in Ghana: Integration of Services into the National Health Insurance Scheme",
    institution: "World Health Organization (Special Initiative for Mental Health)",
    year: 2026,
    url: "https://www.who.int/publications/m/item/expanding-universal-health-coverage-for-mental-health-in-ghana--integration-of-services-into-the-national-health-insurance-scheme",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R2",
    title:
      "The effect of web-based educational interventions on mental health literacy, stigma and help-seeking intentions/attitudes in young people: systematic review and meta-analysis",
    institution: "Nazari et al., BMC Psychiatry 23",
    year: 2023,
    url: "https://doi.org/10.1186/s12888-023-05143-7",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R3",
    title:
      "Effects of stigma on help-seeking behavior in mental health: A community-based study in Ghana's Sekyere South District in the Ashanti region",
    institution: "Afriyie et al., Cambridge Prisms: Global Mental Health 13(e8)",
    year: 2026,
    url: "https://doi.org/10.1017/gmh.2025.10118",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R4",
    title:
      "WHO Mental Health Atlas. AIMS Report on Ghana's Mental Health System (2020)",
    institution: "WHO Regional Office for Africa",
    year: 2022,
    url: "https://www.afro.who.int/sites/default/files/2022-11/WHO%20AIMS%202020%20Report%20on%20Ghana's%20mental%20health%20system.pdf",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R5",
    title: "Mental Health Authority call centre launched",
    institution: "Ghana News Agency",
    year: 2022,
    url: "https://gna.org.gh/2022/09/mental-health-authority-call-centre-launched/",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R6",
    title: "Mental Health Authority of Ghana. Annual Report 2022",
    institution: "Mental Health Authority of Ghana",
    year: 2023,
    url: "https://mha-ghana.com/wp-content/uploads/2025/03/2022-Annual-Report.pdf",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R7",
    title: "Mental Health Authority of Ghana. Official website (hospitals directory)",
    institution: "Mental Health Authority of Ghana",
    year: 2026,
    url: "https://mha-ghana.com/hospitals/",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R8",
    title: "Helplines in Ghana (independent helpline index)",
    institution: "Find a Helpline",
    year: 2026,
    url: "https://findahelpline.com/countries/gh",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R9",
    title:
      "Global standards for quality health-care services for adolescents, vol. 1: Standards and criteria",
    institution: "World Health Organization",
    year: 2015,
    url: "https://www.who.int/publications/i/item/9789240011717",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R10",
    title: "Guidelines on mental health promotive and preventive interventions for adolescents",
    institution: "World Health Organization",
    year: 2019,
    url: "https://www.who.int/publications/i/item/9789240011854",
    accessDate: ACCESSED_ON,
  },
  {
    id: "R13",
    title: "Mental disorders",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/fact-sheets/detail/mental-disorders",
    accessDate: "2026-10-21",
  },
  {
    id: "R14",
    title: "Depressive disorder (depression)",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/fact-sheets/detail/depression",
    accessDate: "2026-10-21",
  },
  {
    id: "R15",
    title: "Anxiety disorders",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders",
    accessDate: "2026-10-21",
  },
  {
    id: "R16",
    title: "Post-traumatic stress disorder",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/fact-sheets/detail/post-traumatic-stress-disorder",
    accessDate: "2026-10-21",
  },
  {
    id: "R17",
    title: "Bipolar disorder",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/fact-sheets/detail/bipolar-disorder",
    accessDate: "2026-10-21",
  },
  {
    id: "R18",
    title: "Obsessive-compulsive disorder",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/fact-sheets/detail/obsessive-compulsive-disorder",
    accessDate: "2026-10-21",
  },
  {
    id: "R19",
    title: "Schizophrenia",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/fact-sheets/detail/schizophrenia",
    accessDate: "2026-10-21",
  },
  {
    id: "R20",
    title: "Substance abuse",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/fact-sheets/detail/substance-abuse",
    accessDate: "2026-10-21",
  },
  {
    id: "R21",
    title: "Stress",
    institution: "World Health Organization",
    year: 2026,
    url: "https://www.who.int/news-room/questions-and-answers/item/stress",
    accessDate: "2026-10-21",
  },
];

export const referenceMap: Record<string, Reference> = Object.fromEntries(
  references.map((r) => [r.id, r]),
);
