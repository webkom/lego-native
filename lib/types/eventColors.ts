import type { components } from './schema';

type EventTypeEnum = components['schemas']['EventTypeEnum'];

export type ConfigProperties = {
  displayName: string;
  color: string;
  textColor: string;
};

export const EventTypeConfig: Record<EventTypeEnum, ConfigProperties> = {
  company_presentation: {
    displayName: 'Bedriftspresentasjon',
    color: '#A1C34A',
    textColor: '#000',
  },
  course: {
    displayName: 'Kurs',
    color: '#52B0EC',
    textColor: '#000',
  },
  party: {
    displayName: 'Fest',
    color: '#eac922',
    textColor: '#000',
  },
  social: {
    displayName: 'Sosialt',
    color: '#e74c3c',
    textColor: '#FFF',
  },
  gala: {
    displayName: 'Galla',
    color: '#ffd700',
    textColor: '#000',
  },
  breakfast_talk: {
    displayName: 'Frokostforedrag',
    color: '#86D1D0',
    textColor: '#000',
  },
  lunch_presentation: {
    displayName: 'Lunsjpresentasjon',
    color: '#A1C34A',
    textColor: '#000',
  },
  event: {
    displayName: 'Arrangement',
    color: '#dc2626',
    textColor: '#FFF',
  },
  alternative_presentation: {
    displayName: 'Alternativ bedpres',
    color: '#8A2BE2',
    textColor: '#FFF',
  },
  nexus_event: {
    displayName: 'NEXUS-arrangement',
    color: '#00509E',
    textColor: '#FFF',
  },
  other: {
    displayName: 'Annet',
    color: '#000',
    textColor: '#FFF',
  },
  // TODO: Interest events not implemented yet
  interest_event: {
    displayName: 'Interessearrangement',
    color: '#6B7280',
    textColor: '#FFF',
  },
};
