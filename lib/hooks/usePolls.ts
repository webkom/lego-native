import { api } from '@/lib/services/api';
import { extractCursor } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

const POLLS_KEY = ['get', '/api/v1/polls/'];
const FRONTPAGE_KEY = ['get', '/api/v1/frontpage/'];

export const usePolls = (cursor?: string) => {
  return api.useInfiniteQuery(
    'get',
    '/api/v1/polls/',
    {
      params: { query: { cursor: cursor } },
    },
    {
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => extractCursor(lastPage.next),
      getPreviousPageParam: (firstPage) => extractCursor(firstPage.previous),
    }
  );
};

type PollsData = ReturnType<typeof usePolls>['data'];
type PollData = {
  totalVotes: number;
  options: { readonly id: number; name: string; votes: number }[];
};

export const usePoll = (id?: number) => {
  const queryClient = useQueryClient();
  const { queryKey: pollQueryKey } = api.queryOptions('get', '/api/v1/polls/{id}/', {
    params: { path: { id: id! } },
  });

  const poll = api.useQuery(
    'get',
    '/api/v1/polls/{id}/',
    { params: { path: { id: id! } } },
    { enabled: id !== undefined }
  );

  const vote = api.useMutation('post', '/api/v1/polls/{id}/vote/', {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: POLLS_KEY });
      await queryClient.cancelQueries({ queryKey: pollQueryKey });

      const previousPolls = queryClient.getQueriesData<PollsData>({ queryKey: POLLS_KEY });
      const previousPoll = queryClient.getQueryData<PollData>(pollQueryKey);

      queryClient.setQueriesData<PollsData>({ queryKey: POLLS_KEY }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            results: page.results.map((item) =>
              item.id === variables.params.path.id
                ? { ...item, hasAnswered: true as unknown as string }
                : item
            ),
          })),
        };
      });

      // Optimistically add the user's vote to the poll detail
      queryClient.setQueryData<PollData>(pollQueryKey, (old) => {
        if (!old) return old;
        const { optionId } = variables.body as unknown as { optionId: number };
        return {
          ...old,
          totalVotes: old.totalVotes + 1,
          options: old.options.map((item) =>
            item.id === optionId ? { ...item, votes: item.votes + 1 } : item
          ),
        };
      });

      return { previousPolls, previousPoll };
    },
    onError: (err, _variables, context) => {
      console.warn('Vote failed', err);
      context?.previousPolls.forEach(([key, data]) => queryClient.setQueryData(key, data));
      if (context?.previousPoll) queryClient.setQueryData(pollQueryKey, context.previousPoll);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POLLS_KEY });
      queryClient.invalidateQueries({ queryKey: pollQueryKey });
      queryClient.invalidateQueries({ queryKey: FRONTPAGE_KEY });
    },
  });

  return { ...poll, vote };
};
