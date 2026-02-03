import Image from 'next/image';
import Link from 'next/link';
import { HashnodePost } from '@/types/hashnode';
import { formatDate, readingTimeText } from '@/lib/utils';

interface ArticleCardProps {
  post: HashnodePost;
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/${post.slug}`} className="group block">
      {/* Image */}
      {post.coverImage && (
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 mb-4">
          <Image
            src={post.coverImage.url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      {/* Content */}
      <div>
        {/* Tag */}
        {post.tags && post.tags.length > 0 && (
          <span className="inline-block text-xs font-semibold tracking-wider text-purple-600 uppercase mb-2">
            {post.tags[0].name}
          </span>
        )}
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-purple-600 transition-colors">
          {post.title}
        </h2>
        
        {/* Brief */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.brief}
        </p>
        
        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{post.author.name}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{readingTimeText(post.readTimeInMinutes)}</span>
        </div>
      </div>
    </Link>
  );
}