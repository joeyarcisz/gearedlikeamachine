import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSubscribe from "@/components/BlogSubscribe";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Geared Like A Machine",
  description:
    "Insights on video production, gear, pricing, and building a production business. From the operators at Geared Like A Machine.",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => p !== featured);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pt-12 sm:pt-16 mb-16">
            <p className="text-steel text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-heading)]">
              From the Shop Floor
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase text-white mb-4">
              Blog
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-xl leading-relaxed">
              Production insights, gear breakdowns, pricing strategy, and
              lessons from building a production company.
            </p>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted text-lg">
                Posts are being machined. Check back soon.
              </p>
            </div>
          )}

          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block border border-card-border bg-card hover:border-steel/40 transition-all duration-300 mb-12"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-steel text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold">
                    Featured
                  </span>
                  <span className="text-card-border">|</span>
                  <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)]">
                    {featured.category}
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold uppercase text-white group-hover:text-steel transition-colors duration-300 mb-3">
                  {featured.title}
                </h2>
                <p className="text-muted text-base leading-relaxed max-w-2xl mb-4">
                  {featured.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-muted text-xs uppercase tracking-widest">
                    {formatDate(featured.date)}
                  </span>
                  <span className="text-steel text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Post grid */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block border border-card-border bg-card hover:border-steel/40 transition-all duration-300"
                >
                  <div className="p-6">
                    <span className="text-muted text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] block mb-3">
                      {post.category}
                    </span>
                    <h3 className="font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold uppercase text-white group-hover:text-steel transition-colors duration-300 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-muted text-[10px] uppercase tracking-widest">
                        {formatDate(post.date)}
                      </span>
                      <span className="text-steel text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Read &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Subscribe */}
          <div className="mt-16 max-w-xl">
            <BlogSubscribe />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
