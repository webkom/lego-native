import { api } from '../services/api';

export const useGroup = (id: number) => {
  return api.useQuery('get', '/api/v1/groups/{id}/', { params: { path: { id: id } } });
};
