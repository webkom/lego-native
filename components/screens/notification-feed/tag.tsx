import { router } from 'expo-router';
import { Linking } from 'react-native';
import { TagProps } from './types';
import { Typography } from 'heroui-native';

export const navigateToTag = ({ link, linkType }: Pick<TagProps, 'link' | 'linkType'>) => {
  if (linkType === 'internal') {
    router.push(link);
  }
  if (linkType === 'external') {
    Linking.openURL(link);
  }
};

export const Tag = ({ link, text, linkableContent, linkType, type }: TagProps) => {
  if (!linkableContent) {
    return <Typography type={type}>{text}</Typography>;
  }

  return (
    <Typography
      type={type}
      className="font-semibold text-red-600 active:text-red-700"
      onPress={() => navigateToTag({ link, linkType })}>
      {text}
    </Typography>
  );
};
