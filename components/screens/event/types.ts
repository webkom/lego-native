import { components } from '@/lib/types/schema';

export type DetailedEvent = components['schemas']['EventReadUserDetailed'];

type Event = components['schemas']['EventRead'];
export type EventDigestItem = Pick<Event, 'id' | 'title' | 'startTime' | 'eventType'>;
