import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured?: boolean;
  interactive?: string;
  content: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured?: boolean;
  interactive?: string;
}

function parseFrontmatter(fileName: string): BlogPostMeta | null {
  const filePath = path.join(BLOG_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  if (data.draft) return null;

  return {
    slug: fileName.replace(/\.md$/, ""),
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString().split("T")[0],
    excerpt: data.excerpt || "",
    category: data.category || "Production",
    tags: data.tags || [],
    featured: data.featured || false,
    interactive: data.interactive || undefined,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((f) => parseFrontmatter(f))
    .filter((p): p is BlogPostMeta => p !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) return null;
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: markdown } = matter(raw);

  if (data.draft) return null;

  const result = await remark().use(html).process(markdown);

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || new Date().toISOString().split("T")[0],
    excerpt: data.excerpt || "",
    category: data.category || "Production",
    tags: data.tags || [],
    featured: data.featured || false,
    interactive: data.interactive || undefined,
    content: result.toString(),
  };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

// Admin: get all posts including drafts
export interface AdminBlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured?: boolean;
  interactive?: string;
  draft: boolean;
  hasDistributionKit: boolean;
}

const DRAFTS_DIR = path.join(process.cwd(), "content/blog/drafts");

export function getAllPostsAdmin(): AdminBlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((f) => {
    const filePath = path.join(BLOG_DIR, f);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const slug = f.replace(/\.md$/, "");
    const distPath = path.join(DRAFTS_DIR, `${slug}-distribution.md`);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString().split("T")[0],
      excerpt: data.excerpt || "",
      category: data.category || "Production",
      tags: data.tags || [],
      featured: data.featured || false,
      interactive: data.interactive || undefined,
      draft: data.draft === true,
      hasDistributionKit: fs.existsSync(distPath),
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getDistributionKit(slug: string): string | null {
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) return null;
  const distPath = path.join(DRAFTS_DIR, `${slug}-distribution.md`);
  if (!fs.existsSync(distPath)) return null;
  return fs.readFileSync(distPath, "utf-8");
}
