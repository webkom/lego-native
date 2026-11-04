import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

const AnimatedView = withUniwind(Animated.View);

type PaginationDotsProps = {
  count: number;
  activeIndex: number;
};

const PaginationDots = ({ count, activeIndex }: PaginationDotsProps) => {
  if (count <= 1) return null;

  return (
    <View className="flex flex-row items-center justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => {
        const active = i === activeIndex;
        return (
          <AnimatedView
            key={i}
            className={active ? 'bg-accent h-2 rounded-full' : 'bg-muted h-2 rounded-full'}
            style={{
              width: active ? 20 : 8,
              opacity: active ? 1 : 0.4,
              transitionProperty: ['width', 'opacity'],
              transitionDuration: 200,
            }}
          />
        );
      })}
    </View>
  );
};

export default PaginationDots;
