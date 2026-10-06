import React from 'react';
import { Share, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import Icon from '@/components/icon';
import { EventTypeConfig } from '@/lib/types/eventColors';
import { cn } from '@/lib/utils';
import { DetailedEvent } from './types';

type HeroSectionProps = {
  event?: DetailedEvent;
  onBack?: () => void;
};

export function HeroSection({ event, onBack }: HeroSectionProps) {
  const config = event?.eventType ? EventTypeConfig[event.eventType] : undefined;
  const categoryColor = config?.color;

  const handleShare = async () => {
    if (!event) return;
    try {
      await Share.share({
        title: event.title,
        message: `${event.title} – https://abakus.no/events/${event.id}`,
      });
    } catch (err) {
      console.error('Error sharing event:', err);
    }
  };

  return (
    <View className="border-border bg-muted relative w-full overflow-hidden rounded-2xl border shadow-sm">
      {/* Cover Image or Fallback */}
      {event?.cover ? (
        <Image
          source={{ uri: event.cover }}
          style={{ width: '100%', height: 220 }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={{
            backgroundColor: categoryColor ? `${categoryColor}18` : undefined,
          }}
          className={cn(
            'relative h-52 w-full items-center justify-center overflow-hidden',
            !categoryColor && 'bg-secondary/40'
          )}>
          {categoryColor && (
            <View
              style={{
                backgroundColor: categoryColor,
                opacity: 0.12,
                width: 160,
                height: 160,
                borderRadius: 80,
              }}
              className="absolute"
            />
          )}
          <View
            style={{
              backgroundColor: categoryColor ? `${categoryColor}25` : undefined,
            }}
            className={cn(
              'h-20 w-20 items-center justify-center rounded-2xl shadow-sm',
              !categoryColor && 'bg-background/40'
            )}>
            <Icon
              name="CalendarDays"
              size={40}
              color={categoryColor}
              className={!categoryColor ? 'text-muted-foreground/40' : undefined}
            />
          </View>
        </View>
      )}

      {/* Floating Action Buttons Overlay (Back & Share) */}
      <View className="absolute left-3 right-3 top-3 flex-row items-center justify-between">
        {onBack && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBack}
            className="bg-background/80 h-10 w-10 items-center justify-center rounded-full border border-black/10 shadow-md backdrop-blur-md dark:border-white/10">
            <Icon name="ArrowLeft" size={20} className="text-foreground" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleShare}
          className="bg-background/80 ml-auto h-10 w-10 items-center justify-center rounded-full border border-black/10 shadow-md backdrop-blur-md dark:border-white/10">
          <Icon name="Share2" size={18} className="text-foreground" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HeroSection;
