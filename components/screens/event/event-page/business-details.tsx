import Icon from '@/components/icon';
import { Text } from '@/components/ui/text';
import { components } from '@/lib/types/schema';
import { cn } from '@/lib/utils';
import { Image } from 'expo-image';
import { Chip, Surface, Typography } from 'heroui-native';
import { ComponentProps, useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import SectionTitle from './section-title';

type BusinessDetailsProps = {
  company?: components['schemas']['CompanyDetail'] | null;
  className?: string;
};

export function BusinessDetails({ company, className }: BusinessDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  if (!company || !company.name) {
    return null;
  }

  const handleOpenWebsite = () => {
    if (!company.website) return;
    const url = company.website.startsWith('http') ? company.website : `https://${company.website}`;
    void Linking.openURL(url).catch((err) => console.error('Failed to open website:', err));
  };

  const handleOpenMap = () => {
    if (!company.address) return;
    const url = `https://maps.google.com/?q=${encodeURIComponent(company.address)}`;
    void Linking.openURL(url).catch((err) => console.error('Failed to open map:', err));
  };

  const handleCallPhone = () => {
    if (!company.phone) return;
    void Linking.openURL(`tel:${company.phone}`).catch((err) =>
      console.error('Failed to call phone:', err)
    );
  };

  const hasContactInfo = Boolean(company.website || company.address || company.phone);
  const descriptionLength = company.description?.length ?? 0;
  const isLongDescription = descriptionLength > 220;

  const displayDescription =
    isLongDescription && !isExpanded
      ? `${company.description?.slice(0, 220)}...`
      : company.description;

  const primaryLogo = company.logo;
  const fallbackLogo = company.logoPlaceholder;
  const activeImageUri = !imageLoadError && primaryLogo ? primaryLogo : fallbackLogo;

  return (
    <Surface>
      <View className={cn('gap-2.5', className)}>
        {/* Section Header */}

        <SectionTitle icon="Building2" title="Om bedriften" className="mb-2.5" />
        {/* Main Card */}

        {/* Header Row: Logo & Company Name */}
        <View className="flex-row items-center gap-3.5">
          {activeImageUri ? (
            <View className="border-border bg-secondary/30 h-16 w-16 items-center justify-center overflow-hidden rounded-xl border p-2">
              <Image
                source={{ uri: activeImageUri }}
                contentFit="contain"
                onError={() => {
                  if (!imageLoadError) {
                    setImageLoadError(true);
                  }
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          ) : (
            <View className="border-border bg-secondary h-16 w-16 items-center justify-center rounded-xl border p-2">
              <Icon name="Building2" size={28} className="text-default-soft-foreground" />
            </View>
          )}

          <View className="flex-1 gap-1">
            <Typography type="h3" className="font-bold">
              {company.name}
            </Typography>
            <View className="flex flex-row">
              {company.companyType && (
                <Chip size="sm">
                  <Chip.Label>{company.companyType}</Chip.Label>
                </Chip>
              )}
            </View>
          </View>
        </View>

        {/* Description Section */}
        {company.description && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => setIsExpanded(!isExpanded)}>
            <View className="gap-2 pt-3">
              <Typography type="body-sm" className="text-surface-foreground">
                {displayDescription}
              </Typography>
              {isLongDescription && (
                <View className="flex-row items-center gap-1 self-start py-1">
                  <Text className="text-primary text-xs font-semibold">
                    {isExpanded ? 'Vis mindre' : 'Vis mer'}
                  </Text>
                  <Icon
                    name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                    size={14}
                    className="text-primary"
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}

        {/* Contact Details & Quick Links */}
        {hasContactInfo && (
          <View className="gap-2 pt-3">
            <View className="gap-2">
              {company.website && (
                <BusinessDetails.ContactInfo
                  icon="Globe"
                  label={company.website.replace(/^https?:\/\//, '')}
                  onPress={handleOpenWebsite}
                />
              )}

              {company.address && (
                <BusinessDetails.ContactInfo
                  icon="MapPin"
                  label={company.address}
                  onPress={handleOpenMap}
                />
              )}

              {company.phone && (
                <BusinessDetails.ContactInfo
                  icon="Phone"
                  label={company.phone}
                  onPress={handleCallPhone}
                />
              )}
            </View>
          </View>
        )}
      </View>
    </Surface>
  );
}

type BusinessDetailsContactInfoProps = {
  icon: ComponentProps<typeof Icon>['name'];
  label: string;
  onPress?: () => void;
} & ComponentProps<typeof Surface>;
BusinessDetails.ContactInfo = ({
  icon,
  label,
  onPress,
  className,
  ...props
}: BusinessDetailsContactInfoProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Surface
        variant="secondary"
        className={cn('flex flex-row items-center justify-between gap-2.5 pr-5', className)}
        {...props}>
        <View className="flex flex-row gap-2.5">
          <Icon name={icon} size={16} className="text-primary" />
          <Text className="text-foreground text-xs font-medium">{label}</Text>
        </View>
        <Icon name="ExternalLink" size={14} className="text-default-soft-foreground" />
      </Surface>
    </TouchableOpacity>
  );
};

export default BusinessDetails;
