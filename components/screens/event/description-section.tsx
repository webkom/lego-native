import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from '@/components/icon';
import SectionTitle from './event-page/section-title';
import { RenderHTML } from '@nanogiants/react-native-render-html';
import { Surface, Typography, useThemeColor } from 'heroui-native';

type DescriptionSectionProps = {
  description?: string;
  previewDescription?: string;
  className?: string;
};

export function DescriptionSection({
  description,
  previewDescription,
  className,
}: DescriptionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [foreground, linkColor] = useThemeColor(['foreground', 'link']);

  if (!description || description.trim() === '') {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setIsExpanded((prev) => !prev)}
      className={className}>
      <View className={`gap-2.5`}>
        <Surface variant="default" className="flex flex-col gap-2.5">
          <SectionTitle title="Om arrangementet" icon="FileText" className="mb-2.5" />
          {!isExpanded && (
            <Typography color="muted" className="text-sm leading-6">
              {previewDescription}
            </Typography>
          )}

          {isExpanded && (
            <View>
              <RenderHTML
                html={description}
                baseStyle={{
                  color: foreground,
                  fontSize: 14,
                  lineHeight: 22,
                }}
                markerColor={foreground}
                tagStyles={{
                  a: {
                    text: {
                      color: linkColor,
                    },
                  },
                }}
              />
            </View>
          )}

          <View className="flex-row items-center gap-1 self-start pt-1">
            <Typography className="text-xs font-semibold">
              {isExpanded ? 'Vis mindre' : 'Vis mer'}
            </Typography>
            <Icon
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              size={14}
              className="text-primary"
            />
          </View>
        </Surface>
      </View>
    </TouchableOpacity>
  );
}

export default DescriptionSection;
