import Image from 'next/image';
import Link from 'next/link';
import { HashnodePost } from '@/types/hashnode';
import { formatDate, readingTimeText } from '@/lib/utils';

interface HeroPostProps {
  post: HashnodePost;
}

export default function HeroPost({ post }: HeroPostProps) {
  return (
    <Link href={`/${post.slug}`} className="group block relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      {post.coverImage && (
        <Image
          src={post.coverImage.url}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
        <div className="max-w-4xl">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white bg-white/20 backdrop-blur-sm rounded-full uppercase">
                {post.tags[0].name}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight group-hover:text-gray-200 transition-colors">
            {post.title}
          </h1>
          
          {/* Brief */}
          <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-2">
            {post.brief}
          </p>
          
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>{post.author.name}</span>
            <span>•</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{readingTimeText(post.readTimeInMinutes)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}