import { Surface, Typography } from 'heroui-native';
import { useState } from 'react';
import { View } from 'react-native';

type PollResultItemProps = {
  name: string;
  votes: number;
  totalVotes: number;
};

const PollResultItem = ({ name, votes, totalVotes }: PollResultItemProps) => {
  const [rowWidth, setRowWidth] = useState(0);

  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
  const percentageText = `${Math.round(percentage)}%`;

  return (
    <Surface
      onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
      className="relative flex w-full flex-row items-center justify-between overflow-hidden bg-black/20 px-0 py-0">
      <Typography className="text-danger-foreground py-2 pl-4">{name}</Typography>
      <Typography className="text-danger-foreground pr-4">{percentageText}</Typography>

      <View
        className="bg-danger-foreground absolute left-0 top-0 h-full overflow-hidden"
        style={{ width: `${percentage}%` }}>
        <View
          className="flex h-full flex-row items-center justify-between"
          style={{ width: rowWidth }}>
          <Typography className="text-danger py-2 pl-4">{name}</Typography>
          <Typography className="text-danger pr-4">{percentageText}</Typography>
        </View>
      </View>
    </Surface>
  );
};

export default PollResultItem;
