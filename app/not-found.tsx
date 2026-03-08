import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <p className="font-[family-name:var(--font-heading)] text-[8rem] sm:text-[12rem] font-bold uppercase leading-none text-steel/20">
            404
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider text-white mb-4 -mt-4">
            Page Not Found
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-md mx-auto mb-10 leading-relaxed">
            This page does not exist. The machine keeps running without it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-steel text-black px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/scope"
              className="border border-chrome/30 text-white px-8 py-3.5 text-sm uppercase tracking-widest font-semibold hover:border-steel hover:text-steel transition-colors"
            >
              Scope a Project
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
