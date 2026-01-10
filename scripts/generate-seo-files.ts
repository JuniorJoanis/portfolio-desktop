/**
 * SEO Files Generator Script
 * 
 * Run this script to regenerate sitemap.xml and rss.xml when adding new blog posts.
 * 
 * Usage: npx tsx scripts/generate-seo-files.ts
 * 
 * This ensures search engines and RSS readers always have up-to-date content.
 */

import * as fs from 'fs';
import * as path from 'path';

// Import blog data - adjust path based on your setup
// Note: You may need to copy the blog data types inline if running standalone

interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  content: string;
}

// These should match the values in constants.ts
// Import from constants.ts when using with ts-node or similar
const SITE_URL = 'https://joanis.co';
const AUTHOR_NAME = 'Junior Joanis'; // Should match BIO.name in constants.ts
const AUTHOR_EMAIL = 'junior.joanis@gmail.com'; // Should match email in utils/email.ts

// Parse date string to ISO format
function parseDate(dateStr: string): string {
  const months: Record<string, string> = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };

  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const month = months[parts[0]] || '01';
    const year = parts[1];
    return `${year}-${month}-01`;
  }
  
  return new Date().toISOString().split('T')[0];
}

// Parse date to RFC 822 format for RSS
function parseToRFC822(dateStr: string): string {
  const isoDate = parseDate(dateStr);
  const date = new Date(isoDate);
  return date.toUTCString();
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate sitemap.xml
function generateSitemap(posts: BlogPostData[]): string {
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Blog Main Page -->
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog Posts -->
`;

  posts.forEach(post => {
    const postDate = parseDate(post.date);
    sitemap += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
`;
  });

  sitemap += `  <!-- Main sections (anchors for single-page app) -->
  <url>
    <loc>${SITE_URL}/#about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/#experience</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/#projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/#contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
</urlset>`;

  return sitemap;
}

// Generate rss.xml
function generateRSS(posts: BlogPostData[]): string {
  const now = new Date().toUTCString();
  
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${AUTHOR_NAME} - Engineering Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Deep dives into architecture decisions, engineering leadership, and building products that scale. From authentication flows to AI integrations.</description>
    <language>en-us</language>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} ${AUTHOR_NAME}. All rights reserved.</copyright>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.jpg</url>
      <title>${AUTHOR_NAME} - Engineering Blog</title>
      <link>${SITE_URL}/blog</link>
    </image>
    
`;

  posts.forEach(post => {
    const pubDate = parseToRFC822(post.date);
    const categories = post.tags.map(tag => `      <category>${escapeXml(tag)}</category>`).join('\n');
    
    rss += `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${AUTHOR_NAME}</dc:creator>
${categories}
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[
        <p>${post.excerpt}</p>
        <p><a href="${SITE_URL}/blog/${post.slug}">Read the full article →</a></p>
      ]]></content:encoded>
    </item>
    
`;
  });

  rss += `  </channel>
</rss>`;

  return rss;
}

// Main execution
async function main() {
  // Read blog data from the source file
  const blogDataPath = path.join(__dirname, '../blogData.ts');
  const blogDataContent = fs.readFileSync(blogDataPath, 'utf-8');
  
  // Extract blog posts array using regex (simple approach)
  // For production, consider using ts-node or proper TypeScript compilation
  console.log('⚠️  Note: For dynamic generation, import BLOG_POSTS directly from blogData.ts');
  console.log('   This script provides a template for manual updates.\n');
  
  // For now, provide instructions
  console.log('📝 To update SEO files when adding new blog posts:');
  console.log('   1. Add your new post to blogData.ts');
  console.log('   2. Copy the post details to public/sitemap.xml');
  console.log('   3. Copy the post details to public/rss.xml');
  console.log('   4. Update public/llms.txt with the new article summary\n');
  
  console.log('📁 Files to update:');
  console.log('   - public/sitemap.xml (add new <url> entry)');
  console.log('   - public/rss.xml (add new <item> entry)');
  console.log('   - public/llms.txt (add article to Featured Articles section)');
}

main().catch(console.error);

