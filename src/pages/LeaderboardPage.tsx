import { Layout } from "@/components/layout/Layout";
import { Medal, Trophy, Flame, Clock, Gamepad2, Crown, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

type LeaderboardEntry = {
  rank: number;
  name: string;
  hours: number;
  game: string;
  score: number;
  wins: number;
  streak: number;
  avatar: string;
};

type TimeFilter = "weekly" | "monthly" | "alltime";

const rankColors: Record<number, string> = {
  1: "from-yellow-400 to-amber-600",
  2: "from-gray-300 to-gray-500",
  3: "from-orange-400 to-orange-700",
};

const rankBorderColors: Record<number, string> = {
  1: "border-yellow-500/50 bg-yellow-500/5",
  2: "border-gray-400/50 bg-gray-400/5",
  3: "border-orange-500/50 bg-orange-500/5",
};

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("weekly");

  useEffect(() => {
    api.leaderboard.list()
      .then((items) => {
        setLeaderboard(items.map((item, index: number) => ({
          rank: Number(item.rank) || index + 1,
          name: item.name,
          hours: Number(item.hours) || 0,
          game: item.game,
          score: Number(item.score) || 0,
          wins: Number(item.wins) || 0,
          streak: Number(item.streak) || 0,
          avatar: item.avatar || "🎮",
        })));
      })
      .catch(() => setLeaderboard([]));
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumHeights = ["h-28", "h-36", "h-24"];
  const podiumLabels = ["2nd", "1st", "3rd"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Medal className="h-5 w-5 text-gold" />
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                Leader<span className="text-gradient">board</span>
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">Top gamers at VMOS Game Station</p>
          </div>
        </div>

        {/* Time Filters */}
        <div className="flex gap-2 mb-8">
          {(["weekly", "monthly", "alltime"] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all duration-200 capitalize",
                timeFilter === filter
                  ? "bg-gold text-black"
                  : "bg-surface-2 text-muted-foreground hover:text-foreground border border-border/50"
              )}
            >
              {filter === "alltime" ? "All Time" : filter}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-3 mb-10 px-4">
          {podiumOrder.map((player, index) => (
            <div key={player.rank} className="flex flex-col items-center flex-1 max-w-[140px] animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
              {/* Avatar */}
              <div className={cn(
                "relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-2 border-2 bg-surface-2",
                index === 1 ? "border-yellow-500 ring-2 ring-yellow-500/30" : index === 0 ? "border-gray-400" : "border-orange-500"
              )}>
                {player.avatar}
                {index === 1 && (
                  <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-5 text-yellow-400 animate-float" />
                )}
              </div>

              {/* Name */}
              <p className="font-heading font-bold text-sm text-center truncate w-full">{player.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{player.game}</p>

              {/* Score */}
              <p className={cn(
                "font-mono font-bold text-sm mb-2",
                index === 1 ? "text-yellow-400" : index === 0 ? "text-gray-300" : "text-orange-400"
              )}>
                {player.score} pts
              </p>

              {/* Podium Bar */}
              <div className={cn(
                "w-full rounded-t-xl bg-gradient-to-b flex items-center justify-center",
                podiumHeights[index],
                rankColors[player.rank]
              )}>
                <span className="font-display font-bold text-lg text-black/80">{podiumLabels[index]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-surface-2 border border-border/50 text-center">
            <Gamepad2 className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="font-mono font-bold text-lg">{leaderboard.reduce((s, p) => s + p.hours, 0)}h</p>
            <p className="text-xs text-muted-foreground font-heading">Total Hours</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-2 border border-border/50 text-center">
            <Trophy className="h-5 w-5 mx-auto mb-1 text-gold" />
            <p className="font-mono font-bold text-lg">{leaderboard.reduce((s, p) => s + p.wins, 0)}</p>
            <p className="text-xs text-muted-foreground font-heading">Total Wins</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-2 border border-border/50 text-center">
            <Flame className="h-5 w-5 mx-auto mb-1 text-neon-orange" />
            <p className="font-mono font-bold text-lg">{leaderboard.length ? Math.max(...leaderboard.map((p) => p.streak)) : 0}</p>
            <p className="text-xs text-muted-foreground font-heading">Best Streak</p>
          </div>
        </div>

        {/* Rankings List */}
        <div className="space-y-3">
          {rest.map((entry, index) => (
            <div
              key={entry.rank}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface-2 border border-border/50 hover:border-primary/20 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${(index + 3) * 80}ms` }}
            >
              {/* Rank */}
              <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center font-mono font-bold text-muted-foreground flex-shrink-0">
                #{entry.rank}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{entry.avatar}</span>
                  <div>
                    <p className="font-heading font-semibold text-sm">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.game}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-right">
                {entry.streak > 0 && (
                  <div className="flex items-center gap-1 text-neon-orange">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="text-xs font-mono font-bold">{entry.streak}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono">{entry.hours}h</span>
                </div>
                <div>
                  <p className="font-mono font-bold text-sm text-primary">{entry.score}</p>
                  <p className="text-[10px] text-muted-foreground">pts</p>
                </div>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8 rounded-2xl border border-dashed border-border/60">
              No leaderboard data available.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
