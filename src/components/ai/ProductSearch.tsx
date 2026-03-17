import { useState } from "react";
import { groqClient, isGroqConfigured } from "@/lib/groq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductLike {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface ProductSearchProps {
  products: ProductLike[];
  onApply: (ids: string[] | null) => void;
}

interface SetupItem {
  slot: string;
  product: ProductLike;
}

interface BudgetPromptState {
  budget: number;
  minimum: number;
  items: SetupItem[];
}

const currency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

const parseBudget = (text: string): number | null => {
  const normalized = text.toLowerCase();

  const lakhMatch = normalized.match(/(\d+(?:\.\d+)?)\s*lakh(?:s)?\b/i);
  if (lakhMatch) {
    return Math.round(Number(lakhMatch[1]) * 100000);
  }

  const croreMatch = normalized.match(/(\d+(?:\.\d+)?)\s*crore(?:s)?\b/i);
  if (croreMatch) {
    return Math.round(Number(croreMatch[1]) * 10000000);
  }

  const kMatch = normalized.match(/(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    return Math.round(Number(kMatch[1]) * 1000);
  }

  const explicitMatches = [...normalized.matchAll(/(?:rs\.?|inr|₹)\s*([\d,]+)/gi)]
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (explicitMatches.length > 0) {
    return Math.max(...explicitMatches);
  }

  const plainNumberMatches = [...normalized.matchAll(/\b(\d{3,9})\b/g)]
    .map((match) => Number(match[1]))
    .filter((value) => Number.isFinite(value) && value > 0);

  return plainNumberMatches.length > 0 ? Math.max(...plainNumberMatches) : null;
};

const isBudgetIntent = (text: string): boolean => {
  return /(budget|under|within|setup|build|₹|rs\.?|inr|\bk\b)/i.test(text);
};

const pickCheapest = (items: ProductLike[]): ProductLike | null => {
  if (items.length === 0) return null;
  return [...items].sort((a, b) => a.price - b.price)[0];
};

const buildBasicSetup = (products: ProductLike[]): SetupItem[] => {
  const remaining = [...products];
  const selected: SetupItem[] = [];

  const takeForSlot = (slot: string, matcher: (product: ProductLike) => boolean) => {
    const matched = remaining.filter(matcher);
    const cheapest = pickCheapest(matched);
    if (!cheapest) return;
    selected.push({ slot, product: cheapest });
    const index = remaining.findIndex((item) => item.id === cheapest.id);
    if (index !== -1) remaining.splice(index, 1);
  };

  takeForSlot("Core Device", (product) =>
    /console|controller|ps5|ps4|ps3|xbox|gaming chair|pc/i.test(product.name)
  );
  takeForSlot("Game", (product) =>
    product.category.toLowerCase() === "games" || /game|gta|red dead|fifa|forza|cod/i.test(product.name)
  );
  takeForSlot("Audio", (product) => /headset|headphone|earphone|audio/i.test(product.name));

  while (selected.length < 3 && remaining.length > 0) {
    const cheapestRemaining = pickCheapest(remaining);
    if (!cheapestRemaining) break;
    selected.push({ slot: "Essential Add-on", product: cheapestRemaining });
    const index = remaining.findIndex((item) => item.id === cheapestRemaining.id);
    if (index !== -1) remaining.splice(index, 1);
  }

  return selected;
};

export const ProductSearch = ({ products, onApply }: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [budgetPlan, setBudgetPlan] = useState<BudgetPromptState | null>(null);
  const [budgetPrompt, setBudgetPrompt] = useState<BudgetPromptState | null>(null);

  const extractJsonArray = (raw: string): string[] => {
    const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");
    if (start === -1 || end === -1 || end <= start) {
      return [];
    }

    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  };

  const resetAll = () => {
    setQuery("");
    setError(null);
    setInfo(null);
    setBudgetPlan(null);
    setBudgetPrompt(null);
    onApply(null);
  };

  const openWhatsApp = (budget?: number) => {
    const text = budget
      ? `Hi! My budget is ${currency(budget)}. Please help me with a complete basic gaming setup.`
      : "Hi! Please help me with a complete basic gaming setup.";
    window.open(`https://wa.me/917010905241?text=${encodeURIComponent(text)}`, "_blank");
  };

  const runBudgetPlanner = (budget: number) => {
    const setupItems = buildBasicSetup(products);
    if (setupItems.length === 0) {
      setError("No products are available right now. Please contact us on WhatsApp.");
      return;
    }

    const minimum = setupItems.reduce((sum, item) => sum + item.product.price, 0);
    const plannerState: BudgetPromptState = { budget, minimum, items: setupItems };

    setInfo(null);
    setError(null);

    if (budget >= minimum) {
      setBudgetPrompt(null);
      setBudgetPlan(plannerState);
      onApply(setupItems.map((item) => item.product.id));
      setInfo(`Great choice. Your basic setup fits in ${currency(budget)}.`);
      return;
    }

    setBudgetPlan(null);
    setBudgetPrompt(plannerState);
    onApply(null);
  };

  const showIncreasedBudgetPlan = () => {
    if (!budgetPrompt) return;
    setBudgetPlan(budgetPrompt);
    setBudgetPrompt(null);
    onApply(budgetPrompt.items.map((item) => item.product.id));
    setInfo(`To complete the setup, please increase your budget to at least ${currency(budgetPrompt.minimum)}.`);
  };

  const searchWithAI = async () => {
    if (!query.trim()) {
      onApply(null);
      return;
    }

    const detectedBudget = parseBudget(query);
    if (detectedBudget && isBudgetIntent(query)) {
      runBudgetPlanner(detectedBudget);
      return;
    }

    if (!isGroqConfigured) {
      setError("Set VITE_GROQ_API_KEY to enable AI product search.");
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    setBudgetPlan(null);
    setBudgetPrompt(null);
    try {
      const prompt = `User query: ${query}. Catalog: ${JSON.stringify(products)}. Return only a JSON array of matching product IDs sorted by relevance. No explanation.`;
      const completion = await groqClient?.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a strict JSON assistant. Output valid JSON array only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 300,
      });

      const text = completion?.choices?.[0]?.message?.content ?? "[]";
      const ids = extractJsonArray(text);
      onApply(ids.length > 0 ? ids : null);
    } catch (e) {
      console.error(e);
      setError("AI search failed. Try again in a few seconds.");
      onApply(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: complete setup under 8000"
        />
        <Button onClick={searchWithAI} disabled={loading}>{loading ? "Searching..." : "AI Search"}</Button>
        <Button variant="ghost" onClick={resetAll}>Reset</Button>
      </div>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      {info && <p className="text-xs text-primary mt-2">{info}</p>}

      {budgetPrompt && (
        <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
          <p className="text-sm font-medium text-foreground">
            Your budget is {currency(budgetPrompt.budget)}, but a complete basic setup needs at least {currency(budgetPrompt.minimum)}.
          </p>
          <p className="text-xs text-muted-foreground">Would you like to increase your budget and see the setup plan?</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={showIncreasedBudgetPlan}>Yes, Show Plan</Button>
            <Button size="sm" variant="outline" onClick={() => openWhatsApp(budgetPrompt.budget)}>
              No, Contact on WhatsApp
            </Button>
          </div>
        </div>
      )}

      {budgetPlan && (
        <div className="mt-3 rounded-lg border border-border/50 bg-surface-2 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Basic Setup Plan</p>
            <p className="text-sm font-mono text-primary">Total: {currency(budgetPlan.minimum)}</p>
          </div>
          <div className="space-y-1.5">
            {budgetPlan.items.map((item) => (
              <div key={`${item.slot}-${item.product.id}`} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.slot}: {item.product.name}</span>
                <span className="font-mono">{currency(item.product.price)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => openWhatsApp(budgetPlan.minimum)}>
              Need Help on WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
