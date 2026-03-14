import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const DRAFTS_DIR = path.join(process.cwd(), "content/blog/drafts");
const DISTRIBUTION_DIR = path.join(process.cwd(), "content/distribution");

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

function parseFrontmatter(dir: string, fileName: string): BlogPostMeta | null {
  const filePath = path.join(dir, fileName);
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

function collectPublishedPosts(dir: string): BlogPostMeta[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseFrontmatter(dir, f))
    .filter((p): p is BlogPostMeta => p !== null);
}

export function getAllPosts(): BlogPostMeta[] {
  const posts = [
    ...collectPublishedPosts(BLOG_DIR),
    ...collectPublishedPosts(DRAFTS_DIR),
  ];

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) return null;
  let filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DRAFTS_DIR, `${slug}.md`);
  }
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

function collectSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostSlugs(): string[] {
  return [...collectSlugs(BLOG_DIR), ...collectSlugs(DRAFTS_DIR)];
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

function readPostMeta(filePath: string, slug: string): AdminBlogPost {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  const distPath = path.join(DISTRIBUTION_DIR, `${slug}-distribution.md`);

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
}

export function getAllPostsAdmin(): AdminBlogPost[] {
  const posts: AdminBlogPost[] = [];

  // Published posts in content/blog/
  if (fs.existsSync(BLOG_DIR)) {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      posts.push(readPostMeta(path.join(BLOG_DIR, f), f.replace(/\.md$/, "")));
    }
  }

  // Draft posts in content/blog/drafts/
  if (fs.existsSync(DRAFTS_DIR)) {
    const files = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".md"));
    for (const f of files) {
      posts.push(readPostMeta(path.join(DRAFTS_DIR, f), f.replace(/\.md$/, "")));
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getDistributionKit(slug: string): string | null {
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) return null;
  const distPath = path.join(DISTRIBUTION_DIR, `${slug}-distribution.md`);
  if (!fs.existsSync(distPath)) return null;
  return fs.readFileSync(distPath, "utf-8");
}
