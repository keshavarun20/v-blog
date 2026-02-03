import { HashnodePost } from '@/types/hashnode';
import ArticleCard from './ArticleCard';

interface ArticleGridProps {
  posts: HashnodePost[];
}

export default function ArticleGrid({ posts }: ArticleGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
      {posts.map((post) => (
        <ArticleCard key={post.id} post={post} />
      ))}
    </div>
  );
}