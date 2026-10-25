import { iconWithClassName } from '@/lib/iconWithClassName';
import { cn } from '@/lib/utils';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Typography } from 'heroui-native';
import { BellIcon, CalendarIcon, HouseIcon, QrCodeIcon, UserIcon } from 'lucide-react-native';
import { MotiView, useDynamicAnimation } from 'moti';
import React, { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';

const QrCode = iconWithClassName(QrCodeIcon);
const Calendar = iconWithClassName(CalendarIcon);
const User = iconWithClassName(UserIcon);
const House = iconWithClassName(HouseIcon);
const Bell = iconWithClassName(BellIcon);

// Infer the correct props from one of the lucide icons:
type IconProps = ComponentProps<typeof UserIcon> & { className?: string };
type IconType = React.ComponentType<IconProps>;

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TabBar = ({ navigation, state, descriptors, insets }: TabBarProps) => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <View className="bottom-safe-offset-2 absolute inset-x-0 px-2">
      <View className="border-border bg-card flex w-full flex-row justify-evenly rounded-full border px-3 py-3 shadow-sm">
        <TabBarButton
          Icon={House}
          selected={pathName.includes('home')}
          label="Hjem"
          onPress={() => router.push('/authed/(tabs)/home')}
        />
        <TabBarButton
          Icon={Calendar}
          selected={pathName.includes('events')}
          label="Arrangementer"
          onPress={() => router.push('/authed/(tabs)/events')}
        />
        <TabBarButton
          Icon={QrCode}
          selected={pathName.includes('abaid')}
          label="AbaID"
          onPress={() => router.push('/authed/(tabs)/abaid')}
        />

        <TabBarButton
          Icon={Bell}
          selected={pathName.includes('notification-feed')}
          label="Varsler"
          onPress={() => router.push('/authed/(tabs)/notification-feed')}
        />

        <TabBarButton
          Icon={User}
          selected={pathName.includes('profile')}
          label="Profil"
          onPress={() => router.push('/authed/(tabs)/profile')}
        />
      </View>
    </View>
  );
};

type TabBarButtonProps = {
  Icon: IconType;
  label: string;
  selected?: boolean;
} & ComponentProps<typeof Pressable>;

const TabBarButton = ({
  Icon,
  label,
  selected,
  onPress,
  className,
  ...props
}: TabBarButtonProps) => {
  const animation = useDynamicAnimation(() => ({
    width: 0,
  }));

  if (selected) {
    animation.animateTo(() => ({
      width: 64,
      opacity: 1,
    }));
  } else {
    animation.animateTo(() => ({
      width: 0,
      opacity: 0,
    }));
  }

  return (
    <Pressable
      className={cn('flex flex-col items-center gap-0.5', className)}
      onPress={onPress}
      {...props}>
      <View className="relative flex h-10 w-16 items-center justify-center">
        <View className="absolute inset-0 flex items-center justify-center">
          <MotiView
            state={animation}
            className="bg-primary h-full rounded-full"
            style={{
              borderRadius: 1000,
            }}
          />
        </View>
        <Icon size={22} className={selected ? 'text-primary-foreground' : 'text-foreground'} />
      </View>
      <Typography
        type="body-xs"
        className={cn(selected ? 'text-foreground font-bold' : 'text-muted-foreground')}>
        {label}
      </Typography>
    </Pressable>
  );
};

export default TabBar;
