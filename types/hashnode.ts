export interface HashnodePost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  coverImage?: {
    url: string;
  };
  content: {
    html: string;
  };
  publishedAt: string;
  author: {
    name: string;
    profilePicture?: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  readTimeInMinutes: number;
}

export interface HashnodePublication {
  id: string;
  title: string;
  posts: {
    edges: Array<{
      node: HashnodePost;
    }>;
  };
}

export interface HashnodeResponse {
  publication: HashnodePublication;
}