import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatWidget } from "@/components/ai/ChatWidget";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};
