/**
 * Pre-render script for blog posts
 * Generates individual HTML files with correct meta tags for social sharing
 * 
 * Run: npx tsx scripts/prerender-blog.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://joanis.co';
const AUTHOR_NAME = 'Junior Joanis';
const TWITTER_HANDLE = '@juniorjoanis';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  content: string;
  resources?: { title: string; url: string }[];
}

// Import blog data - we'll read and parse it manually since we can't use ES imports directly
function loadBlogPosts(): BlogPost[] {
  const blogDataPath = path.join(__dirname, '..', 'blogData.ts');
  const content = fs.readFileSync(blogDataPath, 'utf-8');
  
  // Extract the BLOG_POSTS array from the file
  const match = content.match(/export const BLOG_POSTS:\s*BlogPost\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/m);
  if (!match) {
    throw new Error('Could not parse BLOG_POSTS from blogData.ts');
  }
  
  // Use Function constructor to safely evaluate the array (it's just data)
  // First, we need to handle template literals and multiline strings
  const arrayStr = match[1];
  
  // Parse manually by extracting each post object
  const posts: BlogPost[] = [];
  const postRegex = /\{\s*slug:\s*['"]([^'"]+)['"]/g;
  let postMatch;
  
  while ((postMatch = postRegex.exec(content)) !== null) {
    const slug = postMatch[1];
    
    // Find this post's full object
    const startIndex = postMatch.index;
    let braceCount = 0;
    let endIndex = startIndex;
    let inString = false;
    let stringChar = '';
    let inTemplate = false;
    
    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];
      const prevChar = content[i - 1];
      
      if (char === '`' && prevChar !== '\\') {
        inTemplate = !inTemplate;
      } else if (!inTemplate && (char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      } else if (!inString && !inTemplate) {
        if (char === '{') braceCount++;
        else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
    }
    
    const postStr = content.slice(startIndex, endIndex);
    
    // Extract fields using regex
    const titleMatch = postStr.match(/title:\s*['"]([^'"]+)['"]/);
    const excerptMatch = postStr.match(/excerpt:\s*['"]([^'"]+)['"]/);
    const dateMatch = postStr.match(/date:\s*['"]([^'"]+)['"]/);
    const readTimeMatch = postStr.match(/readTime:\s*['"]([^'"]+)['"]/);
    const tagsMatch = postStr.match(/tags:\s*\[([^\]]+)\]/);
    const featuredMatch = postStr.match(/featured:\s*(true|false)/);
    
    if (titleMatch && excerptMatch) {
      const tags = tagsMatch 
        ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''))
        : [];
      
      posts.push({
        slug,
        title: titleMatch[1],
        excerpt: excerptMatch[1],
        date: dateMatch?.[1] || '',
        readTime: readTimeMatch?.[1] || '',
        tags,
        featured: featuredMatch?.[1] === 'true',
        content: '', // We don't need the full content for meta tags
      });
    }
  }
  
  return posts;
}

function generateBlogPostHtml(post: BlogPost, baseHtml: string): string {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = `${SITE_URL}/og-image.jpg`; // You could generate per-post images later
  
  // Create the meta tags for this specific blog post
  const metaTags = `
    <!-- Primary Meta Tags (Blog Post: ${post.title}) -->
    <title>${post.title} | ${AUTHOR_NAME}</title>
    <meta name="title" content="${escapeHtml(post.title)} | ${AUTHOR_NAME}" />
    <meta name="description" content="${escapeHtml(post.excerpt)}" />
    <meta name="keywords" content="${post.tags.join(', ')}" />
    <meta name="author" content="${AUTHOR_NAME}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${postUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${escapeHtml(post.title)}" />
    <meta property="og:description" content="${escapeHtml(post.excerpt)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="${AUTHOR_NAME} - Engineering Blog" />
    <meta property="og:locale" content="en_US" />
    <meta property="article:published_time" content="${parseDate(post.date)}" />
    <meta property="article:author" content="${AUTHOR_NAME}" />
    <meta property="article:section" content="${post.tags[0] || 'Technology'}" />
    ${post.tags.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n    ')}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${postUrl}" />
    <meta name="twitter:title" content="${escapeHtml(post.title)}" />
    <meta name="twitter:description" content="${escapeHtml(post.excerpt)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:creator" content="${TWITTER_HANDLE}" />
    <meta name="twitter:site" content="${TWITTER_HANDLE}" />`;

  // Replace the existing meta tags in the base HTML
  // Find the section between <!-- Primary Meta Tags --> and <!-- Additional Meta Tags -->
  let html = baseHtml;
  
  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(post.title)} | ${AUTHOR_NAME}</title>`
  );
  
  // Replace meta name="title"
  html = html.replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${escapeHtml(post.title)} | ${AUTHOR_NAME}" />`
  );
  
  // Replace meta name="description"
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(post.excerpt)}" />`
  );
  
  // Replace meta name="keywords"
  html = html.replace(
    /<meta name="keywords" content="[^"]*" \/>/,
    `<meta name="keywords" content="${post.tags.join(', ')}" />`
  );
  
  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${postUrl}" />`
  );
  
  // Replace Open Graph tags
  html = html.replace(
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="article" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${postUrl}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${escapeHtml(post.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(post.excerpt)}" />`
  );
  html = html.replace(
    /<meta property="og:site_name" content="[^"]*" \/>/,
    `<meta property="og:site_name" content="${AUTHOR_NAME} - Engineering Blog" />`
  );
  
  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*" \/>/,
    `<meta name="twitter:url" content="${postUrl}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${escapeHtml(post.title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(post.excerpt)}" />`
  );
  
  // Add article-specific Open Graph tags after og:locale
  const articleTags = `
    <meta property="article:published_time" content="${parseDate(post.date)}" />
    <meta property="article:author" content="${AUTHOR_NAME}" />
    <meta property="article:section" content="${post.tags[0] || 'Technology'}" />
    ${post.tags.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n    ')}`;
  
  html = html.replace(
    /(<meta property="og:locale" content="en_US" \/>)/,
    `$1${articleTags}`
  );
  
  return html;
}

function generateBlogListHtml(posts: BlogPost[], baseHtml: string): string {
  const blogUrl = `${SITE_URL}/blog`;
  const ogImage = `${SITE_URL}/og-image.jpg`;
  const description = 'Deep dives into architecture decisions, engineering leadership, and building products that scale. From authentication flows to AI integrations.';
  const title = `Engineering Blog | ${AUTHOR_NAME}`;
  
  let html = baseHtml;
  
  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${title}</title>`
  );
  
  // Replace meta name="title"
  html = html.replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${title}" />`
  );
  
  // Replace meta name="description"
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );
  
  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${blogUrl}" />`
  );
  
  // Replace Open Graph tags
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${blogUrl}" />`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta property="og:site_name" content="[^"]*" \/>/,
    `<meta property="og:site_name" content="${AUTHOR_NAME} - Engineering Blog" />`
  );
  
  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*" \/>/,
    `<meta name="twitter:url" content="${blogUrl}" />`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  
  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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
    return `${year}-${month}-01T00:00:00Z`;
  }
  
  return new Date().toISOString();
}

async function main() {
  console.log('🚀 Pre-rendering blog posts for social sharing...\n');
  
  const distPath = path.join(__dirname, '..', 'dist');
  const baseHtmlPath = path.join(distPath, 'index.html');
  
  // Check if dist exists
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: dist folder not found. Run `npm run build` first.');
    process.exit(1);
  }
  
  // Read the base HTML template
  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');
  
  // Load blog posts
  const posts = loadBlogPosts();
  console.log(`📝 Found ${posts.length} blog posts\n`);
  
  // Create blog directory in dist
  const blogDistPath = path.join(distPath, 'blog');
  if (!fs.existsSync(blogDistPath)) {
    fs.mkdirSync(blogDistPath, { recursive: true });
  }
  
  // Generate blog list page
  const blogListHtml = generateBlogListHtml(posts, baseHtml);
  fs.writeFileSync(path.join(blogDistPath, 'index.html'), blogListHtml);
  console.log('✅ Generated: /blog/index.html');
  
  // Generate individual blog post pages
  for (const post of posts) {
    const postHtml = generateBlogPostHtml(post, baseHtml);
    const postDir = path.join(blogDistPath, post.slug);
    
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(postDir, 'index.html'), postHtml);
    console.log(`✅ Generated: /blog/${post.slug}/index.html`);
  }
  
  console.log('\n🎉 Pre-rendering complete! Social sharing meta tags are now baked in.');
}

main().catch(console.error);

