
export const normalizeTags = (tags: string[]) => {
  return [...new Set(tags.map(tag => tag.toLowerCase().trim()))];
};