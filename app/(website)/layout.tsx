import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
import LineWavesLoader from "@/components/LineWavesLoader";
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
        <div className="row-padding-max-w-2xl py-8">{children}</div>
        <main className="flex-grow" />
        <Footer />
        <ScrollUp />
      </div>
    </div>
  );
}
