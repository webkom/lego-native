import { useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { components } from '../types/schema';

export type OptimisticUpdateArgs =
  | [
      action: 'post',
      newReaction: components['schemas']['Reaction'],
      queryClient: ReturnType<typeof useQueryClient>,
    ]
  | [action: 'delete', reactionId: number, queryClient: ReturnType<typeof useQueryClient>];

export const useReaction = ({
  optimisticUpdateFn,
}: {
  optimisticUpdateFn?: (...args: OptimisticUpdateArgs) => object | Promise<object> | void;
}) => {
  const queryClient = useQueryClient();
  const postReaction = api.useMutation('post', '/api/v1/reactions/', {
    onMutate: async (newReaction) =>
      await optimisticUpdateFn?.('post', newReaction.body, queryClient),
  });

  const deleteReaction = api.useMutation('delete', '/api/v1/reactions/{id}/', {
    // Do general invalidation of the
    onMutate: async (item) =>
      await optimisticUpdateFn?.('delete', item.params.path.id, queryClient),
  });

  return { postReaction, deleteReaction };
};
