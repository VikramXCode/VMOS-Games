import { useMemo, useState } from "react";
import { groqClient, isGroqConfigured } from "@/lib/groq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send, Sparkles, Shield } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const systemPrompt = `You are VMOS Game Station assistant. Be concise. Business: gaming cafe in Tiruppur, Tamil Nadu. Hours: 10 AM - 11 PM. Contact: +91 7010905241. Address: 5/1, 1st St, Sellam Nagar, Parapalayam, Tiruppur 641604. Consoles: PS5 ₹100/hr, Xbox Series X ₹100/hr, Gaming PC ₹80/hr, PS4 ₹80/hr, Switch ₹60/hr, VR ₹150/hr. Offer booking help, directions, pricing, and quick recommendations.`;

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: "assistant",
    content: "Hi! I can help with bookings, pricing, or directions. What do you need?",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const disabledReason = useMemo(() => {
    if (!isGroqConfigured) return "Add VITE_GROQ_API_KEY to enable chat.";
    return null;
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading || disabledReason) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
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
    <div className="fixed bottom-4 right-4 z-50">
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
