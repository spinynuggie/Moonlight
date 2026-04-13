import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import LineWavesLoader from "@/components/LineWavesLoader";
import PageTransition from "@/components/PageTransition";
import ScrollUp from "@/components/ScrollUp";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      <LineWavesLoader />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <PageTransition>
          <div className="row-padding-max-w-2xl py-8">
            <Breadcrumbs />
            {children}
          </div>
        </PageTransition>
        <main className="flex-grow" />
        <div className="pointer-events-none h-12 bg-gradient-to-b from-transparent to-background" />
        <Footer />
        <ScrollUp />
      </div>
    </div>
  );
}
