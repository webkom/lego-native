import { api } from '@/lib/services/api';

export const useFrontPageData = () => {
  const { data, ...rest } = api.useQuery('get', '/api/v1/frontpage/');
  const pinnedArticles = data?.articles?.filter((a) => a.pinned);
  const events = data?.events;
  const articles = data?.articles;
  const poll = data?.poll;

  return { pinnedArticles, events, articles, poll, ...rest };
};
