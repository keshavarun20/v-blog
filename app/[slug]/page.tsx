import { getPostBySlug, getAllPosts } from "@/lib/hashnode";
import { formatDate, readingTimeText } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts(50);
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.title,
      description: post.brief,
      openGraph: {
        title: post.title,
        description: post.brief,
        images: post.coverImage ? [post.coverImage.url] : [],
      },
    };
  } catch (error) {
    return { title: "Post Not Found" };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hashnode-content p {
          color: #374151;
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 1.25rem;
        }
        .hashnode-content h1,
        .hashnode-content h2,
        .hashnode-content h3,
        .hashnode-content h4 {
          color: #111827;
          line-height: 1.3;
          font-weight: 700;
        }
        .hashnode-content h2 {
          font-size: 1.5rem;
          margin-top: 2.5rem;
          margin-bottom: 0.875rem;
        }
        .hashnode-content h3 {
          font-size: 1.25rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .hashnode-content h4 {
          font-size: 1.05rem;
          margin-top: 1.5rem;
          margin-bottom: 0.6rem;
        }
        .hashnode-content a {
          color: #7c3aed;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }
        .hashnode-content a:hover { color: #6d28d9; }
        .hashnode-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .hashnode-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .hashnode-content li {
          color: #374151;
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 0.35rem;
        }
        .hashnode-content blockquote {
          border-left: 3px solid #7c3aed;
          background: #f5f3ff;
          border-radius: 0 8px 8px 0;
          padding: 0.75rem 1rem;
          margin: 1.75rem 0;
        }
        .hashnode-content blockquote p {
          color: #4c1d95;
          font-style: italic;
          margin-bottom: 0;
        }
        .hashnode-content code {
          background: #f3f4f6;
          color: #7c3aed;
          font-size: 0.82rem;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          word-break: break-word;
        }
        .hashnode-content pre {
          background: #1f2937;
          border-radius: 8px;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          -webkit-overflow-scrolling: touch;
        }
        .hashnode-content pre code {
          background: none;
          color: #d1d5db;
          padding: 0;
          font-size: 0.85rem;
          word-break: normal;
        }
        .hashnode-content img {
          border-radius: 8px;
          width: 100%;
          height: auto;
          margin: 1.5rem 0;
        }
        .hashnode-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2.5rem 0;
        }
        .hashnode-content table {
          width: 100%;
          overflow-x: auto;
          display: block;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .hashnode-content th, .hashnode-content td {
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          font-size: 0.95rem;
        }
        .hashnode-content p, .hashnode-content li,
        .hashnode-content h1, .hashnode-content h2,
        .hashnode-content h3, .hashnode-content h4 {
          -webkit-font-smoothing: antialiased;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        @media (min-width: 640px) {
          .hashnode-content p { font-size: 1.125rem; }
          .hashnode-content li { font-size: 1.125rem; }
          .hashnode-content h2 { font-size: 1.75rem; }
          .hashnode-content h3 { font-size: 1.35rem; }
          .hashnode-content h4 { font-size: 1.1rem; }
        }

        /* ── Dark mode ── */
        .dark .hashnode-content p { color: #e5e7eb; }
        .dark .hashnode-content li { color: #e5e7eb; }
        .dark .hashnode-content h1,
        .dark .hashnode-content h2,
        .dark .hashnode-content h3,
        .dark .hashnode-content h4 { color: #ffffff; }
        .dark .hashnode-content a { color: #a78bfa; }
        .dark .hashnode-content a:hover { color: #c4b5fd; }
        .dark .hashnode-content blockquote {
          background: #1e1b4b;
          border-left-color: #a78bfa;
        }
        .dark .hashnode-content blockquote p { color: #c4b5fd; }
        .dark .hashnode-content code { background: #1f2937; color: #a78bfa; }
        .dark .hashnode-content pre { background: #111827; }
        .dark .hashnode-content pre code { color: #e5e7eb; }
        .dark .hashnode-content hr { border-top-color: #374151; }
        .dark .hashnode-content th,
        .dark .hashnode-content td { border-color: #374151; color: #e5e7eb; }
      `,
        }}
      />

      {/* Top nav */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          ← Back
        </Link>
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {post.tags && post.tags.length > 0 && (
          <Link
            href={`/tag/${post.tags[0].slug}`}
            className="text-xs font-semibold tracking-wider text-purple-600 dark:text-purple-400 uppercase hover:underline"
          >
            {post.tags[0].name}
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <div className="flex items-center gap-2">
            {post.author.profilePicture && (
              <Image
                src={post.author.profilePicture}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {post.author.name}
            </span>
          </div>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{readingTimeText(post.readTimeInMinutes)}</span>
        </div>

        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div
          className="hashnode-content"
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
      </div>
    </article>
  );
}
