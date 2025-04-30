/**
 * Slugifies a string for safe use in filenames and URLs.
 * Example: "John Doe / ACME Inc." -> "john-doe-acme-inc"
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9]+/g, '-')  // Replace non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, '')         // Trim leading/trailing hyphens
    .replace(/-+/g, '-')             // Collapse multiple hyphens
    .toLowerCase();
}
