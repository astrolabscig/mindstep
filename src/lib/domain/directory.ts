import type { SupportService, ServiceType } from "@/content/schema";

/**
 * Directory search & filtering. Pure functions, unit tested.
 * Match is case-insensitive across name, description, city and region.
 */
export type ServiceQuery = {
  text?: string;
  region?: string;
  type?: (ServiceType | "all");
  verifiedOnly?: boolean;
};

export function filterServices(services: SupportService[], query: ServiceQuery): SupportService[] {
  const text = query.text?.trim().toLowerCase() ?? "";
  return services.filter((s) => {
    if (query.region && query.region !== "all" && s.region !== query.region) return false;
    if (query.type && query.type !== "all" && !s.types.includes(query.type)) return false;
    if (query.verifiedOnly && s.verification.status !== "verified") return false;
    if (text) {
      const haystack = [s.name, s.description, s.city ?? "", s.region].join(" ").toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  });
}

export function regionsOf(services: SupportService[]): string[] {
  return Array.from(new Set(services.map((s) => s.region))).sort();
}

export function typesOf(services: SupportService[]): ServiceType[] {
  return Array.from(new Set(services.flatMap((s) => s.types))).sort();
}
