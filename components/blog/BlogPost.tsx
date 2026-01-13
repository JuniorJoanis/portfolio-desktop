import React, { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Bookmark, ExternalLink } from 'lucide-react';
import BlogLayout from './BlogLayout';
import { BLOG_POSTS } from '../../blogData';
import { SOCIALS, BIO } from '../../constants';
import {
  updateSEOMeta,
  generateArticleStructuredData,
  generateBreadcrumbStructuredData,
  extractFAQFromContent,
  injectStructuredData,
  removeStructuredData,
  SITE_URL,
} from '../../utils/seo';

// Declare Prism for TypeScript
declare global {
  interface Window {
    Prism: {
      highlightAll: () => void;
      highlightAllUnder: (container: Element) => void;
    };
  }
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Trigger Prism.js syntax highlighting after content renders
  useEffect(() => {
    if (contentRef.current && window.Prism) {
      window.Prism.highlightAllUnder(contentRef.current);
    }
  }, [post]);
  
  // SEO: Update meta tags and structured data
  useEffect(() => {
    if (!post) return;

    // Update document meta tags for SEO
    updateSEOMeta({
      title: `${post.title} | ${BIO.name}`,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      section: post.tags[0] || 'Technology',
    });

    // Inject Article structured data
    const articleJsonLd = generateArticleStructuredData(post);
    injectStructuredData('article-structured-data', articleJsonLd);

    // Inject Breadcrumb structured data
    const breadcrumbJsonLd = generateBreadcrumbStructuredData([
      { name: 'Home', url: SITE_URL },
      { name: 'Blog', url: `${SITE_URL}/blog` },
      { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
    ]);
    injectStructuredData('breadcrumb-structured-data', breadcrumbJsonLd);

    // Extract and inject FAQ structured data if applicable
    const faqJsonLd = extractFAQFromContent(post.content);
    if (faqJsonLd) {
      injectStructuredData('faq-structured-data', faqJsonLd);
    }

    // Cleanup on unmount
    return () => {
      removeStructuredData('article-structured-data');
      removeStructuredData('breadcrumb-structured-data');
      removeStructuredData('faq-structured-data');
    };
  }, [post]);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // Parse date for machine-readable format
  const parseDateToISO = (dateStr: string): string => {
    const months: Record<string, string> = {
      January: '01', February: '02', March: '03', April: '04',
      May: '05', June: '06', July: '07', August: '08',
      September: '09', October: '10', November: '11', December: '12',
    };
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const month = months[parts[0]] || '01';
      return `${parts[1]}-${month}-01`;
    }
    return new Date().toISOString().split('T')[0];
  };

  return (
    <BlogLayout>
      {/* Article with proper semantic HTML for SEO */}
      <article 
        className="py-12 md:py-20"
        itemScope 
        itemType="https://schema.org/Article"
      >
        {/* Hidden semantic data for crawlers */}
        <meta itemProp="headline" content={post.title} />
        <meta itemProp="description" content={post.excerpt} />
        <meta itemProp="datePublished" content={parseDateToISO(post.date)} />
        <meta itemProp="dateModified" content={parseDateToISO(post.date)} />
        <meta itemProp="inLanguage" content="en-US" />
        <link itemProp="mainEntityOfPage" href={`${SITE_URL}/blog/${post.slug}`} />

        <div className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb Navigation - SEO friendly */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol 
              className="flex items-center gap-2 text-sm text-slate-500"
              itemScope 
              itemType="https://schema.org/BreadcrumbList"
            >
              <li 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                <Link 
                  to="/" 
                  itemProp="item"
                  className="hover:text-teal-400 transition-colors"
                >
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li className="text-slate-600">/</li>
              <li 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                <Link 
                  to="/blog" 
                  itemProp="item"
                  className="hover:text-teal-400 transition-colors"
                >
                  <span itemProp="name">Blog</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li className="text-slate-600">/</li>
              <li 
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
                className="text-slate-400 truncate max-w-[200px]"
              >
                <span itemProp="name">{post.title}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>
          
          {/* Meta - with machine-readable time */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
            <time 
              dateTime={parseDateToISO(post.date)}
              className="flex items-center gap-1.5"
              itemProp="datePublished"
            >
              <Calendar size={14} aria-hidden="true" />
              {post.date}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              <span itemProp="timeRequired">{post.readTime}</span>
            </span>
          </div>
          
          {/* Title - h1 for SEO */}
          <h1 
            className="text-3xl md:text-5xl font-bold text-slate-100 leading-tight mb-6"
            itemProp="name"
          >
            {post.title}
          </h1>
          
          {/* Excerpt/Summary */}
          <p 
            className="text-xl text-slate-400 leading-relaxed mb-8"
            itemProp="abstract"
          >
            {post.excerpt}
          </p>
          
          {/* Tags/Keywords */}
          <div 
            className="flex flex-wrap gap-2 mb-8"
            itemProp="keywords"
            content={post.tags.join(', ')}
          >
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Author & Actions */}
          <div className="flex items-center justify-between py-6 border-y border-slate-700/50">
            <div 
              className="flex items-center gap-4"
              itemProp="author"
              itemScope
              itemType="https://schema.org/Person"
            >
              <img 
                src={BIO.avatarUrl} 
                alt={BIO.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-slate-100" itemProp="name">{BIO.name}</div>
                <div className="text-sm text-slate-500" itemProp="jobTitle">CTO & Full-stack Engineer</div>
                <link itemProp="url" href={SITE_URL} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={copyLink}
                className="p-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all"
                title="Copy link"
                aria-label="Copy article link to clipboard"
              >
                <Share2 size={18} aria-hidden="true" />
              </button>
              <button 
                className="p-2.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all"
                title="Bookmark"
                aria-label="Bookmark this article"
              >
                <Bookmark size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Article Content - with proper semantic wrapper */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div 
            ref={contentRef}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-slate-100 prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-slate-700/50
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-slate-400 prose-p:leading-relaxed
              prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-slate-200 prose-strong:font-semibold
              prose-code:text-teal-400 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#0c1222] prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-xl prose-pre:overflow-x-auto
              prose-ul:text-slate-400 prose-ol:text-slate-400
              prose-li:marker:text-teal-500
              prose-blockquote:border-l-teal-500 prose-blockquote:bg-slate-800/20 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-hr:border-slate-700/50
            "
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        
        {/* Resources Section - with citation markup */}
        {post.resources && post.resources.length > 0 && (
          <aside className="max-w-3xl mx-auto px-6 pb-12">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Resources & References</h2>
              <ul className="space-y-3" role="list">
                {post.resources.map((resource, i) => (
                  <li key={i} itemProp="citation" itemScope itemType="https://schema.org/WebPage">
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal-400 hover:underline"
                      itemProp="url"
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                      <span itemProp="name">{resource.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
        
        {/* Post Footer CTA */}
        <footer className="max-w-3xl mx-auto px-6">
          <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-teal-500/5 to-transparent p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-100 mb-2">Enjoyed this article?</h2>
            <p className="text-slate-400 mb-6">
              Let's connect! I write about engineering leadership, architecture decisions, and building products at scale.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href={SOCIALS.find(s => s.platform === 'Twitter/X')?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-teal-500 text-slate-900 font-medium hover:bg-teal-400 transition-colors"
              >
                Follow on X
              </a>
              <a 
                href={SOCIALS.find(s => s.platform === 'LinkedIn')?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-100 font-medium hover:bg-slate-700 transition-colors"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </article>
    </BlogLayout>
  );
};

export default BlogPost;
