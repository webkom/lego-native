import { useMemo } from 'react';
import { api } from '../services/api';
import { components } from '../types/schema';

export const useEmojis = () => {
  const { data, ...rest } = api.useQuery('get', '/api/v1/emojis/');
  const emojis = data as { results: components['schemas']['Emoji'][] } | undefined;

  // Group emojis by category
  const groupedEmojis = useMemo(() => {
    if (!emojis) return {};
    return emojis.results.reduce(
      (acc, emoji) => {
        if (!acc[emoji.category]) {
          acc[emoji.category] = [];
        }
        acc[emoji.category]?.push(emoji);
        return acc;
      },
      {} as Record<string, components['schemas']['Emoji'][]>
    );
  }, [emojis]);

  return { emojis: groupedEmojis, ...rest };
};
