import { getPostBySlug, getAllPosts } from '@/lib/hashnode';
import { formatDate, readingTimeText } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;
export const dynamicParams = true;

// Generate static params - AWAIT params
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts(100);
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata - AWAIT params
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params; // AWAIT HERE
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
      };
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
    return {
      title: 'Post Not Found',
    };
  }
}

// Main component - AWAIT params
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // AWAIT HERE
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen">
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
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div 
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-code:text-purple-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-img:rounded-lg prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-purple-600 prose-blockquote:pl-4 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
      </div>
    </article>
  );
}