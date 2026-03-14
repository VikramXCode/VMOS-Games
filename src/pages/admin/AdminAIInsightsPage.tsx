import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AdminAIInsightsPage = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    // Placeholder: will connect to Gemini
    await new Promise((r) => setTimeout(r, 500));
    setReport("AI insights will appear here once Gemini integration is wired.");
    setLoading(false);
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Generate automated insights from the last 30 days of booking and sales data.
          </p>
          <Button onClick={generate} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
          {report && <div className="mt-4 text-sm whitespace-pre-line">{report}</div>}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Powered by Gemini (coming soon).
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};
