import { getAllPosts } from '@/lib/hashnode';
import Link from 'next/link';
import { formatDate, readingTimeText } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getAllPosts(50);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 transition-colors duration-200">
      {/* Header */}
      <header className="flex items-start justify-between mb-10 sm:mb-16">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-1">Thoughts, stories & ideas</p>
        </div>
        <ThemeToggle />
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-center py-24">No posts yet. Start writing!</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {posts.map((post, index) => (
            <li key={post.id} className={`py-8 ${index === 0 ? 'pt-0' : ''}`}>
              <Link href={`/${post.slug}`} className="group flex flex-col gap-2">
                {post.tags && post.tags.length > 0 && (
                  <span className="text-xs font-semibold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
                    {post.tags[0].name}
                  </span>
                )}
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.brief && (
                  <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                    {post.brief}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400 dark:text-gray-400 mt-1">
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