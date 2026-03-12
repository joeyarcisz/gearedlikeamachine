import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Geared Like A Machine`,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Interactive posts render in a full-viewport iframe
  if (post.interactive) {
    return (
      <>
        <Navbar />
        <main className="pt-20 bg-black min-h-screen flex flex-col">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
            <Link
              href="/blog"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; All Posts
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-steel text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold">
                {post.category}
              </span>
              <span className="text-card-border hidden sm:inline">|</span>
              <span className="text-muted text-[10px] uppercase tracking-widest hidden sm:inline">
                {post.title}
              </span>
            </div>
          </div>
          <iframe
            src={post.interactive}
            className="flex-1 w-full border-0"
            style={{ minHeight: "calc(100vh - 7rem)" }}
            title={post.title}
          />
        </main>
      </>
    );
  }

  // Standard markdown posts
  const postContent = post.content;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 bg-black min-h-screen">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pt-12 sm:pt-16 mb-10">
            <Link
              href="/blog"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors inline-block mb-6"
            >
              &larr; All Posts
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-steel text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold">
                {post.category}
              </span>
              <span className="text-card-border">|</span>
              <span className="text-muted text-[10px] uppercase tracking-widest">
                {formatDate(post.date)}
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase text-white mb-4">
              {post.title}
            </h1>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest text-chrome border border-card-border px-3 py-1 font-[family-name:var(--font-heading)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-card-border mb-10" />

          {/* Content - rendered from trusted local markdown files only */}
          <div
            className="blog-content text-white"
            dangerouslySetInnerHTML={{ __html: postContent }}
          />

          {/* Footer nav */}
          <div className="border-t border-card-border mt-16 pt-8 flex items-center justify-between">
            <Link
              href="/blog"
              className="text-muted text-xs uppercase tracking-widest hover:text-steel transition-colors"
            >
              &larr; All Posts
            </Link>
            <Link
              href="/#contact"
              className="text-steel text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold hover:text-white transition-colors"
            >
              Start a Project &rarr;
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
