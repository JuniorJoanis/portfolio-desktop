import { BlogPost } from '../blogData';
import { BIO, SOCIALS } from '../constants';

export const SITE_URL = 'https://joanis.co';
export const SITE_NAME = BIO.name;
export const AUTHOR_NAME = BIO.name;
export const AUTHOR_TITLE = 'CTO & Full-stack Engineer';
export const AUTHOR_BIO = BIO.shortBio;
export const TWITTER_HANDLE = '@juniorjoanis';

// Get social URLs from constants
export const SOCIAL_URLS = {
  github: SOCIALS.find(s => s.platform === 'GitHub')?.url || '',
  linkedin: SOCIALS.find(s => s.platform === 'LinkedIn')?.url || '',
  twitter: SOCIALS.find(s => s.platform === 'Twitter/X')?.url || '',
};

export interface SEOConfig {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  section?: string;
}

/**
 * Updates document head with SEO meta tags
 * Works with SPAs by manipulating the DOM directly
 */
export function updateSEOMeta(config: SEOConfig): void {
  const {
    title,
    description,
    url,
    type = 'website',
    image = `${SITE_URL}/og-image.jpg`,
    publishedTime,
    modifiedTime,
    author = AUTHOR_NAME,
    tags = [],
    section,
  } = config;

  // Update title
  document.title = title;

  // Helper to set/update meta tags
  const setMeta = (name: string, content: string, property = false) => {
    const attr = property ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Basic meta
  setMeta('description', description);
  setMeta('author', author);

  // Open Graph
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', url, true);
  setMeta('og:type', type, true);
  setMeta('og:image', image, true);
  setMeta('og:site_name', SITE_NAME, true);
  setMeta('og:locale', 'en_US', true);

  // Twitter Card
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image);
  setMeta('twitter:creator', TWITTER_HANDLE);
  setMeta('twitter:site', TWITTER_HANDLE);

  // Article-specific meta (for Open Graph)
  if (type === 'article') {
    if (publishedTime) {
      setMeta('article:published_time', publishedTime, true);
    }
    if (modifiedTime) {
      setMeta('article:modified_time', modifiedTime, true);
    }
    setMeta('article:author', author, true);
    if (section) {
      setMeta('article:section', section, true);
    }
    tags.forEach((tag, i) => {
      setMeta(`article:tag`, tag, true);
    });
  }

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

/**
 * Generates JSON-LD structured data for a blog article
 * This helps search engines and LLMs understand the content
 */
export function generateArticleStructuredData(post: BlogPost): string {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  const publishedDate = parseDate(post.date);
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleUrl,
    headline: post.title,
    description: post.excerpt,
    url: articleUrl,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      jobTitle: AUTHOR_TITLE,
      description: AUTHOR_BIO,
      url: SITE_URL,
      sameAs: [
        SOCIAL_URLS.github,
        SOCIAL_URLS.linkedin,
        SOCIAL_URLS.twitter,
      ].filter(Boolean),
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: post.tags.join(', '),
    articleSection: post.tags[0] || 'Technology',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    wordCount: estimateWordCount(post.content),
    ...(post.resources && post.resources.length > 0 && {
      citation: post.resources.map(r => ({
        '@type': 'WebPage',
        name: r.title,
        url: r.url,
      })),
    }),
  };

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generates JSON-LD structured data for the blog listing page
 */
export function generateBlogListStructuredData(posts: BlogPost[]): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog`,
    name: `${AUTHOR_NAME} - Engineering Journal`,
    description: 'Deep dives into architecture decisions, engineering leadership, and building products that scale.',
    url: `${SITE_URL}/blog`,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      description: AUTHOR_BIO,
      url: SITE_URL,
    },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      '@id': `${SITE_URL}/blog/${post.slug}`,
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: parseDate(post.date),
      author: {
        '@type': 'Person',
        name: AUTHOR_NAME,
      },
      keywords: post.tags.join(', '),
    })),
  };

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generates BreadcrumbList structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
): string {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Injects JSON-LD structured data into the document head
 */
export function injectStructuredData(id: string, jsonLd: string): void {
  // Remove existing script with same id
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create and inject new script
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = jsonLd;
  document.head.appendChild(script);
}

/**
 * Removes injected structured data
 */
export function removeStructuredData(id: string): void {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
}

/**
 * Parse a human-readable date string to ISO format
 */
function parseDate(dateStr: string): string {
  // Handle formats like "January 2026"
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

/**
 * Estimate word count from HTML content
 */
function estimateWordCount(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').filter(word => word.length > 0).length;
}

/**
 * Generate FAQ structured data from article content
 * Extracts h3 headers as questions (useful for featured snippets)
 */
export function extractFAQFromContent(content: string): string | null {
  const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi;
  const matches = [...content.matchAll(h3Regex)];
  
  if (matches.length < 2) return null;
  
  // Find content between h3 tags
  const faqs: Array<{ question: string; answer: string }> = [];
  
  matches.forEach((match, index) => {
    const question = match[1].replace(/<[^>]*>/g, '').trim();
    const startIndex = match.index! + match[0].length;
    const endIndex = matches[index + 1]?.index || content.length;
    const answerHtml = content.slice(startIndex, endIndex);
    const answer = answerHtml
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300); // Limit answer length
    
    if (question && answer) {
      faqs.push({ question, answer });
    }
  });

  if (faqs.length === 0) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.slice(0, 10).map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return JSON.stringify(structuredData, null, 2);
}
