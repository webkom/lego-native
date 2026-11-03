import { MotiView } from 'moti';
import { View } from 'react-native';

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
          <MotiView
            key={'dot-' + i}
            animate={{ width: active ? 20 : 8, opacity: active ? 1 : 0.4 }}
            transition={{ type: 'timing', duration: 200 }}
            className={active ? 'bg-accent h-2 rounded-full' : 'bg-muted h-2 rounded-full'}
          />
        );
      })}
    </View>
  );
};

export default PaginationDots;
