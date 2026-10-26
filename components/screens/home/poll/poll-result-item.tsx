import { Typography } from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';

type PollResultItemProps = {
  name: string;
  votes: number;
  totalVotes: number;
};

const PollResultItem = ({ name, votes, totalVotes }: PollResultItemProps) => {
  const [rowWidth, setRowWidth] = useState(0);

  const percentage = totalVotes > 0 ? Math.min((votes / totalVotes) * 100, 100) : 0;
  const percentageText = `${Math.round(percentage)}%`;

  return (
    <View
      onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
      className="relative h-10 w-full overflow-hidden rounded-full bg-black/20">
      <View
        className="absolute bottom-0 left-0 top-0 flex flex-row items-center justify-between gap-3 px-3"
        style={{ width: rowWidth }}>
        <Typography className="text-danger-foreground flex-1" numberOfLines={1}>
          {name}
        </Typography>
        <Typography className="text-danger-foreground">{percentageText}</Typography>
      </View>

      <View
        className="bg-danger-foreground absolute bottom-0 left-0 top-0 overflow-hidden"
        style={{ width: `${percentage}%` }}>
        <View
          className="flex h-full flex-row items-center justify-between gap-3 px-3"
          style={{ width: rowWidth }}>
          <Typography className="text-danger flex-1" numberOfLines={1}>
            {name}
          </Typography>
          <Typography className="text-danger">{percentageText}</Typography>
        </View>
      </View>
    </View>
  );
};

export default PollResultItem;
