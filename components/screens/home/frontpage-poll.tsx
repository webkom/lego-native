import Icon from '@/components/icon';
import { usePoll, usePolls } from '@/lib/hooks/usePolls';
import { Link } from 'expo-router';
import { Button, Typography } from 'heroui-native';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import Poll from './poll';

const FrontPagePoll = () => {
  const { data: polls } = usePolls();
  const { data: poll, vote } = usePoll(
    polls?.pages
      .flatMap((page) => page.results)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.id
  );

  if (!poll) return null;
  return (
    <View className="flex flex-col gap-1">
      <Poll
        options={poll.options}
        results={poll.options as ComponentProps<typeof Poll>['results']}
        resultsHidden={poll.resultsHidden ?? false}
        title={poll.title}
        totalVotes={poll.totalVotes ?? 0}
        castVote={(optionId) => {
          return vote.mutate({
            params: { path: { id: poll.id } },
            body: {
              optionId,
            } as any, // Need to cast to any because the backend schema is not correct
          });
        }}
        hasAnswered={Boolean(poll.hasAnswered)}
        submittingVote={vote.isPending}
        validUntil={poll.validUntil}
      />
      <Link href="authed/(stacks)/polls" asChild>
        <Button variant="secondary" size="sm">
          <Typography>Vis alle</Typography>
          <Icon name="ArrowRight" className="text-surface-secondary-foreground" size={16} />
        </Button>
      </Link>
    </View>
  );
};

export default FrontPagePoll;
