import axios from 'axios';
import { HashnodePost } from '@/types/hashnode';

const GQL_ENDPOINT =
  process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT ?? 'https://gql.hashnode.com';

const PUBLICATION_HOST =
  process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST!;

// Axios instance
const gqlClient = axios.create({
  baseURL: GQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Fetch all posts
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
      next: { revalidate: 60 }, // 👈 Next.js will refetch every 60s
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

// Fetch single post by slug
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
      next: { revalidate: 60 },
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