interface EventType {
  [key: string]: string;
}

export const EVENT_CONSTANTS: EventType = {
  company_presentation: "Bedriftspresentasjon",
  lunch_presentation: "Lunsjpresentasjon",
  alternative_presentation: "Alternativ bedpres",
  course: "Kurs",
  breakfast_talk: "Frokostforedrag",
  party: "Fest",
  social: "Sosialt",
  event: "Arrangement",
  kid_event: "KID-arrangement",
  other: "Annet",
};

export interface Event {
  id: number;
  title: string;
  descripstion: string;
  cover: string;
  coverPlaceholder: string;
  eventType: string;
  eventStatusType: string;
  location: string;
  startTime: string;
  endTime: string;
  thumbnail: string;
  totalCapacity: number;
  company: Object;
  registrationCount: number;
  activationTime: string;
  isAdmitted: boolean;
  survey: string;
  requireAuth: boolean;
}
