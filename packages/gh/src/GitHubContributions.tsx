import { useGhUserContributionMap } from '@api-hooks/gh';
import { ContributionGraph, type ContributionDay, Skeleton } from '@gnome-ui/react';

export interface GitHubContributionsProps {
  login: string;
  weeks?: number;
}

type ContributionCalendar = {
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
};

export const GitHubContributions = ({ login, weeks = 52 }: GitHubContributionsProps) => {
  const contributionMap = useGhUserContributionMap(login);

  if (contributionMap.isPending) {
    return <Skeleton variant="rect" height={120} style={{ width: '100%' }} />;
  }

  const days: ContributionDay[] =
    (contributionMap.data as ContributionCalendar | undefined)?.weeks
      .flatMap((w) => w.contributionDays)
      .map((d) => ({ date: d.date, count: d.contributionCount })) ?? [];

  return <ContributionGraph data={days} responsive weeks={weeks} />;
};

export default GitHubContributions;
