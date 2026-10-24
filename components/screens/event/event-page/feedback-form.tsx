import { cn } from '@/lib/cn';
import { FieldError, Input, Surface, TextField, Typography } from 'heroui-native';
import { AnimatePresence, MotiView } from 'moti';
import SectionTitle from './section-title';

type FeedbackFormProps = {
  visible?: boolean;
  feedbackDescription?: string;
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  isInvalid?: boolean;
  errorMessage?: string;
};

export const FeedbackForm = ({
  visible = true,
  feedbackDescription,
  className,
  value,
  onChangeText,
  isInvalid = false,
  errorMessage = 'Legg inn et svar',
}: FeedbackFormProps) => {
  const hasCustomDescription =
    Boolean(feedbackDescription) && feedbackDescription?.trim().toLowerCase() !== 'tilbakemelding';

  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          key="feedback-form"
          from={{
            opacity: 0,
            translateY: -10,
          }}
          animate={{
            opacity: 1,
            translateY: 0,
          }}
          exit={{
            opacity: 0,
            translateY: -10,
          }}
          transition={{
            type: 'timing',
            duration: 250,
          }}
          className={className}>
          <Surface className={cn('flex flex-col gap-3', className)}>
            <SectionTitle title="Tilbakemelding" icon="MessageSquare" />

            {hasCustomDescription ? (
              <Typography type="body-sm" color="muted" className="leading-5">
                {feedbackDescription}
              </Typography>
            ) : (
              <Typography type="body-sm" color="muted" className="leading-5">
                Arrangøren ber om en tilbakemelding ved påmelding.
              </Typography>
            )}

            <TextField isInvalid={isInvalid} isRequired>
              <Input
                placeholder="Skriv inn tilbakemelding her..."
                value={value}
                onChangeText={onChangeText}
              />
              <FieldError>{errorMessage}</FieldError>
            </TextField>
          </Surface>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

export default FeedbackForm;
