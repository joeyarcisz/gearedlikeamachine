import { prisma } from "@/lib/prisma";
import { getAllPostsAdmin } from "@/lib/blog";
import BlogManager from "@/components/admin/BlogManager";

export default async function AdminBlogPage() {
  const posts = getAllPostsAdmin();

  const subscriberCount = await prisma.contact.count({
    where: { blogSubscriber: true },
  });

  const socialConfig = {
    twitter: !!(process.env.TWITTER_API_KEY && process.env.TWITTER_ACCESS_TOKEN),
    linkedin: !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_AUTHOR_URN),
    instagram: !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID),
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-steel text-xs uppercase tracking-[0.3em] mb-2 font-[family-name:var(--font-heading)]">
          Content
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight uppercase text-white">
          Blog Manager
        </h1>
      </div>

      <BlogManager
        posts={posts}
        socialConfig={socialConfig}
        subscriberCount={subscriberCount}
      />
    </div>
  );
}
