import Icon from '@/components/icon';
import { useFrontPageData } from '@/lib/hooks/useFrontPageData';
import { usePoll } from '@/lib/hooks/usePolls';
import { Link } from 'expo-router';
import { Button, Skeleton, Surface, Typography } from 'heroui-native';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import env from 'env';
import PollResultItem from './poll-result-item';

const AnimatedView = withUniwind(Animated.View);

const transition = {
  transitionDuration: 300,
  transitionTimingFunction: 'ease-in-out',
} as const;

type PollProps = {
  poll?: ReturnType<typeof useFrontPageData>['poll'];
};

const Poll = ({ poll }: PollProps) => {
  const baseUrl = env.EXPO_PUBLIC_FRONTEND_URL;

  const { data: pollResults, vote } = usePoll(poll?.id);
  // `vote` is a new object on every render, so only depend on its stable methods
  const { reset: resetVote, mutate: mutateVote } = vote;

  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [hiddenResultsHeight, setHiddenResultsHeight] = useState(0);
  const [showResultsHeight, setShowResultsHeight] = useState(0);
  const [showAnonymousNote, setShowAnonymousNote] = useState(false);

  useEffect(() => {
    resetVote();
  }, [resetVote, poll?.id]);

  useEffect(() => {
    if (!showAnonymousNote) return;
    const timeout = setTimeout(() => setShowAnonymousNote(false), 3000);
    return () => clearTimeout(timeout);
  }, [showAnonymousNote]);

  const submitPollResponse = useCallback(
    (optionId: number) => {
      if (!poll) return;

      // Need to cast to any because the backend schema is not correct
      mutateVote({
        params: { path: { id: poll.id } },
        body: {
          optionId,
        } as any,
      });
    },
    [poll, mutateVote]
  );

  if (poll === undefined) return <Skeleton className="h-30 w-full rounded-2xl" />;
  if (!poll) return null;

  const isOpen = !poll.validUntil || new Date(poll.validUntil) > new Date();
  const isSubmittingVote = vote.isPending;
  const hasVoted = Boolean(vote.isSuccess || poll.hasAnswered);
  const canVote = isOpen && !hasVoted;

  const hideOptions = isSubmittingVote || !canVote;
  const showResults = !canVote && !isSubmittingVote && !poll.resultsHidden && Boolean(pollResults);
  const showHiddenState = !canVote && !isSubmittingVote && Boolean(poll.resultsHidden);
  const expandedHeight = showHiddenState
    ? hiddenResultsHeight
    : showResults
      ? showResultsHeight
      : contentHeight;

  return (
    <View className="gap-1">
      <Typography type="h4">Avstemninger</Typography>
      <AnimatedView entering={FadeIn}>
        <TouchableOpacity onPress={() => setIsExpanded((current) => !current)}>
          <Surface className="bg-danger flex flex-col overflow-hidden p-0">
            <View
              key="poll-header"
              className="light:bg-white/20 flex w-full flex-row items-center justify-center py-2 dark:bg-black/20">
              <Icon name="ChartNoAxesColumn" className="text-danger-foreground" />
            </View>

            <View className="w-full px-4 py-4">
              <AnimatedView
                style={{
                  marginBottom: isExpanded ? 24 : 0,
                  transitionProperty: 'marginBottom',
                  ...transition,
                }}>
                <Typography className="text-danger-foreground text-center font-medium leading-snug">
                  {poll.title}
                </Typography>
              </AnimatedView>

              <AnimatedView
                pointerEvents={isExpanded ? 'auto' : 'none'}
                key="polls"
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  height: isExpanded ? expandedHeight : 0,
                  opacity: isExpanded ? 1 : 0,
                  transitionProperty: ['height', 'opacity'],
                  ...transition,
                }}>
                <AnimatedView
                  pointerEvents={hideOptions ? 'none' : 'auto'}
                  style={{
                    opacity: hideOptions ? 0 : 1,
                    left: hideOptions ? -50 : 0,
                    transitionProperty: ['opacity', 'left'],
                    ...transition,
                  }}>
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
                </AnimatedView>

                <AnimatedView
                  pointerEvents="none"
                  style={{
                    opacity: showHiddenState ? 1 : 0,
                    right: showHiddenState ? 0 : -50,
                    transitionProperty: ['opacity', 'right'],
                    ...transition,
                  }}>
                  <View
                    onLayout={(e) => setHiddenResultsHeight(e.nativeEvent.layout.height)}
                    className="absolute left-0 right-0 top-0 flex w-full flex-row items-center justify-start gap-3">
                    <View className="bg-danger-foreground rounded-full p-1.5">
                      <Icon name="Check" className="text-danger" />
                    </View>
                    <Typography className="text-danger-foreground font-bold" type="h5">
                      {hasVoted ? 'Du har stemt' : 'Avstemningen er avsluttet'}
                    </Typography>
                  </View>
                </AnimatedView>

                <AnimatedView
                  pointerEvents={showResults ? 'auto' : 'none'}
                  style={{
                    opacity: showResults ? 1 : 0,
                    right: showResults ? 0 : -50,
                    transitionProperty: ['opacity', 'right'],
                    ...transition,
                  }}>
                  <View
                    onLayout={(e) => setShowResultsHeight(e.nativeEvent.layout.height)}
                    className="absolute left-0 right-0 top-0 flex w-full flex-col items-stretch gap-1">
                    {pollResults?.options.map((option) => {
                      const optionData = option as unknown as {
                        id: number;
                        votes: number;
                        name: string;
                      };

                      return (
                        <PollResultItem
                          key={option.id}
                          name={optionData.name}
                          votes={optionData.votes}
                          totalVotes={pollResults.totalVotes}
                        />
                      );
                    })}

                    <View className="flex min-h-8 w-full flex-row items-center justify-center gap-2 pt-2">
                      <Typography className="text-danger-foreground text-sm">
                        {showAnonymousNote
                          ? 'Avstemningen er anonym'
                          : `${poll.totalVotes} stemme${poll.totalVotes !== 1 ? 'r' : ''}`}
                      </Typography>

                      <Pressable
                        hitSlop={12}
                        onPress={() => setShowAnonymousNote((current) => !current)}>
                        <Icon name="Info" size={16} className="text-danger-foreground" />
                      </Pressable>
                    </View>
                  </View>
                </AnimatedView>
              </AnimatedView>
            </View>

            <Link href={`${baseUrl}/polls`} asChild>
              <Pressable className="light:bg-white/20 flex w-full flex-row items-center justify-center gap-2 px-4 py-3 active:opacity-70 dark:bg-black/20">
                <Typography className="text-danger-foreground text-sm">
                  Se flere avstemninger
                </Typography>
                <Icon name="SquareArrowOutUpRight" size={14} className="text-danger-foreground" />
              </Pressable>
            </Link>
          </Surface>
        </TouchableOpacity>
      </AnimatedView>
    </View>
  );
};

export default Poll;
