import { Layout } from "@/components/layout/Layout";
import { Trophy, Calendar, Users, Clock, MapPin, MessageCircle, Star, ChevronRight, Zap, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Tournament {
  id: string;
  name: string;
  game: string;
  date: string;
  time: string;
  entryFee: number;
  prizePool: number;
  maxSlots: number;
  filledSlots: number;
  status: "upcoming" | "live" | "completed";
  icon: string;
  gradient: string;
}

const statusColors: Record<string, string> = {
  upcoming: "bg-accent/15 text-accent border-accent/30",
  live: "bg-neon-red/15 text-neon-red border-neon-red/30",
  completed: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<string, string> = {
  upcoming: "Upcoming",
  live: "🔴 Live",
  completed: "Completed",
};

const openWhatsApp = (tournamentName: string) => {
  window.open(
    `https://wa.me/917010905241?text=${encodeURIComponent(`Hi! I want to register for the ${tournamentName} tournament.`)}`,
    "_blank"
  );
};

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  useEffect(() => {
    api.tournaments.list()
      .then((items) => {
        setTournaments(items.map((item) => ({
          id: item._id || item.id,
          name: item.name,
          game: item.game,
          date: item.date,
          time: item.time,
          entryFee: Number(item.entryFee) || 0,
          prizePool: Number(item.prizePool) || 0,
          maxSlots: Number(item.maxSlots) || 0,
          filledSlots: Number(item.filledSlots) || 0,
          status: item.status,
          icon: item.icon || "🎮",
          gradient: item.gradient || "from-cyan-500 to-blue-600",
        })));
      })
      .catch(() => setTournaments([]));
  }, []);

  const filtered = filter === "all" ? tournaments : tournaments.filter((t) => t.status === filter);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-gold" />
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Tourna<span className="text-gradient-gold">ments</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Compete, win prizes, and prove your skills</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "upcoming", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all capitalize",
                filter === f
                  ? "bg-gold text-black"
                  : "bg-surface-2 text-muted-foreground border border-border/50 hover:bg-surface-3"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Featured Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-yellow-500/15 via-orange-500/10 to-red-500/5 border border-yellow-500/20 p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-gold animate-pulse-neon" />
              <span className="text-xs font-heading font-semibold text-gold uppercase tracking-widest">Featured</span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold mb-1">VMOS Championship Series</h2>
            <p className="text-muted-foreground text-sm mb-4">Weekly tournaments across multiple games with cash prizes</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Every Weekend</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>VMOS Arena</span>
              </div>
              <div className="flex items-center gap-1.5 text-gold font-mono font-bold">
                <Trophy className="h-4 w-4" />
                <span>₹10,000+ Prizes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Cards */}
        <div className="space-y-4">
          {filtered.map((tournament, index) => {
            const slotsPercent = (tournament.filledSlots / tournament.maxSlots) * 100;
            const isFull = tournament.filledSlots >= tournament.maxSlots;

            return (
              <div
                key={tournament.id}
                className="rounded-2xl bg-surface-2 border border-border/50 overflow-hidden hover:border-primary/20 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Game Icon */}
                    <div className={cn(
                      "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl flex-shrink-0 shadow-lg",
                      tournament.gradient
                    )}>
                      {tournament.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-bold truncate">{tournament.name}</h3>
                        <span className={cn(
                          "text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full border flex-shrink-0",
                          statusColors[tournament.status]
                        )}>
                          {statusLabels[tournament.status]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{tournament.game}</p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{tournament.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{tournament.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Gamepad2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-mono">₹{tournament.entryFee}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gold">
                          <Trophy className="h-3.5 w-3.5" />
                          <span className="font-mono font-bold">₹{tournament.prizePool.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Slots Progress */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            <Users className="h-3.5 w-3.5 inline mr-1" />
                            {tournament.filledSlots}/{tournament.maxSlots} slots
                          </span>
                          {!isFull && (
                            <span className="text-accent font-mono">{tournament.maxSlots - tournament.filledSlots} left</span>
                          )}
                          {isFull && (
                            <span className="text-destructive font-mono">Full</span>
                          )}
                        </div>
                        <div className="h-1.5 bg-surface-4 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              isFull ? "bg-destructive" : slotsPercent > 75 ? "bg-neon-orange" : "bg-accent"
                            )}
                            style={{ width: `${slotsPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  {tournament.status !== "completed" && !isFull && (
                    <div className="mt-4 flex gap-3">
                      <Button
                        onClick={() => openWhatsApp(tournament.name)}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-heading font-bold py-5 rounded-xl"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-heading font-semibold text-muted-foreground">No tournaments found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TournamentsPage;
