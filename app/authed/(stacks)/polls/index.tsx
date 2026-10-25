import Poll from '@/components/screens/home/poll';
import { usePolls } from '@/lib/hooks/usePolls';
import { api } from '@/lib/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { ComponentProps } from 'react';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const PollsPage = () => {
  const { data: polls, refetch, isRefetching } = usePolls();
  const queryClient = useQueryClient();
  const getPollResults = async (pollId: number) => {
    // Fetch poll results for the given pollId
    const data = await queryClient.fetchQuery(
      api.queryOptions('get', '/api/v1/polls/{id}/', {
        params: { path: { id: pollId } },
      })
    );

    return data.options as ComponentProps<typeof Poll>['results'];
  };

  return (
    <SafeAreaView edges={['left', 'right']}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} progressViewOffset={50} />
        }
        contentContainerClassName="gap-2 pt-safe-offset-2"
        data={polls?.pages.flatMap((p) => p.results)}
        renderItem={({ item }) => (
          <Poll
            {...item}
            results={item.options as ComponentProps<typeof Poll>['results']}
            hasAnswered={Boolean(item.hasAnswered)}
            lazyLoadResults={true}
            onLoadResults={() => getPollResults(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default PollsPage;
