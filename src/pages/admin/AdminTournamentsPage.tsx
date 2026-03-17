import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

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
}

const mapTournament = (raw: Record<string, unknown>): Tournament => ({
  id: raw._id || raw.id,
  name: String(raw.name || ""),
  game: String(raw.game || ""),
  date: String(raw.date || ""),
  time: String(raw.time || ""),
  entryFee: Number(raw.entryFee) || 0,
  prizePool: Number(raw.prizePool) || 0,
  maxSlots: Number(raw.maxSlots) || 0,
  filledSlots: Number(raw.filledSlots) || 0,
  status: (raw.status as Tournament["status"]) || "upcoming",
});

export const AdminTournamentsPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [form, setForm] = useState({
    name: "",
    game: "",
    date: "",
    time: "18:00",
    entryFee: 0,
    prizePool: 0,
    maxSlots: 16,
    status: "upcoming" as "upcoming" | "live" | "completed",
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTournaments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.tournaments.list();
      setTournaments(data.map(mapTournament));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tournaments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTournaments();
  }, []);

  useEffect(() => {
    const openSheet = () => setSheetOpen(true);
    window.addEventListener("admin-primary-action", openSheet);
    return () => window.removeEventListener("admin-primary-action", openSheet);
  }, []);

  const addTournament = async () => {
    if (!form.name || !form.game || !form.date || !form.time || !form.maxSlots) return;

    setIsSaving(true);
    setError(null);
    try {
      const created = await api.tournaments.create({
        name: form.name,
        game: form.game,
        date: form.date,
        time: form.time,
        entryFee: form.entryFee,
        prizePool: form.prizePool,
        maxSlots: form.maxSlots,
        filledSlots: 0,
        status: form.status,
      });

      setTournaments((prev) => [mapTournament(created), ...prev]);
      setForm({
        name: "",
        game: "",
        date: "",
        time: "18:00",
        entryFee: 0,
        prizePool: 0,
        maxSlots: 16,
        status: "upcoming",
      });
      setSheetOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create tournament");
    } finally {
      setIsSaving(false);
    }
  };

  const removeTournament = async (id: string) => {
    setRemoveId(id);
    setError(null);
    try {
      await api.tournaments.delete(id);
      setTournaments((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete tournament");
    } finally {
      setRemoveId(null);
    }
  };

  return (
    <AdminLayout>
      <Button onClick={() => setSheetOpen(true)} className="w-full rounded-xl h-11 mb-4 lg:w-auto">
        <Plus className="h-4 w-4 mr-1" /> Add Tournament
      </Button>

      <Card className="rounded-2xl bg-surface-2/90 border-border/60">
          <CardHeader>
            <CardTitle>Existing Tournaments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && (
              <div className="space-y-2">
                <div className="h-16 rounded-xl animate-shimmer" />
                <div className="h-16 rounded-xl animate-shimmer" />
              </div>
            )}
            {tournaments.length === 0 && <p className="text-sm text-muted-foreground">No tournaments yet.</p>}
            {tournaments.map((t) => (
              <div key={t.id} className="border border-border/60 rounded-2xl p-3 flex items-center justify-between bg-background/30">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.game} • {t.date} • {t.time}</p>
                  <p className="text-xs text-primary">Prize: ₹{t.prizePool.toLocaleString()} • Entry: ₹{t.entryFee.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground capitalize">Status: {t.status} • Slots: {t.filledSlots}/{t.maxSlots}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-xl"
                  disabled={removeId === t.id}
                  onClick={() => void removeTournament(t.id)}
                >
                  {removeId === t.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            ))}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[86vh] rounded-t-3xl bg-[#0B0F1A] border-t border-primary/20">
          <div className="w-12 h-1.5 rounded-full bg-border mx-auto mt-2 mb-3" />
          <SheetHeader className="text-left px-1">
            <SheetTitle className="font-heading text-lg">Add Tournament</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Game</Label>
              <Input value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Prize Pool</Label>
              <Input
                type="number"
                value={form.prizePool}
                onChange={(e) => setForm({ ...form, prizePool: Number(e.target.value) })}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Entry Fee</Label>
              <Input
                type="number"
                value={form.entryFee}
                onChange={(e) => setForm({ ...form, entryFee: Number(e.target.value) })}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Slots</Label>
              <Input
                type="number"
                min={2}
                value={form.maxSlots}
                onChange={(e) => setForm({ ...form, maxSlots: Number(e.target.value) })}
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "upcoming" | "live" | "completed" })}
                className="w-full rounded-xl h-11 bg-background border border-border px-3 text-sm"
              >
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Button
              onClick={() => void addTournament()}
              disabled={!form.name || !form.game || !form.date || !form.time || !form.maxSlots || isSaving}
              className="w-full rounded-xl h-11"
            >
              {isSaving ? "Saving..." : "Save Tournament"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};
