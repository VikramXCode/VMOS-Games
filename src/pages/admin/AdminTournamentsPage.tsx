import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const AdminTournamentsPage = () => {
  const [tournaments, setTournaments] = useLocalStorage<Tournament[]>("vmos-tournaments", defaultTournaments);
  const [form, setForm] = useState<Omit<Tournament, "id">>({ name: "", game: "", date: "", prize: "" });

  const addTournament = () => {
    setTournaments((prev) => [{ id: crypto.randomUUID(), ...form }, ...prev]);
    setForm({ name: "", game: "", date: "", prize: "" });
  };

  return (
    <AdminLayout>
      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>New Tournament</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Game</Label>
              <Input value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Prize Pool</Label>
              <Input value={form.prize} onChange={(e) => setForm({ ...form, prize: e.target.value })} />
            </div>
            <Button onClick={addTournament} disabled={!form.name || !form.game || !form.date}>
              Add Tournament
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Tournaments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tournaments.length === 0 && <p className="text-sm text-muted-foreground">No tournaments yet.</p>}
            {tournaments.map((t) => (
              <div key={t.id} className="border border-border/60 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.game} • {t.date}</p>
                  <p className="text-xs text-primary">Prize: {t.prize || "TBD"}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setTournaments((prev) => prev.filter((x) => x.id !== t.id))}>
                  Remove
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
