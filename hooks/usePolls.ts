import { api } from '@/lib/services/api';

const usePolls = () => {
  const polls = api.useQuery('get', '/api/v1/polls/');
  const vote = api.useMutation('post', '/api/v1/polls/{id}/vote/');
  return {
    polls,
    vote,
  };
};

export default usePolls;
