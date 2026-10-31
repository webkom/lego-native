import Icon from '@/components/icon';
import { GroupedEmojis, Reaction } from '@/lib/types/reactions';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheet, Card, cn, Surface, Typography } from 'heroui-native';
import { ComponentProps, memo, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

type IconCategory =
  | 'people'
  | 'animals_and_nature'
  | 'food_and_drink'
  | 'activity'
  | 'travel_and_places'
  | 'objects'
  | 'symbols'
  | 'flags';

const mapCategoryNameToIconName = (name: IconCategory): ComponentProps<typeof Icon>['name'] => {
  switch (name) {
    case 'people':
      return 'Smile';

    case 'animals_and_nature':
      return 'Leaf';

    case 'food_and_drink':
      return 'Beer';

    case 'activity':
      return 'LandPlot';

    case 'travel_and_places':
      return 'Plane';

    case 'objects':
      return 'Lightbulb';

    case 'symbols':
      return 'Heart';

    case 'flags':
      return 'Flag';

    default:
      return 'CircleQuestionMark';
  }
};

const categoryNameToReadableName: Record<IconCategory, string> = {
  people: 'Folk',
  animals_and_nature: 'Dyr og natur',
  food_and_drink: 'Mat og drikke',
  activity: 'Aktivitet',
  travel_and_places: 'Reise og steder',
  objects: 'Objekter',
  symbols: 'Symboler',
  flags: 'Flagg',
};

type SelectedEmoji = {
  shortCode: string;
  unicodeString: string;
};

type OverheardProps = {
  quote: string;
  quotee: string;
  reactions: Reaction[];
  emojis?: GroupedEmojis;
  onReactionSelect?: (emoji: SelectedEmoji) => void;
};

const QuoteCard = ({ quote, quotee, reactions, emojis, onReactionSelect }: OverheardProps) => {
  return (
    <Card>
      <Card.Body className="gap-3">
        <Typography>{quote}</Typography>
        <Typography type="code">-{quotee}</Typography>
        <Reactions
          reactions={reactions}
          emojis={emojis}
          onReactionSelect={(emoji) => {
            onReactionSelect?.(emoji);
          }}
        />
      </Card.Body>
    </Card>
  );
};

type ReactionsProps = {
  reactions: Reaction[];
  emojis?: GroupedEmojis;
  onReactionSelect?: (emoji: SelectedEmoji) => void;
};
const Reactions = ({ reactions, emojis, onReactionSelect }: ReactionsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <View className="flex flex-row flex-wrap gap-2">
      {reactions.map((reaction, index) => (
        <TouchableOpacity
          key={`${reaction.reactionId ?? reaction.emoji}${index}`}
          onPress={() =>
            onReactionSelect?.({
              shortCode: reaction.emoji,
              unicodeString: reaction.unicodeString,
            })
          }>
          <ReactionSurface hasReacted={reaction.hasReacted}>
            <Typography className="text-sm leading-none">{reaction.unicodeString}</Typography>
            <Typography className="text-sm leading-none">{reaction.count}</Typography>
          </ReactionSurface>
        </TouchableOpacity>
      ))}
      <ReactionPicker
        emojis={emojis}
        onReactionSelect={(emoji) => {
          onReactionSelect?.(emoji);
          setModalOpen(false);
        }}
        open={modalOpen}
        onOpenChange={setModalOpen}>
        <ReactionSurface hasReacted={false}>
          <Icon name="SmilePlus" size={16} className="text-surface-secondary-foreground/70" />
        </ReactionSurface>
      </ReactionPicker>
    </View>
  );
};

const EmojiCell = memo(
  ({ emoji, onSelect }: { emoji: SelectedEmoji; onSelect?: (emoji: SelectedEmoji) => void }) => (
    <Pressable
      className="h-11 w-11 items-center justify-center active:opacity-50"
      onPress={() => onSelect?.(emoji)}>
      <Text className="text-3xl">{emoji.unicodeString}</Text>
    </Pressable>
  )
);

const CategoryTab = memo(
  ({
    category,
    isSelected,
    onSelect,
  }: {
    category: string;
    isSelected: boolean;
    onSelect: (category: string) => void;
  }) => (
    <TouchableOpacity onPress={() => onSelect(category)}>
      <Surface variant={isSelected ? 'default' : 'secondary'} className="mr-2 px-4 py-2">
        <Icon
          name={mapCategoryNameToIconName(category as IconCategory)}
          className="text-surface-secondary-foreground"
        />
      </Surface>
    </TouchableOpacity>
  )
);

const EMOJI_ROW_HEIGHT = 52; // h-11 (44px) + gap-2 (8px)

const ReactionPicker = ({
  emojis,
  children,
  onReactionSelect,
  onOpenChange,
  open,
}: {
  children?: React.ReactNode;
  emojis?: GroupedEmojis;
  onReactionSelect?: (emoji: SelectedEmoji) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) => {
  const categories = useMemo(() => {
    if (!emojis) return [];
    return Object.keys(emojis);
  }, [emojis]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0] ?? null);
  const activeCategory = selectedCategory ?? categories[0] ?? null;

  const renderCategoryItem = useCallback(
    ({ item }: { item: string }) => (
      <CategoryTab
        category={item}
        isSelected={activeCategory === item}
        onSelect={setSelectedCategory}
      />
    ),
    [activeCategory]
  );

  const renderEmojiItem = useCallback(
    ({ item }: { item: SelectedEmoji }) => <EmojiCell emoji={item} onSelect={onReactionSelect} />,
    [onReactionSelect]
  );

  const getEmojiItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: EMOJI_ROW_HEIGHT,
      offset: EMOJI_ROW_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <BottomSheet isOpen={open} onOpenChange={onOpenChange}>
      {children && <BottomSheet.Trigger>{children}</BottomSheet.Trigger>}
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={['50%', '85%']}
          enableDynamicSizing={false}
          enableOverDrag={false}
          contentContainerClassName="h-full gap-3">
          <BottomSheet.Title>Velg piktogram</BottomSheet.Title>
          {emojis && (
            <>
              <FlatList
                data={categories}
                horizontal
                className="grow-0"
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item}
                renderItem={renderCategoryItem}
              />

              <Typography>
                {categoryNameToReadableName[activeCategory as IconCategory] ?? 'Ukjent kategori'}
              </Typography>

              {activeCategory && (
                <BottomSheetFlatList
                  data={emojis[activeCategory]}
                  numColumns={6}
                  className="flex-1"
                  columnWrapperClassName="justify-between"
                  contentContainerClassName="gap-2 pb-6"
                  keyExtractor={(i) => i.shortCode}
                  renderItem={renderEmojiItem}
                  getItemLayout={getEmojiItemLayout}
                  initialNumToRender={6}
                  maxToRenderPerBatch={6}
                  windowSize={5}
                  removeClippedSubviews
                />
              )}
            </>
          )}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};

type ReactionSurfaceProps = { hasReacted?: boolean } & ComponentProps<typeof Surface>;
const ReactionSurface = ({ hasReacted, ...props }: ReactionSurfaceProps) => {
  return (
    <Surface
      className={cn(
        'flex flex-row items-center gap-1 py-3',
        hasReacted ? 'border-primary bg-primary/10' : ''
      )}
      variant="secondary"
      {...props}
    />
  );
};

export default QuoteCard;
