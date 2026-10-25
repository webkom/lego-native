import { api } from '@/lib/services/api';

export const useFrontPageData = () => {
  const { data, ...rest } = api.useQuery('get', '/api/v1/frontpage/');
  const pinnedArticles = data?.articles?.filter((a) => a.pinned) ?? [];
  const events = data?.events ?? [];
  const poll = data?.poll ?? null;

  return { pinnedArticles, events, poll, ...rest };
};
