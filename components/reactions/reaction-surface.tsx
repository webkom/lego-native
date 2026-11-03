import { cn, Surface } from 'heroui-native';
import { ComponentProps } from 'react';

export type ReactionSurfaceProps = { hasReacted?: boolean } & ComponentProps<typeof Surface>;

export const ReactionSurface = ({ hasReacted, ...props }: ReactionSurfaceProps) => {
  return (
    <Surface
      className={cn(
        'flex flex-row items-center gap-1 py-3',
        hasReacted ? 'border-primary bg-primary/10' : ''
      )}
      variant="secondary"
      {...props}
    />
  );
};

export default ReactionSurface;
