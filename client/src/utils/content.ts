/**
 * Helper function to get localized content.
 * Phase 1: Returns string content as-is (Hebrew only)
 * Phase 2: Will support multi-language objects like { he: string; en?: string }
 *
 * @param content - Current: string (Hebrew), Future: object with language keys
 * @param language - Language code ('he' or 'en')
 * @returns Localized content string
 */
export function getLocalizedContent(
  content: string | { he: string; en?: string },
  language: string
): string {
  // Currently content is just a string (Hebrew)
  if (typeof content === 'string') {
    return content;
  }

  // Future: content will be an object with languages
  return content[language as 'he' | 'en'] || content.he;
}
