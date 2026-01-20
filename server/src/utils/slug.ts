/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate a unique slug by appending a number if the slug already exists
 * @param baseSlug - The base slug
 * @param existingSlugFn - Function to check if slug exists
 * @returns A unique slug
 */
export const generateUniqueSlug = async (
  baseSlug: string,
  existingSlugFn: (slug: string) => Promise<boolean>
): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;

  while (await existingSlugFn(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
