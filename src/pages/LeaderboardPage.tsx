import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const leaderboard = [
  { rank: 1, name: "Rohan K.", hours: 62, game: "Valorant", score: 1980 },
  { rank: 2, name: "Ishita P.", hours: 55, game: "FIFA 24", score: 1840 },
  { rank: 3, name: "Vikram S.", hours: 48, game: "Tekken 8", score: 1720 },
  { rank: 4, name: "Aisha M.", hours: 42, game: "Fortnite", score: 1610 },
  { rank: 5, name: "Karan D.", hours: 37, game: "Rocket League", score: 1505 },
];

export const LeaderboardPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">Top gamers at VMOS</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Rankings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="flex items-center justify-between p-3 rounded-lg border border-border/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    #{entry.rank}
                  </div>
                  <div>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">Fav: {entry.game}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-lg">{entry.hours}h</p>
                  <p className="text-xs text-primary">Score: {entry.score}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
