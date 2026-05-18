export type InstrumentId =
  | 'voice'
  | 'backing_vocals'
  | 'bass'
  | 'guitar'
  | 'keys'
  | 'acoustic_drums'
  | 'electronic_drums'
  | 'tracks'
  | 'percussion'
  | 'winds';

export type InstrumentDefinition = {
  id: InstrumentId;
  /** i18n key under instruments.items.* */
  labelKey: `instruments.items.${InstrumentId}`;
  hintKey?: 'instruments.hints.voice';
};

/** Fixed catalog — docs/PRODUCT.md */
export const INSTRUMENT_CATALOG: readonly InstrumentDefinition[] = [
  { id: 'voice', labelKey: 'instruments.items.voice', hintKey: 'instruments.hints.voice' },
  { id: 'backing_vocals', labelKey: 'instruments.items.backing_vocals' },
  { id: 'bass', labelKey: 'instruments.items.bass' },
  { id: 'guitar', labelKey: 'instruments.items.guitar' },
  { id: 'keys', labelKey: 'instruments.items.keys' },
  { id: 'acoustic_drums', labelKey: 'instruments.items.acoustic_drums' },
  { id: 'electronic_drums', labelKey: 'instruments.items.electronic_drums' },
  { id: 'tracks', labelKey: 'instruments.items.tracks' },
  { id: 'percussion', labelKey: 'instruments.items.percussion' },
  { id: 'winds', labelKey: 'instruments.items.winds' },
] as const;

export function getInstrument(id: InstrumentId): InstrumentDefinition {
  const found = INSTRUMENT_CATALOG.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Unknown instrument: ${id}`);
  }
  return found;
}
