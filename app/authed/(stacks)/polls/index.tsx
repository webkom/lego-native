import Poll from '@/components/screens/home/poll';
import { usePolls } from '@/lib/hooks/usePolls';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

const PollsPage = () => {
  const { data: polls, refetch, isRefetching } = usePolls();

  return (
    <FlatList
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      data={polls?.pages.flatMap((p) => p.results)}
      renderItem={() => <Poll />}
    />
  );
};

export default PollsPage;
