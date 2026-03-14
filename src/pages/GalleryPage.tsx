import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const galleryItems = [
  { id: 1, url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900", category: "arena", title: "Arena" },
  { id: 2, url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900", category: "setup", title: "Console Zone" },
  { id: 3, url: "https://images.unsplash.com/photo-1523968044756-39c9c6ef1aab?w=900", category: "tournament", title: "Tournament Night" },
  { id: 4, url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900", category: "setup", title: "PC Bay" },
  { id: 5, url: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900", category: "arena", title: "Neon Lounge" },
  { id: 6, url: "https://images.unsplash.com/photo-1546443046-ed1ce6ffd1ab?w=900", category: "tournament", title: "Winners" },
];

export const GalleryPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground text-sm">Peek into VMOS Game Station</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="arena">Arena</TabsTrigger>
            <TabsTrigger value="tournament">Tournaments</TabsTrigger>
            <TabsTrigger value="setup">Setups</TabsTrigger>
          </TabsList>
          {"all arena tournament setup".split(" ").map((cat) => {
            const items = galleryItems.filter((g) => cat === "all" || g.category === cat);
            return (
              <TabsContent key={cat} value={cat} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <img src={item.url} alt={item.title} className="w-full h-52 object-cover" />
                    <div className="p-3">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </Layout>
  );
};
