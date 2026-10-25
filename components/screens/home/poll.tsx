import Icon from '@/components/icon';
import PollResultItem from '@/components/screens/home/poll-result-item';
import { components } from '@/lib/types/schema';
import { Button, Surface, Typography } from 'heroui-native';
import { MotiView } from 'moti';
import { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

type PollItem = components['schemas']['Poll'];

type PollResult = {
  id: number;
  votes: number;
  name: string;
};

type PollProps = {
  title: string;
  options: PollItem['options'];
  results: PollResult[];
  resultsHidden?: boolean;
  totalVotes?: number;
  castVote?: (optionId: PollItem['options'][number]['id']) => Promise<void> | void;
  submittingVote?: boolean;
  hasAnswered?: boolean;
  validUntil?: string;
  lazyLoadResults?: boolean;
  onLoadResults?: () => Promise<PollResult[]>;
};

const Poll = ({
  title,
  options,
  results,
  resultsHidden = false,
  totalVotes = 0,
  hasAnswered = false,
  castVote,
  submittingVote,
  validUntil,
  lazyLoadResults = false,
  onLoadResults,
}: PollProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [hiddenResultsHeight, setHiddenResultsHeight] = useState(0);
  const [showResultsHeight, setShowResultsHeight] = useState(0);
  const [loadedResults, setLoadedResults] = useState<PollResult[] | null>(null);
  const [lazyLoadingError, setLazyLoadingError] = useState(false);

  const submitPollResponse = useCallback(
    (optionId: number) => {
      castVote?.(optionId);
    },
    [castVote]
  );

  const isOpen = !validUntil || new Date(validUntil) > new Date();
  const isSubmittingVote = submittingVote;
  const canVote = isOpen && !hasAnswered;

  const hideOptions = isSubmittingVote || !canVote;
  const showResults = !canVote && !isSubmittingVote && !resultsHidden && Boolean(results);
  const showHiddenState = !canVote && !isSubmittingVote && Boolean(resultsHidden);
  const expandedHeight = showHiddenState
    ? hiddenResultsHeight
    : showResults
      ? showResultsHeight
      : contentHeight;

  const handleLazyLoadResults = useCallback(async () => {
    try {
      if (!onLoadResults) return;
      const results = await onLoadResults();
      setLoadedResults(results);
    } catch {
      setLazyLoadingError(true);
    }
  }, [onLoadResults]);

  return (
    <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <TouchableOpacity
        onPress={() => {
          if (!loadedResults && !isExpanded && lazyLoadResults && onLoadResults) {
            handleLazyLoadResults();
          }

          setIsExpanded((current) => !current);
        }}>
        <Surface className="bg-danger flex flex-col py-0 pl-0">
          <View className="flex w-full flex-row gap-3">
            <View
              className="light:bg-white/20 flex justify-center overflow-hidden px-3 dark:bg-black/20"
              key="poll-icon">
              <Icon name="FileChartColumnIncreasing" className="text-danger-foreground" />
            </View>

            <View className="flex-1 py-4">
              <MotiView animate={{ marginBottom: isExpanded ? 24 : 0 }}>
                <Typography className="text-danger-foreground leading-snug">{title}</Typography>
              </MotiView>

              <MotiView
                pointerEvents={isExpanded ? 'auto' : 'none'}
                key="polls"
                animate={{
                  height: isExpanded ? expandedHeight : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                style={{ width: '100%', overflow: 'hidden' }}>
                <MotiView
                  pointerEvents={hideOptions ? 'none' : 'auto'}
                  animate={{ opacity: hideOptions ? 0 : 1, left: hideOptions ? -50 : 0 }}>
                  <View
                    onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
                    className="absolute left-0 right-0 top-0 flex flex-col gap-1">
                    {options.map((option) => (
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
                  pointerEvents="none"
                  animate={{ opacity: showHiddenState ? 1 : 0, right: showHiddenState ? 0 : -50 }}>
                  <View
                    onLayout={(e) => setHiddenResultsHeight(e.nativeEvent.layout.height)}
                    className="absolute left-0 right-0 top-0 flex w-full flex-row items-center justify-start gap-3">
                    <View className="bg-danger-foreground rounded-full p-1.5">
                      <Icon name="Check" className="text-danger" />
                    </View>
                    <Typography className="text-danger-foreground font-bold" type="h5">
                      {hasAnswered ? 'Du har stemt' : 'Avstemningen er avsluttet'}
                    </Typography>
                  </View>
                </MotiView>
                <MotiView
                  pointerEvents="none"
                  animate={{ opacity: showResults ? 1 : 0, right: showResults ? 0 : -50 }}>
                  <View
                    onLayout={(e) => setShowResultsHeight(e.nativeEvent.layout.height)}
                    className="absolute left-0 right-0 top-0 flex w-full flex-col items-center justify-start gap-1">
                    {(lazyLoadResults ? loadedResults : options)?.map((option) => {
                      const optionData = option as unknown as {
                        id: number;
                        votes: number;
                        name: string;
                      };

                      return (
                        <PollResultItem
                          key={option.id + 'result'}
                          name={optionData.name}
                          votes={optionData.votes}
                          totalVotes={totalVotes}
                        />
                      );
                    })}
                    <View className="flex w-full flex-row items-center justify-end gap-1 pr-2">
                      <Icon name="Info" size={16} className="text-danger-foreground/70" />
                      <Typography className="text-danger-foreground/70">
                        {totalVotes} stemme{totalVotes !== 1 ? 'r' : ''}
                      </Typography>
                    </View>
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
