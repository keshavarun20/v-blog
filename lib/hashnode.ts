import { HashnodePost } from '@/types/hashnode';

const GQL_ENDPOINT =
  process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT ?? 'https://gql.hashnode.com';

const PUBLICATION_HOST =
  process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST!;

export async function getAllPosts(first: number = 20): Promise<HashnodePost[]> {
  const query = `
    query Publication($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              id
              title
              brief
              slug
              coverImage { url }
              content { html }
              publishedAt
              author { name profilePicture }
              tags { name slug }
              readTimeInMinutes
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables: { host: PUBLICATION_HOST, first } }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return [];
    }

    return data.data.publication.posts.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<HashnodePost | null> {
  const query = `
    query Publication($host: String!, $slug: String!) {
      publication(host: $host) {
        post(slug: $slug) {
          id
          title
          brief
          slug
          coverImage { url }
          content { html }
          publishedAt
          author { name profilePicture }
          tags { name slug }
          readTimeInMinutes
        }
      }
    }
  `;

  try {
    const res = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables: { host: PUBLICATION_HOST, slug } }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return null;
    }

    return data.data.publication.post;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function readingTimeText(minutes: number): string {
  return `${minutes} min read`;
}