import { Spinner, Typography } from 'heroui-native';
import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';

type RefreshingBannerProps = {
  visible?: boolean;
};

export function RefreshingBanner({ visible = false }: RefreshingBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          key="refreshing-indicator"
          from={{ translateY: -100, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          exit={{ translateY: -100, opacity: 0 }}
          className="absolute top-5 z-20 w-full items-center">
          <View className="bg-surface border-border/80 flex-row items-center gap-2 rounded-full border px-4 py-2 shadow-lg">
            <Spinner size="sm" color="accent" />
            <Typography type="body-xs" className="text-accent font-semibold">
              Oppdaterer...
            </Typography>
          </View>
        </MotiView>
      )}
    </AnimatePresence>
  );
}
