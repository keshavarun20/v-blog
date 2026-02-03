import { getAllPosts } from '@/lib/hashnode';
import Link from 'next/link';
import { formatDate, readingTimeText } from '@/lib/utils';

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getAllPosts(50);

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <p className="text-gray-500 mt-1">Thoughts, stories & ideas</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-24">No posts yet. Start writing!</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-100">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/${post.slug}`}
                className="group flex flex-col gap-2 py-8 first:pt-0"
              >
                {/* Tag */}
                {post.tags && post.tags.length > 0 && (
                  <span className="text-xs font-semibold tracking-wider text-purple-600 uppercase">
                    {post.tags[0].name}
                  </span>
                )}

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-snug">
                  {post.title}
                </h2>

                {/* Brief */}
                {post.brief && (
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {post.brief}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>{post.author.name}</span>
                  <span>•</span>
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>•</span>
                  <span>{readingTimeText(post.readTimeInMinutes)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}