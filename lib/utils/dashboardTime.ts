import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';

/**
 * Calculates and formats current session duration based on `last_seen` timestamp.
 * Returns formatted string like "2 t 15 min" or "45 min".
 */
export const calculateSessionDuration = (lastSeen?: string, now: Date = new Date()): string => {
  if (!lastSeen) return '-';

  const lastSeenDate = new Date(lastSeen);
  if (isNaN(lastSeenDate.getTime())) return '-';

  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = Math.floor(diffSeconds % 60);

  if (hours > 0) {
    return `${hours} t ${minutes} min`;
  }
  if (minutes > 0) {
    return `${minutes} min`;
  }
  return `${seconds} s`;
};

/**
 * Formats total working time in seconds to human-readable hours string.
 * Example: 7200 -> "2 timer", 3600 -> "1 time", 0 -> "0 timer".
 */
export const formatTotalHours = (totalSeconds?: number): string => {
  if (!totalSeconds || totalSeconds <= 0) {
    return '0 timer';
  }

  const hours = Math.floor(totalSeconds / 3600);
  return `${hours} ${hours === 1 ? 'time' : 'timer'}`;
};

/**
 * Formats last seen timestamp relative to current time in Norwegian.
 * Example: "2 timer siden", "i går".
 */
export const formatLastSeenAgo = (lastSeen?: string): string => {
  if (!lastSeen) return 'Aldri sett';

  const date = new Date(lastSeen);
  if (isNaN(date.getTime())) return '-';

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: nb,
  });
};
