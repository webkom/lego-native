import { Chip } from 'heroui-native';
import React, { ComponentProps } from 'react';

type PresenceBadgeProps = {
  duration: string;
} & ComponentProps<typeof Chip>;

export const DurationBadge = ({ duration, className, ...props }: PresenceBadgeProps) => {
  return (
    <Chip size="sm" variant="soft" color={'success'} className={className} {...props}>
      <Chip.Label>{duration}</Chip.Label>
    </Chip>
  );
};
