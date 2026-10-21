import type { supportServiceSchema } from "./schema";
import type { z } from "zod";

export type SupportService = z.infer<typeof supportServiceSchema>;

/**
 * Support directory, the verified-data register.
 *
 * Publication rules encoded here:
 * - A `phone` is listed ONLY if it appears on an official/cited source.
 *   The national MHA toll-free line is printed on mha-ghana.com and
 *   corroborated elsewhere, so it is listed once per official channel.
 * - Facility-specific direct lines that appear only on unverified
 *   third-party directories are deliberately ABSENT, not invented.
 * - `address` is null wherever we could not confirm a street address on
 *   an official source. "awaiting-verification" is our honest status,
 *   never a gap hidden behind fiction.
 * - MHA launches & purpose (toll-free line, September 2022, psychosocial
 *   support incl. suicidal ideation): GNA + MHA Annual Report 2022.
 */
export const supportServices: SupportService[] = [
  {
    id: "mha-national-helpline",
    name: "National Mental Health & Suicide Prevention Helpline (MHA)",
    region: "National (all regions)",
    city: null,
    description:
      "Free national call centre run by the Ghana Mental Health Authority. It offers confidential psychosocial support, including psychological first aid for people with suicidal thoughts. Launched in September 2022.",
    types: ["helpline"],
    phone: "0800678678",
    phoneNote: "Free from all networks. Published by the MHA and cross-listed by Find a Helpline.",
    website: "https://mha-ghana.com/",
    address: null,
    costInfo: "Free. Calls cost nothing to the caller.",
    accessibility: "Voice telephone. If the line does not answer, try again later or contact a facility.",
    verification: {
      status: "verified",
      sourceTitle: "MHA call centre launched (Ghana News Agency, 2022) · MHA Annual Report 2022",
      sourceUrl: "https://gna.org.gh/2022/09/mental-health-authority-call-centre-launched/",
      verifiedAt: "2026-10-18",
      note: "Number 0800 678 678 and its purpose (psychosocial support incl. suicidal ideation) confirmed via GNA coverage of the 2022 launch, the MHA 2022 Annual Report, and the MHA website.",
    },
  },
  {
    id: "national-emergency",
    name: "National emergency services",
    region: "National (all regions)",
    city: null,
    description:
      "Ghana's national emergency number for immediate danger to life. Police, fire and ambulance dispatch. Use it when someone is in immediate danger.",
    types: ["emergency"],
    phone: "112",
    phoneNote: "National emergency number; works on mobile networks.",
    website: null,
    address: null,
    costInfo: "No charge for emergency calls.",
    accessibility: "Voice telephone.",
    verification: {
      status: "verified",
      sourceTitle: "National emergency number (published national number; corroborated by international safety listings)",
      sourceUrl: "https://en.wikipedia.org/wiki/112_(emergency_telephone_number)",
      verifiedAt: "2026-10-18",
      note: "112 is the published national emergency number for Ghana. Verified purpose only: immediate danger. Not a counselling line.",
    },
  },
  {
    id: "mha-head-office",
    name: "Mental Health Authority head office",
    region: "Greater Accra",
    city: "Accra",
    description:
      "The regulator and coordinator of Ghana's mental health system. Publishes service directories, facilities guidance and mental health promotion programmes.",
    types: ["directory", "helpline"],
    phone: "0303964878",
    phoneNote: "Authority line as published on mha-ghana.com. For support, use the free line 0800 678 678.",
    website: "https://mha-ghana.com/",
    address: "Old Race Course Road, Accra (as published on the MHA website)",
    costInfo: "Office contact; service costs depend on the facility.",
    accessibility: "Voice telephone and email (info@mha.gov.gh).",
    verification: {
      status: "verified",
      sourceTitle: "Mental Health Authority of Ghana. Official website",
      sourceUrl: "https://mha-ghana.com/",
      verifiedAt: "2026-10-18",
      note: "Contact line, email and address reference verified against the MHA website at access date.",
    },
  },
  {
    id: "accra-psychiatric-hospital",
    name: "Accra Psychiatric Hospital",
    region: "Greater Accra",
    city: "Accra",
    description:
      "Ghana's leading specialist psychiatric hospital, regulated by the Mental Health Authority. It provides psychiatric care, occupational therapy, and rehabilitation. It is now a teaching hospital, and was the first under the MHA to receive HeFRA accreditation (2022 annual report).",
    types: ["hospital"],
    phone: "0800678678",
    phoneNote: "Central published MHA contact line. We do not list a direct line for this hospital because we could not verify one.",
    website: "https://mha-ghana.com/hospitals/",
    address: null,
    costInfo: "Public facility; from 2024, NHIS coverage includes care for depression, anxiety, psychosis and bipolar disorder.",
    accessibility: null,
    verification: {
      status: "verified",
      sourceTitle: "Mental Health Authority. Hospitals directory",
      sourceUrl: "https://mha-ghana.com/hospitals/",
      verifiedAt: "2026-10-18",
      note: "Existence, role, and MHA regulation verified. We could not confirm a street address or direct line, so we left them out.",
    },
  },
  {
    id: "pantang-hospital",
    name: "Pantang Hospital",
    region: "Greater Accra",
    city: "Accra (Pantang)",
    description:
      "One of Ghana's three specialist psychiatric hospitals, regulated by the Mental Health Authority. It offers psychiatric care, occupational therapy, and rehabilitation.",
    types: ["hospital"],
    phone: "0800678678",
    phoneNote: "Central published MHA contact line. We could not verify a direct line for this hospital.",
    website: "https://mha-ghana.com/hospitals/",
    address: null,
    costInfo: "Public facility; from 2024, NHIS coverage includes care for depression, anxiety, psychosis and bipolar disorder.",
    accessibility: null,
    verification: {
      status: "verified",
      sourceTitle: "Mental Health Authority. Hospitals directory",
      sourceUrl: "https://mha-ghana.com/hospitals/",
      verifiedAt: "2026-10-18",
      note: "Existence, role, and MHA regulation verified. We could not confirm an address or direct line, so we left them out.",
    },
  },
  {
    id: "ankaful-psychiatric-hospital",
    name: "Ankaful Psychiatric Hospital",
    region: "Central",
    city: "Ankaful (near Cape Coast)",
    description:
      "Specialist psychiatric and general outpatient services in Ghana's Central Region. Established in 1965 and regulated by the Mental Health Authority. Accepts referrals from across the country.",
    types: ["hospital"],
    phone: "0800678678",
    phoneNote: "Central published MHA contact line. We could not verify a direct line for this hospital.",
    website: "https://mha-ghana.com/hospitals/",
    address: null,
    costInfo: "Public facility; from 2024, NHIS coverage includes care for depression, anxiety, psychosis and bipolar disorder.",
    accessibility: null,
    verification: {
      status: "verified",
      sourceTitle: "Mental Health Authority. Hospitals directory",
      sourceUrl: "https://mha-ghana.com/hospitals/",
      verifiedAt: "2026-10-18",
      note: "Existence, role, and MHA regulation verified. We could not confirm an address or direct line, so we left them out.",
    },
  },
  {
    id: "komfo-anokye-psychiatry",
    name: "Komfo Anokye Teaching Hospital, psychiatric services",
    region: "Ashanti",
    city: "Kumasi",
    description:
      "Ghana's major referral teaching hospital serving the middle and northern belts. It provides clinical services including psychiatry. Mental health staff in local clinics are increasingly trained since the national mhGAP expansion between 2022 and 2024.",
    types: ["hospital", "clinic"],
    phone: null,
    phoneNote: "We could not confirm a direct line at the last review, so we left it blank instead of guessing.",
    website: null,
    address: null,
    costInfo: "Public facility; NHIS coverage applies to insured conditions from 2024.",
    accessibility: null,
    verification: {
      status: "awaiting-verification",
      sourceTitle: "Identity from WHO AIMS report (2020). Direct contact details not yet confirmed",
      sourceUrl: "https://www.afro.who.int/sites/default/files/2022-11/WHO%20AIMS%202020%20Report%20on%20Ghana's%20mental%20health%20system.pdf",
      verifiedAt: "2026-10-18",
      note: "Role as a major referral hospital confirmed through institutional sources. We left out contact details until we can verify them. Check by phone or in person before travelling.",
    },
  },
  {
    id: "findahelpline-index",
    name: "Find a Helpline, Ghana country page (external directory)",
    region: "National (all regions)",
    city: null,
    description:
      "An independent international index of verified helplines. It lists Ghana's national mental health and suicide prevention line. Use it to cross-check availability if MINDSTEP's entries are ever out of date.",
    types: ["directory"],
    phone: null,
    phoneNote: null,
    website: "https://findahelpline.com/countries/gh",
    address: null,
    costInfo: "Free to consult.",
    accessibility: "Website; best on a data connection.",
    verification: {
      status: "verified",
      sourceTitle: "Find a Helpline. Ghana",
      sourceUrl: "https://findahelpline.com/countries/gh",
      verifiedAt: "2026-10-18",
      note: "Independently lists the national helpline 0800 678 678, which supports the MHA sources.",
    },
  },
];
