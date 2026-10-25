import Poll from '@/components/screens/home/poll';
import { usePolls, usePollVote } from '@/lib/hooks/usePolls';
import { api } from '@/lib/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Spinner } from 'heroui-native';
import { ComponentProps } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

const SafeAreaView = withUniwind(RNSafeAreaView);

const PollsPage = () => {
  const {
    data: polls,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePolls();
  const { vote } = usePollVote();
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

  const handleFetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} className="flex h-full flex-1 flex-col gap-3">
      {!isLoading ? (
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              progressViewOffset={50}
            />
          }
          contentContainerClassName="gap-2 px-4 pt-safe-offset-2 pb-safe-offset-10"
          className="w-full flex-1"
          data={polls?.pages.flatMap((p) => p.results) ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Poll
              {...item}
              results={item.options as ComponentProps<typeof Poll>['results']}
              validUntil={item.validUntil}
              hasAnswered={Boolean(item.hasAnswered)}
              castVote={(optionId) =>
                vote.mutate({ params: { path: { id: item.id } }, body: { optionId } as any })
              }
              lazyLoadResults={true}
              onLoadResults={() => getPollResults(item.id)}
            />
          )}
          ListFooterComponent={
            hasNextPage ? (
              <Button
                onPress={handleFetchNextPage}
                isDisabled={!hasNextPage || isFetchingNextPage}
                variant="ghost">
                {isFetchingNextPage ? <Spinner /> : 'Hent mer'}
              </Button>
            ) : null
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      )}
    </SafeAreaView>
  );
};

export default PollsPage;
