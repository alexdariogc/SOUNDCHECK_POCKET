import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { STEP_LABEL_KEYS, type SoundcheckStep } from '../../domain/types';
import { useSoundcheckSession } from '../../session/SoundcheckSessionContext';
import { getPlaceholderCopy } from './placeholderCopy';
import { PrimaryButton } from '../../ui/components/PrimaryButton';
import { StepScaffold } from '../../ui/components/StepScaffold';
import { colors, spacing } from '../../ui/theme';

type Props = {
  step: SoundcheckStep;
};

export function PlaceholderStepScreen({ step }: Props) {
  const { t } = useTranslation();
  const { goToNextStep, goToPreviousStep } = useSoundcheckSession();
  const copy = getPlaceholderCopy(step, t);

  return (
    <StepScaffold
      step={step}
      title={copy?.title ?? t(STEP_LABEL_KEYS[step])}
      subtitle={copy?.body}
      footer={
        <>
          <PrimaryButton label={t('common.continue')} onPress={goToNextStep} />
          <PrimaryButton
            label={t('common.back')}
            variant="secondary"
            onPress={goToPreviousStep}
            style={styles.backBtn}
          />
        </>
      }
    >
      <Text style={styles.comingSoon}>{t('common.comingSoon')}</Text>
    </StepScaffold>
  );
}

const styles = StyleSheet.create({
  comingSoon: {
    color: colors.textMuted,
    fontSize: 15,
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  backBtn: {
    marginTop: spacing.sm,
  },
});
