import { api } from '@/lib/services/api';
import { extractCursor } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

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
type PollData = Omit<NonNullable<ReturnType<typeof usePoll>['data']>, 'options'> & {
  options: { readonly id: number; name: string; votes: number }[];
};

export const usePoll = (id?: number) => {
  const queryClient = useQueryClient();
  const { queryKey: pollsQueryKey } = api.queryOptions('get', '/api/v1/polls/');
  const { queryKey: pollQueryKey } = api.queryOptions('get', '/api/v1/polls/{id}/', {
    params: { path: { id: id! } },
  });

  const poll = api.useQuery(
    'get',
    '/api/v1/polls/{id}/',
    {
      params: { path: { id: id! } },
    },
    {
      enabled: id !== undefined,
    }
  );

  const vote = api.useMutation('post', '/api/v1/polls/{id}/vote/', {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: pollsQueryKey });
      const previousPolls = queryClient.getQueryData<PollsData>(pollsQueryKey);

      queryClient.setQueryData<PollsData>(pollsQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.pages
            .flatMap((page) => page.results)
            .map((item) =>
              item.id === variables.params.path.id
                ? { ...item, hasAnswered: true as unknown as string }
                : item
            ),
        };
      });

      // Optimistically cast the user's vote on the poll to avoid waiting for the backend response
      queryClient.setQueryData<PollData>(pollQueryKey, (old) => {
        if (!old) return old;

        const { optionId } = variables.body as unknown as { optionId: number };

        return {
          ...old,
          totalVotes: old.totalVotes + 1,
          options: old.options.map((item) => {
            if (item.id === optionId) {
              return { ...item, votes: item.votes + 1 };
            }
            return item;
          }),
        };
      });

      return { previousPolls };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPolls) {
        queryClient.setQueryData(pollsQueryKey, context.previousPolls);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pollsQueryKey });
      if (id !== undefined) {
        queryClient.invalidateQueries({ queryKey: pollQueryKey });
      }
    },
  });

  return {
    ...poll,
    vote,
  };
};
