import { useEffect, useMemo, useState } from "react";
import { groqClient, isGroqConfigured } from "@/lib/groq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send, Sparkles, Shield } from "lucide-react";
import { api } from "@/lib/api";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ProductLike {
  id: string;
  name: string;
  category: string;
  price: number;
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
  return /(budget|under|within|less than|below|max|buy|purchase|setup|build|₹|rs\.?|inr|\bk\b)/i.test(text);
};

const getQueryKeywords = (query: string): string[] => {
  const lower = query.toLowerCase();
  const keywordMap = [
    "pc",
    "computer",
    "console",
    "controller",
    "headset",
    "keyboard",
    "mouse",
    "chair",
    "game",
    "accessory",
    "furniture",
  ];
  return keywordMap.filter((keyword) => lower.includes(keyword));
};

const filterProductsByKeywords = (products: ProductLike[], keywords: string[]): ProductLike[] => {
  if (keywords.length === 0) {
    return products;
  }

  return products.filter((product) => {
    const haystack = `${product.name} ${product.category}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  });
};

const buildBudgetBundle = (products: ProductLike[], budget: number): ProductLike[] => {
  const sorted = [...products].sort((a, b) => b.price - a.price);
  const picked: ProductLike[] = [];
  let total = 0;

  for (const product of sorted) {
    if (total + product.price > budget) {
      continue;
    }
    picked.push(product);
    total += product.price;
  }

  return picked;
};

const buildBudgetReply = (query: string, budget: number, products: ProductLike[]): string => {
  const keywords = getQueryKeywords(query);
  const scoped = filterProductsByKeywords(products, keywords);
  const searchPool = scoped.length > 0 ? scoped : products;
  const picked = buildBudgetBundle(searchPool, budget);

  if (picked.length === 0) {
    const cheapest = [...searchPool].sort((a, b) => a.price - b.price)[0];
    if (!cheapest) {
      return `I couldn't find products right now. Please try again in a moment or message us on WhatsApp.`;
    }

    return `I couldn't find any item under ${currency(budget)} for your request. The cheapest matching option is ${cheapest.name} at ${currency(cheapest.price)}.`;
  }

  const total = picked.reduce((sum, item) => sum + item.price, 0);
  const lines = picked
    .map((item, index) => `${index + 1}. ${item.name} — ${currency(item.price)}`)
    .join("\n");

  return `Here are options under ${currency(budget)}:\n${lines}\n\nTotal: ${currency(total)} (remaining: ${currency(Math.max(0, budget - total))}).`;
};

const systemPrompt = `You are VMOS Game Station assistant. Be concise. Business: gaming cafe in Tiruppur, Tamil Nadu. Hours: 10 AM - 11 PM. Contact: +91 7010905241. Address: 5/1, 1st St, Sellam Nagar, Parapalayam, Tiruppur 641604. Consoles: PS5 ₹100/hr, Xbox Series X ₹100/hr, Gaming PC ₹80/hr, PS4 ₹80/hr, Switch ₹60/hr, VR ₹150/hr. Offer booking help, directions, pricing, and quick recommendations.`;

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "assistant",
    content: "Hi! I can help with bookings, pricing, or directions. What do you need?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<ProductLike[]>([]);

  useEffect(() => {
    api.products
      .list()
      .then((items) => {
        const mapped = items
          .map((item) => ({
            id: String(item._id || item.id || ""),
            name: String(item.name || ""),
            category: String(item.category || ""),
            price: Number(item.price) || 0,
          }))
          .filter((item) => item.id && item.name && item.price > 0);
        setCatalog(mapped);
      })
      .catch(() => setCatalog([]));
  }, []);

  const disabledReason = useMemo(() => {
    if (!isGroqConfigured) return "Add VITE_GROQ_API_KEY to enable chat.";
    return null;
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading || disabledReason) return;
    const userText = input.trim();
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: userText }];
    setMessages(nextMessages);
    setInput("");

    const budget = parseBudget(userText);
    if (budget && isBudgetIntent(userText) && catalog.length > 0) {
      const strictBudgetReply = buildBudgetReply(userText, budget, catalog);
      setMessages((prev) => [...prev, { role: "assistant", content: strictBudgetReply }]);
      return;
    }

    setLoading(true);
    try {
      const completion = await groqClient?.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 256,
        temperature: 0.4,
      });
      const reply = completion?.choices?.[0]?.message?.content || "Sorry, I could not respond.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error reaching the assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="rounded-full shadow-lg">
            <MessageSquare className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">Ask VMOS</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> VMOS Assistant
            </DialogTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Shield className="h-3 w-3" /> Answers are AI-generated; verify key details.</p>
          </DialogHeader>
          <div className="space-y-3">
            <div className="h-64 overflow-y-auto rounded-md border border-border p-3 bg-muted/40">
              {messages.map((m, idx) => (
                <div key={idx} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <p className="text-xs text-muted-foreground">Thinking...</p>}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={disabledReason || "Ask about booking, prices, directions..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading || Boolean(disabledReason)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button onClick={sendMessage} disabled={loading || Boolean(disabledReason)}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {disabledReason && <p className="text-xs text-destructive">{disabledReason}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
