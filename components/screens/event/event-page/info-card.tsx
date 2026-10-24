import { View, Text } from 'react-native';
import React, { ComponentProps } from 'react';
import Icon from '@/components/icon';
import { Card, cn } from 'heroui-native';

type InfoCardProps = {
  children?: React.ReactNode;
  title?: string;
  icon?: ComponentProps<typeof Icon>['name'];
  iconComponent?: React.ReactNode;
  iconClassName?: string;
  iconContainerClassName?: string;
} & ComponentProps<typeof Card>;

const InfoCard = ({
  children,
  title,
  icon,
  iconComponent,
  iconClassName,
  iconContainerClassName,
  className,
  ...props
}: InfoCardProps) => {
  return (
    <Card className={cn('flex-1', className)} {...props}>
      <Card.Header className="mb-2">
        <InfoCard.Title
          icon={icon}
          iconComponent={iconComponent}
          title={title}
          iconClassName={iconClassName}
          iconContainerClassName={iconContainerClassName}
        />
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
};

type InfoCardTitleProps = {
  title?: string;
  icon?: ComponentProps<typeof Icon>['name'];
  iconComponent?: React.ReactNode;
  iconClassName?: string;
  iconContainerClassName?: string;
  className?: string;
};

InfoCard.Title = ({
  icon,
  iconComponent,
  title,
  iconClassName,
  iconContainerClassName,
  className,
}: InfoCardTitleProps) => {
  return (
    <View className={cn('flex-row items-center gap-1.5', className)}>
      {(icon || iconComponent) && (
        <View
          className={cn(
            'h-6 w-6 items-center justify-center rounded-md',
            iconContainerClassName ?? 'bg-primary/10'
          )}>
          {icon && <Icon name={icon} size={14} className={iconClassName ?? 'text-primary'} />}
          {iconComponent}
        </View>
      )}
      <Text className="text-foreground text-[11px] font-semibold uppercase tracking-wider">
        {title}
      </Text>
    </View>
  );
};

export default InfoCard;
