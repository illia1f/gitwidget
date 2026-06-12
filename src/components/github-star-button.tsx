import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

type Props = {
  repo: string; // "owner/name"
};

function formatStars(stars: number): string {
  if (stars < 1000) return `${stars}`;
  if (stars < 1_000_000) return `${(stars / 1000).toFixed(1)}k`;
  return `${(stars / 1_000_000).toFixed(1)}m`;
}

async function getStarCount(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function GitHubStarButton({ repo }: Props) {
  const stars = await getStarCount(repo);

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="btn-transition border-border bg-background text-foreground hover:bg-muted hover:text-foreground shadow-sm"
      aria-label="Star on GitHub"
    >
      <a
        href={`https://github.com/${repo}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2"
      >
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
        <span className="text-sm font-medium">Star</span>
        <span className="text-muted-foreground ml-1 text-sm font-medium tabular-nums">
          {stars === null ? '—' : formatStars(stars)}
        </span>
      </a>
    </Button>
  );
}
