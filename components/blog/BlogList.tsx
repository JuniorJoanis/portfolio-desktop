import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import BlogLayout from './BlogLayout';
import { BLOG_POSTS } from '../../blogData';
import {
  updateSEOMeta,
  generateBlogListStructuredData,
  injectStructuredData,
  removeStructuredData,
  SITE_URL,
} from '../../utils/seo';
import { BIO } from '../../constants';

const BlogList: React.FC = () => {
  // SEO: Update meta tags and structured data
  useEffect(() => {
    updateSEOMeta({
      title: `Engineering Blog | ${BIO.name} - CTO & Full-stack Engineer`,
      description: 'Deep dives into architecture decisions, engineering leadership, and building products that scale. From authentication flows to AI integrations.',
      url: `${SITE_URL}/blog`,
      type: 'website',
    });

    // Inject Blog structured data
    const blogJsonLd = generateBlogListStructuredData(BLOG_POSTS);
    injectStructuredData('blog-list-structured-data', blogJsonLd);

    // Cleanup on unmount
    return () => {
      removeStructuredData('blog-list-structured-data');
    };
  }, []);

  return (
    <BlogLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="max-w-2xl">
            <p className="text-teal-400 text-sm tracking-wide uppercase mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Engineering Notes
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 leading-[1.1]" style={{ fontFamily: "'Instrument Serif', serif" }}>
              <span className="text-slate-100">Thoughts on </span>
              <span className="italic text-teal-400">craft</span>
              <span className="text-slate-100"> & code</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Deep dives into architecture decisions, engineering leadership, and building 
              products that scale. From authentication flows to AI integrations.
            </p>
          </div>
        </div>
      </section>
      
      {/* Posts Grid - with semantic markup */}
      <section className="pb-20" aria-label="Blog posts">
        <div className="max-w-4xl mx-auto px-6">
          {/* Featured Post */}
          {BLOG_POSTS.filter(p => p.featured).map(post => (
            <Link 
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block mb-16 group"
            >
              <article 
                className="relative"
                itemScope 
                itemType="https://schema.org/BlogPosting"
              >
                {/* Featured indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={14} className="text-teal-400" aria-hidden="true" />
                  <span className="text-xs text-teal-400 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>Featured Article</span>
                </div>
                
                <h2 
                  className="text-2xl md:text-3xl lg:text-4xl text-slate-100 mb-4 group-hover:text-teal-400 transition-colors leading-tight" 
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                  itemProp="headline"
                >
                  {post.title}
                </h2>
                
                <p 
                  className="text-slate-400 text-lg leading-relaxed mb-6 max-w-2xl" 
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  itemProp="description"
                >
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <time 
                    className="flex items-center gap-2"
                    itemProp="datePublished"
                  >
                    <Calendar size={14} aria-hidden="true" />
                    {post.date}
                  </time>
                  <span className="flex items-center gap-2">
                    <Clock size={14} aria-hidden="true" />
                    {post.readTime}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-8" itemProp="keywords" content={post.tags.join(', ')}>
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-slate-800/50 text-slate-400 border border-slate-700/50"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-teal-400 text-sm font-medium group-hover:gap-4 transition-all" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span>Read article</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </div>
                
                {/* Hidden semantic data */}
                <meta itemProp="url" content={`${SITE_URL}/blog/${post.slug}`} />
                <span itemProp="author" itemScope itemType="https://schema.org/Person">
                  <meta itemProp="name" content={BIO.name} />
                </span>
                
                {/* Decorative line */}
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/50 via-teal-500/20 to-transparent hidden md:block" aria-hidden="true" />
              </article>
            </Link>
          ))}
          
          {/* Divider */}
          <div className="border-t border-slate-800/50 my-12" role="separator" />
          
          {/* All Posts label */}
          <h2 className="text-sm text-slate-500 uppercase tracking-wider mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            All Articles
          </h2>
          
          {/* Other Posts */}
          <div className="space-y-1">
            {BLOG_POSTS.filter(p => !p.featured).map(post => (
              <Link 
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block group"
              >
                <article 
                  className="py-6 border-b border-slate-800/30 hover:border-slate-700/50 transition-colors"
                  itemScope 
                  itemType="https://schema.org/BlogPosting"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-xl text-slate-200 mb-2 group-hover:text-teal-400 transition-colors" 
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                        itemProp="headline"
                      >
                        {post.title}
                      </h3>
                      <p 
                        className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3" 
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                        itemProp="description"
                      >
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2" itemProp="keywords" content={post.tags.join(', ')}>
                        {post.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 rounded text-xs bg-slate-800/30 text-slate-500"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <time itemProp="datePublished">{post.date}</time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  {/* Hidden semantic data */}
                  <meta itemProp="url" content={`${SITE_URL}/blog/${post.slug}`} />
                  <span itemProp="author" itemScope itemType="https://schema.org/Person">
                    <meta itemProp="name" content={BIO.name} />
                  </span>
                </article>
              </Link>
            ))}
          </div>
          
          {/* Empty state for when there are few posts */}
          {BLOG_POSTS.length <= 1 && (
            <div className="mt-12 text-center py-16 border border-dashed border-slate-800/50 rounded-xl">
              <div className="text-slate-500 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>More articles coming soon...</div>
              <p className="text-sm text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Follow me on X to stay updated.
              </p>
            </div>
          )}
        </div>
      </section>
    </BlogLayout>
  );
};

export default BlogList;
