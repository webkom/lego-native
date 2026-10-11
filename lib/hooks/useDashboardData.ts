import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { DASHBOARD_API_URL } from '../constants/dashboard';
import type {
  DashboardApiResponse,
  DashboardMember,
  DashboardOfficeTimes,
  MemberWithWorkingStats,
} from '../types/dashboard';
import { calculateSessionDuration, formatTotalHours } from '../utils/dashboardTime';

const fetchDashboardData = async (): Promise<DashboardApiResponse> => {
  const response = await fetch(DASHBOARD_API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data (${response.status})`);
  }
  return (await response.json()) as DashboardApiResponse;
};

const matchesGithub = (officeHandle?: string, memberHandle?: string): boolean => {
  if (!officeHandle || !memberHandle) return false;
  return officeHandle.toLowerCase() === memberHandle.toLowerCase();
};

export const useDashboardData = () => {
  const [now, setNow] = useState<Date>(() => new Date());

  // Update live clock every 10 seconds to keep working time counters accurate
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const query = useQuery<DashboardApiResponse>({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    refetchInterval: 1000 * 60 * 2, // 2 minutes
    retry: 2,
  });

  const membersWithStats = useMemo<MemberWithWorkingStats[]>(() => {
    if (!query.data?.members) {
      return [];
    }

    const members = query.data.members;
    const officeTimes = query.data.office_times ?? [];

    // Find the member with highest total time among active members
    const activeOfficeTimes = officeTimes.filter((ot) => {
      const correspondingMember = members.find((m) => matchesGithub(ot.github_name, m.github));
      return correspondingMember?.active;
    });

    const leaderGithub =
      activeOfficeTimes.length > 0
        ? activeOfficeTimes
            .reduce((prev, curr) => (curr.total_time > prev.total_time ? curr : prev))
            .github_name.toLowerCase()
        : null;

    const mapped = members.map<MemberWithWorkingStats>((member: DashboardMember) => {
      const officeTime = officeTimes.find((ot: DashboardOfficeTimes) =>
        matchesGithub(ot.github_name, member.github)
      );
      const isPresent = officeTime?.is_active === 1;
      const isLeader = Boolean(
        leaderGithub &&
          matchesGithub(member.github, leaderGithub) &&
          member.active &&
          (officeTime?.total_time ?? 0) > 0
      );

      return {
        name: member.name,
        avatar: member.avatar,
        github: member.github,
        isWebkomActive: member.active,
        isPresent,
        isOfficeTimeLeader: isLeader,
        lastSeen: officeTime?.last_seen,
        sessionDurationFormatted: isPresent
          ? calculateSessionDuration(officeTime?.last_seen, now)
          : '-',
        totalHoursFormatted: formatTotalHours(officeTime?.total_time),
        totalSeconds: officeTime?.total_time ?? 0,
      };
    });

    // Sort matching office-dashboard sorting logic:
    return mapped.sort((a, b) => {
      // 1. Present members first
      if (a.isPresent !== b.isPresent) {
        return a.isPresent ? -1 : 1;
      }

      // If both are present, sort by arrival time (earliest first)
      if (a.isPresent && b.isPresent) {
        const aSeen = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
        const bSeen = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
        if (aSeen && bSeen) {
          return aSeen - bSeen;
        }
      }

      // 2. Both offline: active webkom members first
      if (a.isWebkomActive !== b.isWebkomActive) {
        return a.isWebkomActive ? -1 : 1;
      }

      // 3. Among same active group: sort by most recently seen
      if (a.lastSeen && b.lastSeen) {
        return a.lastSeen < b.lastSeen ? 1 : -1;
      }
      if (a.lastSeen && !b.lastSeen) return -1;
      if (!a.lastSeen && b.lastSeen) return 1;

      // 4. Alphabetical fallback
      return a.name.localeCompare(b.name, 'nb');
    });
  }, [query.data, now]);

  const activeCount = useMemo(
    () => membersWithStats.filter((m) => m.isPresent).length,
    [membersWithStats]
  );

  return {
    ...query,
    members: membersWithStats,
    activeCount,
    totalCount: membersWithStats.length,
  };
};
