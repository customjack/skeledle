import { AnatomicalPart } from '@/lib/models/AnatomicalPart';

/**
 * Filter anatomical parts for the guess dropdown.
 * Only matches the start of the official medical name to discourage hints from common names.
 */
export function filterAnatomicalParts(parts: AnatomicalPart[], query: string): AnatomicalPart[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 2) {
    return [];
  }

  return parts.filter(part =>
    part.name.toLowerCase().startsWith(normalizedQuery)
  );
}
