import Footer from "@/components/Footer";
import GrainientLoader from "@/components/GrainientLoader";
import Header from "@/components/Header/Header";
import ScrollUp from "@/components/ScrollUp";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GrainientLoader />
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="row-padding-max-w-2xl py-8">{children}</div>
        <main className="flex-grow" />
        <Footer />
      </div>
      <ScrollUp />
    </>
  );
}
