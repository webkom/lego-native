import { cn } from '@/lib/cn';
import { Typography } from 'heroui-native';
import React, { ComponentProps } from 'react';
import { Text, View } from 'react-native';

type StatItemProps = {
  label: string;
  value: string;
} & ComponentProps<typeof View>;

export const StatItem = ({ label, value, className, ...props }: StatItemProps) => {
  return (
    <View className={cn('flex-row items-center gap-1', className)} {...props}>
      <Typography type="body-xs" className="text-default-soft-foreground">
        {label}:
      </Typography>
      <Text className="text-foreground text-xs font-semibold">{value}</Text>
    </View>
  );
};
