"use client";

import { useState } from "react";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  draft: boolean;
  hasDistributionKit: boolean;
  interactive?: string;
}

interface SocialConfig {
  twitter: boolean;
  linkedin: boolean;
  instagram: boolean;
}

export default function BlogManager({
  posts,
  socialConfig,
  subscriberCount,
}: {
  posts: BlogPost[];
  socialConfig: SocialConfig;
  subscriberCount: number;
}) {
  const [actionStatus, setActionStatus] = useState<
    Record<string, { status: string; message: string }>
  >({});

  function setStatus(key: string, status: string, message: string) {
    setActionStatus((prev) => ({ ...prev, [key]: { status, message } }));
  }

  async function notifySubscribers(slug: string) {
    const key = `notify-${slug}`;
    setStatus(key, "sending", "Sending...");
    try {
      const res = await fetch("/api/blog/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(key, "sent", `Sent to ${data.sent} subscriber${data.sent !== 1 ? "s" : ""}`);
    } catch (err) {
      setStatus(key, "error", err instanceof Error ? err.message : "Failed");
    }
  }

  async function postToSocial(slug: string, platform: string) {
    const key = `${platform}-${slug}`;
    setStatus(key, "sending", "Posting...");
    try {
      const res = await fetch(`/api/blog/social/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus(key, "sent", "Posted");
    } catch (err) {
      setStatus(key, "error", err instanceof Error ? err.message : "Failed");
    }
  }

  function getStatus(key: string) {
    return actionStatus[key];
  }

  function ActionButton({
    actionKey,
    label,
    onClick,
    disabled,
  }: {
    actionKey: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }) {
    const s = getStatus(actionKey);
    const isSending = s?.status === "sending";

    return (
      <div className="inline-flex items-center gap-2">
        <button
          onClick={onClick}
          disabled={disabled || isSending}
          className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold px-3 py-1.5 border border-card-border hover:border-steel/40 hover:text-steel transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSending ? "..." : label}
        </button>
        {s?.status === "sent" && (
          <span className="text-green-400 text-[10px]">{s.message}</span>
        )}
        {s?.status === "error" && (
          <span className="text-red-400 text-[10px]">{s.message}</span>
        )}
      </div>
    );
  }

  const published = posts.filter((p) => !p.draft);
  const drafts = posts.filter((p) => p.draft);

  return (
    <div>
      {/* Stats bar */}
      <div className="flex gap-6 mb-8">
        <div className="border border-card-border bg-card px-5 py-4">
          <p className="text-steel text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold mb-1">
            Published
          </p>
          <p className="text-white text-2xl font-[family-name:var(--font-heading)] font-bold">
            {published.length}
          </p>
        </div>
        <div className="border border-card-border bg-card px-5 py-4">
          <p className="text-steel text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold mb-1">
            Drafts
          </p>
          <p className="text-white text-2xl font-[family-name:var(--font-heading)] font-bold">
            {drafts.length}
          </p>
        </div>
        <div className="border border-card-border bg-card px-5 py-4">
          <p className="text-steel text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold mb-1">
            Subscribers
          </p>
          <p className="text-white text-2xl font-[family-name:var(--font-heading)] font-bold">
            {subscriberCount}
          </p>
        </div>
      </div>

      {/* Social API status */}
      <div className="border border-card-border bg-card p-4 mb-8">
        <p className="text-steel text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold mb-3">
          Distribution Channels
        </p>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${socialConfig.twitter ? "bg-green-400" : "bg-card-border"}`} />
            <span className="text-muted">X/Twitter</span>
            {!socialConfig.twitter && <span className="text-card-border">(not configured)</span>}
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${socialConfig.linkedin ? "bg-green-400" : "bg-card-border"}`} />
            <span className="text-muted">LinkedIn</span>
            {!socialConfig.linkedin && <span className="text-card-border">(not configured)</span>}
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${socialConfig.instagram ? "bg-green-400" : "bg-card-border"}`} />
            <span className="text-muted">Instagram</span>
            {!socialConfig.instagram && <span className="text-card-border">(not configured)</span>}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-muted">Email ({subscriberCount} subs)</span>
          </span>
        </div>
      </div>

      {/* Drafts */}
      {drafts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-steel text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-heading)] font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Drafts Awaiting Review
          </h2>
          <div className="space-y-3">
            {drafts.map((post) => (
              <div
                key={post.slug}
                className="border border-card-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-400 text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] font-semibold">
                        Draft
                      </span>
                      <span className="text-card-border">|</span>
                      <span className="text-muted text-[10px] uppercase tracking-widest">
                        {post.category}
                      </span>
                      {post.interactive && (
                        <>
                          <span className="text-card-border">|</span>
                          <span className="text-blue-400 text-[10px] uppercase tracking-widest">
                            Interactive
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-white font-[family-name:var(--font-heading)] font-bold text-lg uppercase">
                      {post.title}
                    </h3>
                    <p className="text-muted text-sm mt-1 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <p className="text-muted text-[10px] mt-2">{post.date}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {post.hasDistributionKit && (
                      <span className="text-green-400 text-[10px] uppercase tracking-widest">
                        Kit ready
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-muted text-xs mt-3 border-t border-card-border pt-3">
                  To publish: edit <code className="text-steel">content/blog/{post.slug}.md</code>, set <code className="text-steel">draft: false</code>, commit and push.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Published posts */}
      <div>
        <h2 className="text-steel text-xs uppercase tracking-[0.2em] font-[family-name:var(--font-heading)] font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Published
        </h2>
        <div className="space-y-3">
          {published.map((post) => (
            <div
              key={post.slug}
              className="border border-card-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted text-[10px] uppercase tracking-widest">
                      {post.category}
                    </span>
                    {post.interactive && (
                      <>
                        <span className="text-card-border">|</span>
                        <span className="text-blue-400 text-[10px] uppercase tracking-widest">
                          Interactive
                        </span>
                      </>
                    )}
                    <span className="text-card-border">|</span>
                    <span className="text-muted text-[10px] uppercase tracking-widest">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-white font-[family-name:var(--font-heading)] font-bold uppercase">
                    {post.title}
                  </h3>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-card-border">
                <ActionButton
                  actionKey={`notify-${post.slug}`}
                  label={`Email ${subscriberCount} subs`}
                  onClick={() => notifySubscribers(post.slug)}
                />

                {post.hasDistributionKit && (
                  <>
                    <ActionButton
                      actionKey={`twitter-${post.slug}`}
                      label="Post to X"
                      onClick={() => postToSocial(post.slug, "twitter")}
                      disabled={!socialConfig.twitter}
                    />
                    <ActionButton
                      actionKey={`linkedin-${post.slug}`}
                      label="Post to LinkedIn"
                      onClick={() => postToSocial(post.slug, "linkedin")}
                      disabled={!socialConfig.linkedin}
                    />
                    <ActionButton
                      actionKey={`instagram-${post.slug}`}
                      label="Post to Instagram"
                      onClick={() => postToSocial(post.slug, "instagram")}
                      disabled={!socialConfig.instagram}
                    />
                  </>
                )}

                {!post.hasDistributionKit && (
                  <span className="text-muted text-[10px] uppercase tracking-widest self-center">
                    No distribution kit
                  </span>
                )}

                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-heading)] text-muted hover:text-steel transition-colors self-center ml-auto"
                >
                  View &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
