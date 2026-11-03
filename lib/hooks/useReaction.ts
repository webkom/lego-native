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

export type OptimisticUpdateContext = {
  rollback?: () => void;
  onSuccess?: (createdReaction: components['schemas']['Reaction']) => void;
  onSettled?: () => void;
  [key: string]: unknown;
};

export const useReaction = ({
  optimisticUpdateFn,
}: {
  optimisticUpdateFn?: (
    ...args: OptimisticUpdateArgs
  ) => OptimisticUpdateContext | Promise<OptimisticUpdateContext | void> | void;
}) => {
  const queryClient = useQueryClient();

  const postReaction = api.useMutation('post', '/api/v1/reactions/', {
    onMutate: async (newReaction) =>
      await optimisticUpdateFn?.('post', newReaction.body, queryClient),
    onSuccess: (createdReaction, _variables, context) => {
      context?.onSuccess?.(createdReaction);
    },
    onError: (error, _variables, context) => {
      console.error('Failed to post reaction:', error);
      context?.rollback?.();
    },
    onSettled: (_data, _error, _variables, context) => {
      context?.onSettled?.();
    },
  });

  const deleteReaction = api.useMutation('delete', '/api/v1/reactions/{id}/', {
    onMutate: async (item) =>
      await optimisticUpdateFn?.('delete', item.params.path.id, queryClient),
    onError: (error, _variables, context) => {
      console.error('Failed to delete reaction:', error);
      context?.rollback?.();
    },
    onSettled: (_data, _error, _variables, context) => {
      context?.onSettled?.();
    },
  });

  return { postReaction, deleteReaction };
};
