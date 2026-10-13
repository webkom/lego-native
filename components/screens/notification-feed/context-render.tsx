import env from 'env';
import { TagProps } from './types';

const baseUrl = env.EXPO_PUBLIC_FRONTEND_URL;

export const contextRender: Record<string, (context: any) => TagProps> = {
  'users.user': (user) => ({
    link: `${baseUrl}/users/${user.username}/`,
    text: `${user.firstName} ${user.lastName}`,
    linkableContent: true,
    profilePicture: user.profilePicture,
    linkType: 'external',
  }),
  'notifications.announcement': (announcement) => ({
    link: '',
    text: announcement.message,
    linkableContent: false,
  }),
  'meetings.meetinginvitation': (context) => ({
    link: `${baseUrl}/meetings/${context.meeting.id}/`,
    text: context.meeting.title,
    linkableContent: true,
    linkType: 'external',
  }),
  'events.event': (context) => ({
    link: `/authed/(stacks)/event/${context.id}`,
    text: context.title,
    linkableContent: true,
    linkType: 'internal',
  }),
};
