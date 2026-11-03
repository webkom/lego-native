import { components } from './schema';

export type Reaction = {
  count: number;
  emoji: string; // ':point_right:'
  hasReacted: boolean;
  reactionId: null | number;
  unicodeString: string; // '👉'
};

export type GroupedEmojis = Record<string, components['schemas']['Emoji'][]>;

export type SelectedEmoji = {
  shortCode: string;
  unicodeString: string;
};
