import type { TFunction } from 'i18next';

import type { SoundcheckStep } from '../../domain/types';

type PlaceholderCopy = { title: string; body: string };

export function getPlaceholderCopy(step: SoundcheckStep, t: TFunction): PlaceholderCopy | null {
  switch (step) {
    case 'individual':
      return {
        title: t('placeholders.individual.title'),
        body: t('placeholders.individual.body'),
      };
    case 'comparison':
      return {
        title: t('placeholders.comparison.title'),
        body: t('placeholders.comparison.body'),
      };
    case 'fullBand':
      return {
        title: t('placeholders.fullBand.title'),
        body: t('placeholders.fullBand.body'),
      };
    case 'checklist':
      return {
        title: t('placeholders.checklist.title'),
        body: t('placeholders.checklist.body'),
      };
    default:
      return null;
  }
}
