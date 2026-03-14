import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Trophy, Calendar } from "lucide-react";
import tournamentPoster from "@/assets/tournament-poster.jpg";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Tournament {
  id: string;
  name: string;
  game: string;
  date: string;
  prize: string;
}

const defaultTournaments: Tournament[] = [
  { id: "seed-1", name: "VMOS Championship 2025", game: "FIFA 24", date: "2025-02-15", prize: "₹10,000" },
];

const TournamentsPage = () => {
  const [tournaments] = useLocalStorage<Tournament[]>("vmos-tournaments", defaultTournaments);
  const primary = tournaments[0];
  const googleFormUrl = "https://forms.google.com/your-tournament-form";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold">
            Gaming <span className="text-primary">Tournaments</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Compete & win exciting prizes
          </p>
        </div>

        {/* Tournament Poster */}
        <div className="glass-card rounded-xl overflow-hidden mb-6">
          <div className="relative">
            <img
              src={tournamentPoster}
              alt="Esports Tournament"
              className="w-full aspect-square md:aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        </div>

        {/* Tournament Details */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <h2 className="font-heading text-xl font-bold text-primary mb-4">
            {primary?.name || "Upcoming Tournament"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{primary?.date || "TBD"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-xs text-muted-foreground">Game</p>
                <p className="font-medium">{primary?.game || "TBD"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <Trophy className="h-8 w-8 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Prize Pool</p>
                <p className="font-medium">{primary?.prize || "TBD"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <p>🎮 <strong className="text-foreground">Games:</strong> FIFA 24, Call of Duty, Tekken 8</p>
            <p>📍 <strong className="text-foreground">Venue:</strong> VMOS Game Station</p>
            <p>⏰ <strong className="text-foreground">Time:</strong> 4:00 PM onwards</p>
            <p>💰 <strong className="text-foreground">Entry Fee:</strong> ₹200 per participant</p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-heading text-sm font-semibold mb-2">Prizes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>🥇 1st Place: ₹5,000 + Trophy</li>
              <li>🥈 2nd Place: ₹3,000</li>
              <li>🥉 3rd Place: ₹2,000</li>
            </ul>
          </div>
        </div>

        {/* Registration Options */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="font-heading text-lg font-bold mb-4">
            Register Now
          </h2>
          <div className="space-y-4">
            <Button
              variant="neon"
              size="lg"
              className="w-full"
              onClick={() => window.open(googleFormUrl, "_blank")}
            >
              <ExternalLink className="h-5 w-5" />
              Register via Google Form
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">or</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="font-medium mb-1">On-Spot Registration</p>
              <p className="text-sm text-muted-foreground">
                Visit VMOS Game Station and register in person.<br />
                Limited slots available!
              </p>
            </div>
          </div>
        </div>

        {/* Past Tournaments Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Stay tuned for more tournaments! Follow us for updates.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TournamentsPage;
