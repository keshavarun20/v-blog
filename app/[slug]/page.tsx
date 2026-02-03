import { getPostBySlug, getAllPosts } from '@/lib/hashnode';
import { formatDate, readingTimeText } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts(50);
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return { title: 'Post Not Found' };
    }

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
    return { title: 'Post Not Found' };
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      {/* ── Font import + content styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Hashnode HTML content styles ── */
        .hashnode-content p {
          color: #374151;
          font-size: 1.125rem;
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
          font-size: 1.75rem;
          margin-top: 2.5rem;
          margin-bottom: 0.875rem;
        }
        .hashnode-content h3 {
          font-size: 1.35rem;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .hashnode-content h4 {
          font-size: 1.1rem;
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

        .hashnode-content ul { list-style-type: disc; padding-left: 1.75rem; margin-bottom: 1.25rem; }
        .hashnode-content ol { list-style-type: decimal; padding-left: 1.75rem; margin-bottom: 1.25rem; }
        .hashnode-content li {
          color: #374151;
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 0.35rem;
        }

        .hashnode-content blockquote {
          border-left: 3px solid #7c3aed;
          background: #f5f3ff;
          border-radius: 0 8px 8px 0;
          padding: 0.75rem 1.25rem;
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
          font-size: 0.88rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }
        .hashnode-content pre {
          background: #1f2937;
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .hashnode-content pre code {
          background: none;
          color: #d1d5db;
          padding: 0;
        }

        .hashnode-content img {
          border-radius: 8px;
          width: 100%;
          margin: 1.5rem 0;
        }

        .hashnode-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2.5rem 0;
        }

        /* ensure dashes/special chars render cleanly */
        .hashnode-content p, .hashnode-content li,
        .hashnode-content h1, .hashnode-content h2,
        .hashnode-content h3, .hashnode-content h4 {
          -webkit-font-smoothing: antialiased;
        }
      `}} />

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-purple-600 transition-colors"
        >
          ← Back to home
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 py-12">
        {/* Tag */}
        {post.tags && post.tags.length > 0 && (
          <span className="inline-block text-xs font-semibold tracking-wider text-purple-600 uppercase mb-4">
            {post.tags[0].name}
          </span>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Brief */}
        <p className="text-xl text-gray-600 mb-8">
          {post.brief}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-3">
            {post.author.profilePicture && (
              <Image
                src={post.author.profilePicture}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <span className="font-semibold text-gray-900">{post.author.name}</span>
          </div>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{readingTimeText(post.readTimeInMinutes)}</span>
        </div>

        {/* Cover Image */}
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
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div
          className="hashnode-content"
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
      </div>
    </article>
  );
}