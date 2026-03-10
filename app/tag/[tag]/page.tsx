import { getAllPosts } from '@/lib/hashnode';
import Link from 'next/link';
import { formatDate, readingTimeText } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const allPosts = await getAllPosts(50);

  const filtered = allPosts.filter(
    (p) => p.tags && p.tags.length > 0 && p.tags[0].slug === tag
  );

  if (filtered.length === 0) notFound();

  const tagName = filtered[0].tags![0].name;

  return (
    <main className="bg-white dark:bg-gray-950 max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 transition-colors duration-200">
      {/* Header */}
      <header className="flex items-start justify-between mb-5 sm:mb-8">
        <div>
          <Link
            href="/"
            className="text-sm font-semibold text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-3 inline-block"
          >
            ← All posts
          </Link>
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            {tagName}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-xs">
            {filtered.length} Post{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <ThemeToggle />
      </header>

      <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
        {filtered.map((post, index) => (
          <li key={post.id} className={`py-8 ${index === 0 ? 'pt-0' : ''}`}>
            <Link href={`/${post.slug}`} className="group flex flex-col gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
                {post.title}
              </h2>
              {post.brief && (
                <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                  {post.brief}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400 mt-1">
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
    </main>
  );
}