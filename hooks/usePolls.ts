import { api } from '@/lib/services/api';
import { useQueryClient } from '@tanstack/react-query';

export const usePolls = () => {
  const queryClient = useQueryClient();
  const { queryKey } = api.queryOptions('get', '/api/v1/polls/');

  const polls = api.useQuery('get', '/api/v1/polls/');
  const vote = api.useMutation('post', '/api/v1/polls/{id}/vote/', {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previousPolls = queryClient.getQueryData<typeof polls.data>(queryKey);

      queryClient.setQueryData<typeof polls.data>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((poll) =>
            poll.id === variables.params.path.id
              ? { ...poll, hasAnswered: true as unknown as string }
              : poll
          ),
        };
      });

      return { previousPolls };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPolls) {
        queryClient.setQueryData(queryKey, context.previousPolls);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
  return {
    polls,
    vote,
  };
};

export const usePoll = (id?: number) => {
  return api.useQuery(
    'get',
    '/api/v1/polls/{id}/',
    {
      params: { path: { id: id! } },
    },
    {
      enabled: id !== undefined,
    }
  );
};
