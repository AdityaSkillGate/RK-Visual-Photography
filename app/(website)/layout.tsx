import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import SmoothScrollProvider from "@/components/motion/SmoothScrollProvider";
import PageTransition from "@/components/motion/PageTransition";
import CinematicCurtain from "@/components/motion/CinematicCurtain";
import RKAssistantWrapper from "@/components/chatbot/RKAssistantWrapper";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <div className="flex min-h-screen flex-col bg-charcoal-950 text-ivory-100 selection:bg-gold-500 selection:text-charcoal-950">
        <CinematicCurtain />
        <Navbar />
        <main className="flex-1 pt-24">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <RKAssistantWrapper />
      </div>
    </SmoothScrollProvider>
  );
}

