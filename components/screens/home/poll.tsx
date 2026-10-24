import Icon from '@/components/icon';
import { usePoll, usePolls } from '@/hooks/usePolls';
import { Button, Spinner, Surface, Typography } from 'heroui-native';
import { MotiView } from 'moti';
import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

const Poll = () => {
  const { polls, vote } = usePolls();
  const poll = polls?.data?.results[0];
  const { data: pollResults } = usePoll(poll?.id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [hiddenResultsHeight, setHiddenResultsHeight] = useState(0);
  const [showResultsHeight, setShowResultsHeight] = useState(0);

  const submitPollResponse = useCallback(
    (optionId: number) => {
      if (!poll) return;

      // Need to cast to any because the backend schema is not correct
      vote.mutate({
        params: { path: { id: poll.id } },
        body: {
          optionId,
        } as any,
      });
    },
    [poll, vote]
  );

  if (polls?.isLoading || polls?.isError || !poll) return null;

  const isSubmittingVote = vote.isPending;
  const hasVoted = Boolean(vote.isSuccess || poll?.hasAnswered);
  const showResults = hasVoted && !isSubmittingVote && !poll?.resultsHidden;

  const hideOptions = isSubmittingVote || hasVoted;
  const showVotedText = hasVoted && !isSubmittingVote && poll?.resultsHidden;
  const expandedHeight = showVotedText
    ? hiddenResultsHeight
    : showResults
      ? showResultsHeight
      : contentHeight;

  return (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <TouchableOpacity onPress={() => setIsExpanded((current) => !current)}>
        <Surface className="bg-danger flex flex-col py-0 pl-0">
          <View className="flex w-full flex-row gap-3">
            <View
              className="light:bg-white/20 flex justify-center overflow-hidden px-3 dark:bg-black/20"
              key="poll-icon">
              <Icon name="FileChartColumnIncreasing" className="text-danger-foreground" />
            </View>

            <View className="flex-1 py-4">
              <MotiView animate={{ marginBottom: isExpanded ? 24 : 0 }}>
                <Typography className="text-danger-foreground leading-snug">
                  {poll.title}
                </Typography>
              </MotiView>

              <MotiView
                key="polls"
                animate={{
                  height: isExpanded ? expandedHeight : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                style={{ width: '100%', overflow: 'hidden' }}>
                <MotiView animate={{ opacity: hideOptions ? 0 : 1, left: hideOptions ? -50 : 0 }}>
                  <View
                    onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
                    className="absolute left-0 right-0 top-0 flex flex-col gap-1">
                    {poll.options.map((option) => (
                      <Button
                        size="sm"
                        key={option.id}
                        variant="tertiary"
                        onPress={() => submitPollResponse(option.id)}>
                        {option.name}
                      </Button>
                    ))}
                  </View>
                </MotiView>
                <MotiView
                  animate={{
                    opacity: isSubmittingVote ? 1 : 0,
                    right: isSubmittingVote ? 0 : -50,
                  }}>
                  <View className="absolute right-0 top-0">
                    <Spinner size="lg" />
                  </View>
                </MotiView>
                <MotiView
                  animate={{ opacity: showVotedText ? 1 : 0, right: showVotedText ? 0 : -50 }}>
                  <View
                    onLayout={(e) => setHiddenResultsHeight(e.nativeEvent.layout.height)}
                    className="absolute left-0 right-0 top-0 flex w-full flex-row items-center justify-start gap-3">
                    <View className="bg-danger-foreground rounded-full p-1.5">
                      <Icon name="Check" className="text-danger" />
                    </View>
                    <Typography className="text-danger-foreground font-bold" type="h5">
                      Du har stemt
                    </Typography>
                  </View>
                </MotiView>
                <MotiView animate={{ opacity: showResults ? 1 : 0, right: showResults ? 0 : -50 }}>
                  <View
                    onLayout={(e) => setShowResultsHeight(e.nativeEvent.layout.height)}
                    className="absolute left-0 right-0 top-0 flex w-full flex-col items-center justify-start gap-1">
                    {pollResults?.options.map((option) => {
                      const optionData = option as unknown as {
                        id: number;
                        votes: number;
                        name: string;
                      };

                      return (
                        <Surface
                          key={option.id + 'result'}
                          className="relative flex w-full flex-row items-center justify-between bg-black/20 px-0 py-0">
                          <View
                            className="bg-danger-foreground absolute left-0 top-0 h-full"
                            style={{
                              width: `${(optionData.votes / pollResults.totalVotes) * 100}%`,
                            }}
                          />
                          <Typography className="py-2 pl-4">
                            {optionData.name} {optionData.votes}
                          </Typography>
                          <Typography className="pr-4">
                            {pollResults.totalVotes > 0
                              ? `${Math.round((optionData.votes / pollResults.totalVotes) * 100)}%`
                              : '0%'}
                          </Typography>
                        </Surface>
                      );
                    })}
                  </View>
                </MotiView>
              </MotiView>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </MotiView>
  );
};

export default Poll;
