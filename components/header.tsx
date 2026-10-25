import { cn } from '@/lib/cn';
import { useNotificationsData } from '@/lib/hooks/useNotificationsFeed';
import { Image as ExpoImage } from 'expo-image';
import { Link } from 'expo-router';
import { useTheme } from 'expo-router/react-navigation';
import { Button } from 'heroui-native';
import { View, ViewProps } from 'react-native';
import Icon from './icon';
import { Text } from './ui/text';
import { withUniwind } from 'uniwind';

const Image = withUniwind(ExpoImage);

type HeaderProps = {} & ViewProps;
const Header = ({ className }: HeaderProps) => {
  const theme = useTheme();
  const { data } = useNotificationsData();
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <View
      className={cn(
        'pt-safe-offset-5 border-border flex w-full flex-row items-center justify-between gap-2.5 border-b px-5 pb-5',
        className
      )}>
      {/* <Avatar alt="Profile Picture" className="h-14 w-14">
        <Avatar.Image source={{ uri: user.profilePicture ?? '' }} />
        <Avatar.Fallback />
      </Avatar> */}
      {/* <Typography className="text-foreground">{theme.dark ? 'Mørk' : 'Lys'}</Typography> */}
      {theme.dark ? (
        <Image
          source={require('@/assets/images/abakus-logo-light.png')}
          className="w-38 h-7"
          contentFit="contain"
        />
      ) : (
        <Image
          source={require('@/assets/images/abakus-logo-dark.png')}
          className="w-38 h-7"
          contentFit="contain"
        />
      )}
      <View className="flex flex-row gap-2.5">
        <Button className="rounded-full" variant="ghost">
          <Icon name="Settings" size={20} className="text-default-soft-hover" />
        </Button>
        <Link href={'/authed/(tabs)/notification-feed'} asChild>
          <Button className="rounded-full" variant="secondary">
            <Icon
              name={unreadCount > 0 ? 'BellRing' : 'Bell'}
              size={20}
              className="text-surface-secondary-foreground"
            />
            {unreadCount > 0 && (
              <View className="absolute -right-2 -top-2 h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1">
                <Text className="text-foreground text-xs">{unreadCount}</Text>
              </View>
            )}
          </Button>
        </Link>
      </View>
    </View>
  );
};

export default Header;
