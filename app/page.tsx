import { getAllPosts } from '@/lib/hashnode';
import HeroPost from '@/components/HeroPost';
import ArticleGrid from '@/components/ArticleGrid';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const posts = await getAllPosts();

  console.log(posts);
  
  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No posts yet</h1>
          <p className="text-gray-600">Start writing on your Hashnode blog!</p>
        </div>
      </div>
    );
  }

  const [featuredPost, ...otherPosts] = posts;
  console.log(featuredPost);

  return (
    <main className="min-h-screen">
      {/* Hero Post */}
      <HeroPost post={featuredPost} />
      
      {/* Other Articles */}
      {otherPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Latest Stories
          </h2>
          <ArticleGrid posts={otherPosts} />
        </section>
      )}
    </main>
  );
}