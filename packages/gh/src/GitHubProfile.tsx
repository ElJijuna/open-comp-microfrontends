import { useGhUser, useGhUserContributionMap, useGhUserPublicEvents } from '@api-hooks/gh';
import {
  Avatar,
  Badge,
  Card,
  ContributionGraph,
  type ContributionDay,
  Icon,
  Separator,
  Skeleton,
  Text,
} from '@gnome-ui/react';
import {
  FindLocation,
  GitBranch,
  GitCommit,
  GitFork,
  Person,
  Star,
  WebBrowser,
} from '@gnome-ui/icons';

export interface GitHubProfileProps {
  login: string;
}

type ContributionCalendar = {
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
};

type GhEvent = {
  id: string;
  type: string;
  repo?: { name?: string };
};

type GhPagedResponse<T> = {
  values: T[];
  hasNextPage: boolean;
  nextPage?: number;
};

const EVENT_ICON: Record<string, typeof GitCommit> = {
  PushEvent: GitCommit,
  CreateEvent: GitBranch,
  ForkEvent: GitFork,
  PullRequestEvent: GitBranch,
};

function eventLabel(event: GhEvent): string {
  const repo = event.repo?.name ?? '';
  switch (event.type) {
    case 'PushEvent':
      return `Pushed to ${repo}`;
    case 'CreateEvent':
      return `Created branch in ${repo}`;
    case 'ForkEvent':
      return `Forked ${repo}`;
    case 'PullRequestEvent':
      return `Pull request in ${repo}`;
    case 'IssuesEvent':
      return `Issue in ${repo}`;
    case 'WatchEvent':
      return `Starred ${repo}`;
    default:
      return `Activity in ${repo}`;
  }
}

export const GitHubProfile = ({ login }: GitHubProfileProps) => {
  const user = useGhUser(login);
  const contributionMap = useGhUserContributionMap(login);
  const events = useGhUserPublicEvents(login);

  if (user.error) {
    return (
      <Card padding="lg">
        <Text color="error">No se pudo cargar el perfil de {login}</Text>
      </Card>
    );
  }

  if (user.isPending) {
    return (
      <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Skeleton variant="circle" size={64} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" lines={2} />
          </div>
        </div>
        <Skeleton variant="rect" height={120} />
        <Skeleton variant="rect" height={80} />
      </Card>
    );
  }

  const u = user.data;

  const days: ContributionDay[] =
    (contributionMap.data as ContributionCalendar | undefined)?.weeks
      .flatMap((w) => w.contributionDays)
      .map((d) => ({ date: d.date, count: d.contributionCount })) ?? [];

  const recentEvents = (
    (events.data as unknown as GhPagedResponse<GhEvent> | undefined)?.values ?? []
  ).slice(0, 5);

  return (
    <Card padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <Avatar src={u.avatar_url} name={u.login} size="xl" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text variant="title-3">{u.name ?? u.login}</Text>
          <Text variant="body" color="dim">
            @{u.login}
          </Text>
          {u.bio && (
            <Text variant="caption" color="dim">
              {u.bio}
            </Text>
          )}
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {u.location && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Icon icon={FindLocation} size="sm" />
            <Text variant="caption" color="dim">
              {u.location}
            </Text>
          </div>
        )}
        {u.company && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Icon icon={Person} size="sm" />
            <Text variant="caption" color="dim">
              {u.company}
            </Text>
          </div>
        )}
        {u.html_url && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Icon icon={WebBrowser} size="sm" />
            <Text variant="caption" color="dim">
              {u.html_url}
            </Text>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Icon icon={Person} size="sm" />
          <Badge>{u.followers}</Badge>
          <Text variant="caption" color="dim">
            followers
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Text variant="caption" color="dim">
            {u.following} following
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Icon icon={Star} size="sm" />
          <Badge>{u.public_repos}</Badge>
          <Text variant="caption" color="dim">
            repos
          </Text>
        </div>
      </div>

      <Separator />

      {/* Contribution graph */}
      <Text variant="caption-heading">Contributions</Text>
      {contributionMap.isPending ? (
        <Skeleton variant="rect" height={120} />
      ) : (
        <ContributionGraph data={days} responsive weeks={52} />
      )}

      <Separator />

      {/* Recent activity */}
      <Text variant="caption-heading">Recent activity</Text>
      {events.isPending ? (
        <Skeleton variant="text" lines={5} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recentEvents.map((event) => {
            const eventIcon = EVENT_ICON[event.type] ?? GitCommit;
            return (
              <div key={event.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Icon icon={eventIcon} size="sm" />
                <Text variant="caption">{eventLabel(event)}</Text>
              </div>
            );
          })}
          {recentEvents.length === 0 && (
            <Text variant="caption" color="dim">
              No recent public activity
            </Text>
          )}
        </div>
      )}
    </Card>
  );
};

export default GitHubProfile;
