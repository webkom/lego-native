import Icon from '@/components/icon';
import usePolls from '@/hooks/usePolls';
import { Button, Spinner, Surface, Typography } from 'heroui-native';
import { MotiView } from 'moti';
import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

const Poll = () => {
  const { polls, vote } = usePolls();
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const poll = polls?.data?.results[0];

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

  const isSubmittingVote = vote.isPending;
  const hasVoted = vote.isSuccess || poll?.hasAnswered;
  const hideResults = poll?.resultsHidden;

  const hideOptions = isSubmittingVote || hasVoted;

  if (polls?.isLoading || polls?.isError || !poll) return null;

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

              <View>
                <MotiView animate={{ opacity: hideOptions ? 0 : 1, left: hideOptions ? -50 : 0 }}>
                  <MotiView
                    key="polls"
                    animate={{
                      height: isExpanded ? (hideResults ? 20 : contentHeight) : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    className="w-full">
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
                </MotiView>
                <MotiView
                  animate={{ opacity: isSubmittingVote ? 1 : 0, right: isSubmittingVote ? 0 : -50 }}
                  className="absolute right-0 top-0">
                  <Spinner size="lg" />
                </MotiView>
                <MotiView
                  animate={{ opacity: !hideResults ? 1 : 0, right: !hideResults ? 0 : -50 }}
                  className="absolute right-1/2 top-0 flex -translate-x-1/2 flex-row items-center gap-3 p-5">
                  <View className="bg-danger-foreground rounded-full p-2">
                    <Icon name="Check" className="text-danger" />
                  </View>
                  <Typography className="text-danger-foreground font-bold" type="h5">
                    Du har stemt
                  </Typography>
                </MotiView>
              </View>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </MotiView>
  );
};

export default Poll;
