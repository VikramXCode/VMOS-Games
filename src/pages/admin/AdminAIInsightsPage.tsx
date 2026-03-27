import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { generateGroqText, isGroqConfigured } from "@/lib/groq";
import { Input } from "@/components/ui/input";

export const AdminAIInsightsPage = () => {
  const { bookings } = useBooking();
  const [report, setReport] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);

  const buildSummary = () => {
    const byConsole = bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.consoleName] = (acc[b.consoleName] || 0) + b.amount;
      return acc;
    }, {});

    return {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + b.amount, 0),
      byConsole,
      recent: bookings.slice(0, 30).map((b) => ({
        date: b.date,
        console: b.consoleName,
        amount: b.amount,
        status: b.status,
        slots: b.slots.map((s) => s.start),
      })),
    };
  };

  const generate = async () => {
    if (!isGroqConfigured) {
      setReport("Set VITE_GROQ_API_KEY to enable AI insights.");
      return;
    }
    setLoading(true);
    try {
      const summary = buildSummary();
      const prompt = `Analyze this VMOS dashboard data and produce concise actionable report with sections: Peak Hours, Revenue Outlook, Underperforming Categories, Marketing Actions. Data: ${JSON.stringify(summary)}`;
      const text = await generateGroqText(prompt, ["llama-3.1-70b-versatile", "llama-3.1-8b-instant"]);
      setReport(text || "No report generated.");
    } catch (error) {
      console.error(error);
      setReport("Failed to generate report right now.");
    } finally {
      setLoading(false);
    }
  };

  const askFollowUp = async () => {
    if (!question.trim()) return;
    if (!isGroqConfigured) {
      setFollowUpAnswer("Set VITE_GROQ_API_KEY to enable follow-up Q&A.");
      return;
    }
    setFollowUpLoading(true);
    try {
      const summary = buildSummary();
      const prompt = `You are VMOS admin analyst. Data: ${JSON.stringify(summary)}. Question: ${question}. Give a concise answer with numbers where possible.`;
      const text = await generateGroqText(prompt, ["llama-3.1-8b-instant", "llama-3.1-70b-versatile"]);
      setFollowUpAnswer(text || "No answer generated.");
    } catch (error) {
      console.error(error);
      setFollowUpAnswer("Failed to get AI answer.");
    } finally {
      setFollowUpLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Card className="rounded-2xl bg-surface-2/90 border-border/60">
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Generate automated insights from the last 30 days of booking and sales data.
          </p>
          <Button onClick={generate} disabled={loading} className="w-full h-11 rounded-xl font-heading">
            {loading ? "Generating..." : "Generate Report"}
          </Button>
          {report && (
            <div className="mt-4 text-sm whitespace-pre-line rounded-2xl border border-border/60 bg-background/30 p-3 max-h-72 overflow-y-auto scrollbar-thin">
              {report}
            </div>
          )}

          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium">Ask follow-up question</p>
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example: which console should we promote next week?"
              />
              <Button variant="outline" onClick={askFollowUp} disabled={followUpLoading} className="rounded-xl">
                {followUpLoading ? "Asking..." : "Ask AI"}
              </Button>
            </div>
            {followUpAnswer && <div className="text-sm whitespace-pre-line rounded-2xl border border-border/60 bg-background/30 p-3">{followUpAnswer}</div>}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Powered by Groq.
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};
