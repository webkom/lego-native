import { api } from '../services/api';

// How do pinned events work??
export const usePinnedArticle = () => {
  const { data: articles } = api.useQuery('get', '/api/v1/articles/');
  // const { data: events } = api.useQuery('get', '/api/v1/events/');

  const pinnedArticles = articles?.results.filter((article) => article.pinned);
  return pinnedArticles?.[0];
};
