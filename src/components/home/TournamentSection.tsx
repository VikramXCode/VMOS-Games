import { Trophy, Calendar, Users, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const openWhatsApp = () => {
  window.open("https://wa.me/917010905241?text=Hi! I want to register for a tournament.", "_blank");
};

export const TournamentSection = () => {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    api.tournaments.list().then(setItems).catch(() => setItems([]));
  }, []);

  const featured = useMemo(() => items.find((i) => i.status !== "completed") || items[0], [items]);

  return (
    <section id="tournaments" className="py-10 px-4">
      <div className="container mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-5 w-5 text-gold" />
          <h2 className="text-xl font-heading font-bold">Tournaments</h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-red-500/5 border border-yellow-500/20 p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg neon-glow-gold">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg">{featured?.name || "VMOS Championship"}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-gold fill-current" />
                <span className="text-xs text-muted-foreground font-heading">{featured?.game || "Weekly tournaments"}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-black/20 text-center">
              <Calendar className="h-4 w-4 mx-auto mb-1 text-gold" />
              <p className="text-xs font-heading font-bold">{featured?.date || "Weekends"}</p>
            </div>
            <div className="p-3 rounded-xl bg-black/20 text-center">
              <Users className="h-4 w-4 mx-auto mb-1 text-neon-orange" />
              <p className="text-xs font-heading font-bold">{featured?.maxSlots || 0} Slots</p>
            </div>
            <div className="p-3 rounded-xl bg-black/20 text-center">
              <Trophy className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
              <p className="text-xs font-mono font-bold">₹{Number(featured?.prizePool || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm mb-5 bg-black/10 rounded-xl p-4">
            <p className="flex items-center gap-2">
              <span>🎮</span>
              <span className="text-white/80"><strong className="text-white">Game:</strong> {featured?.game || "Various"}</span>
            </p>
            <p className="flex items-center gap-2">
              <span>💰</span>
              <span className="text-white/80"><strong className="text-white">Entry:</strong> ₹{Number(featured?.entryFee || 0).toLocaleString()} per participant</span>
            </p>
            <p className="flex items-center gap-2">
              <span>🏆</span>
              <span className="text-white/80"><strong className="text-white">Prizes:</strong> ₹{Number(featured?.prizePool || 0).toLocaleString()}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={openWhatsApp}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-heading font-bold py-5 rounded-xl text-base"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Register Now
            </Button>
            <Link to="/tournaments" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-yellow-500/30 text-foreground font-heading font-semibold py-5 rounded-xl hover:bg-yellow-500/10"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
