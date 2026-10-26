import { cn } from '@/lib/cn';
import { Image as ExpoImage } from 'expo-image';
import { useTheme } from 'expo-router/react-navigation';
import { View, ViewProps } from 'react-native';
import { withUniwind } from 'uniwind';

const Image = withUniwind(ExpoImage);

type HeaderProps = {} & ViewProps;
const Header = ({ className }: HeaderProps) => {
  const theme = useTheme();

  return (
    <View
      className={cn(
        'pt-safe-offset-5 border-border flex w-full flex-row items-center justify-between gap-2.5 border-b px-5 pb-5',
        className
      )}>
      {theme.dark ? (
        <Image
          source={require('@/assets/images/abakus-logo-light.png')}
          className="h-7 w-28"
          contentFit="contain"
        />
      ) : (
        <Image
          source={require('@/assets/images/abakus-logo-dark.png')}
          className="h-7 w-28"
          contentFit="contain"
        />
      )}
    </View>
  );
};

export default Header;
