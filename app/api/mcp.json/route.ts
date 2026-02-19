import { getSortedPostsData } from '@/lib/posts';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getSortedPostsData();
  
  const mcpData = {
    jsonrpc: "2.0",
    method: "mcp.list_resources",
    result: {
      resources: posts.map(post => ({
        uri: `blog://${post.slug}`,
        name: post.title,
        description: post.description,
        mimeType: "text/markdown",
        text: post.content
      }))
    }
  };

  return NextResponse.json(mcpData);
}
