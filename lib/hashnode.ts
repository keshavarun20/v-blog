import { HashnodePost, HashnodeResponse } from '@/types/hashnode';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT || 'https://gql.hashnode.com';
const PUBLICATION_HOST = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST || '';

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
              coverImage {
                url
              }
              content {
                html
              }
              publishedAt
              author {
                name
                profilePicture
              }
              tags {
                name
                slug
              }
              readTimeInMinutes
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { host: PUBLICATION_HOST, first },
      }),
      next: { revalidate: 60 },
    });

    const json = await response.json();
    
    // Check for errors
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      return [];
    }
    
    // Check if data exists
    if (!json.data || !json.data.publication) {
      console.error('No publication data found. Check your PUBLICATION_HOST:', PUBLICATION_HOST);
      return [];
    }
    
    return json.data.publication.posts.edges.map((edge: any) => edge.node);
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
          coverImage {
            url
          }
          content {
            html
          }
          publishedAt
          author {
            name
            profilePicture
          }
          tags {
            name
            slug
          }
          readTimeInMinutes
        }
      }
    }
  `;

  try {
    const response = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { host: PUBLICATION_HOST, slug },
      }),
      next: { revalidate: 60 },
    });

    const json = await response.json();
    
    // Check for errors
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      return null;
    }
    
    // Check if data exists
    if (!json.data || !json.data.publication) {
      console.error('No publication data found. Check your PUBLICATION_HOST:', PUBLICATION_HOST);
      return null;
    }
    
    return json.data.publication.post || null;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}