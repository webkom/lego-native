import Icon from '@/components/icon';
import env from '@/env';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Button, Typography } from 'heroui-native';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

export interface UnansweredSurveysCardProps {
  unansweredSurveys?: number[];
  isRegistered?: boolean;
  onSurveyClosed?: () => void;
  className?: string;
}

export const UnansweredSurveysCard: React.FC<UnansweredSurveysCardProps> = ({
  unansweredSurveys = [],
  onSurveyClosed,
  className,
}) => {
  if (!unansweredSurveys || unansweredSurveys.length === 0) {
    return null;
  }

  const handleOpenSurvey = async (surveyId: number) => {
    const url = `${env.EXPO_PUBLIC_FRONTEND_URL}/surveys/${surveyId}/answer`;
    console.log(url);
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });
      onSurveyClosed?.();
    } catch {
      await Linking.openURL(url);
    }
  };

  return (
    <Alert status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Du har ubesvarte spørreundersøkelser</Alert.Title>
        <Alert.Description>
          Du må svare på disse før du kan melde deg på arrangementet.
        </Alert.Description>

        <View className="mt-3 gap-2">
          {unansweredSurveys.map((surveyId, index) => (
            <TouchableOpacity key={surveyId} activeOpacity={0.7}>
              <Button
                variant="secondary"
                className="justify-between"
                onPress={() => handleOpenSurvey(surveyId)}>
                <View className="flex w-fit flex-row items-center gap-2.5">
                  <Icon name="ClipboardList" className="text-accent-foreground" size={16} />
                  <Typography className="text-foreground">
                    Besvar undersøkelse {unansweredSurveys.length > 1 ? `#${index + 1}` : ''}
                  </Typography>
                </View>
                <Icon name="ExternalLink" size={14} className="text-foreground" />
              </Button>
            </TouchableOpacity>
          ))}
        </View>
      </Alert.Content>
    </Alert>
  );
};

export default UnansweredSurveysCard;
