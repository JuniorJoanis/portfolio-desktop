import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft, Share2, Bookmark, ExternalLink } from 'lucide-react';
import BlogLayout from './BlogLayout';
import { BLOG_POSTS } from '../../blogData';
import { SOCIALS } from '../../constants';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <BlogLayout>
      {/* Article Header */}
      <article className="py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-amber-400 transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to all posts
          </Link>
          
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          <p className="text-xl text-zinc-400 leading-relaxed mb-8">
            {post.excerpt}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Author & Actions */}
          <div className="flex items-center justify-between py-6 border-y border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-mono font-bold text-black">
                JJ
              </div>
              <div>
                <div className="font-medium text-zinc-100">Junior Joanis</div>
                <div className="text-sm text-zinc-500">CTO & Full-stack Engineer</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={copyLink}
                className="p-2.5 rounded-lg bg-white/5 text-zinc-400 hover:text-amber-400 hover:bg-white/10 transition-all"
                title="Copy link"
              >
                <Share2 size={18} />
              </button>
              <button 
                className="p-2.5 rounded-lg bg-white/5 text-zinc-400 hover:text-amber-400 hover:bg-white/10 transition-all"
                title="Bookmark"
              >
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div 
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-zinc-100 prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/10
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-zinc-400 prose-p:leading-relaxed
              prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-zinc-200 prose-strong:font-semibold
              prose-code:text-amber-400 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#12121a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:overflow-x-auto
              prose-ul:text-zinc-400 prose-ol:text-zinc-400
              prose-li:marker:text-amber-500
              prose-blockquote:border-l-amber-500 prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-hr:border-white/10
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        
        {/* Resources Section */}
        {post.resources && post.resources.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 pb-12">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">Resources</h3>
              <ul className="space-y-3">
                {post.resources.map((resource, i) => (
                  <li key={i}>
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-amber-400 hover:underline"
                    >
                      <ExternalLink size={14} />
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Post Footer */}
        <div className="max-w-3xl mx-auto px-6">
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-amber-500/5 to-transparent p-8 text-center">
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">Enjoyed this article?</h3>
            <p className="text-zinc-400 mb-6">
              Let's connect! I write about engineering leadership, architecture decisions, and building products at scale.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href={SOCIALS.find(s => s.platform === 'Twitter/X')?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
              >
                Follow on X
              </a>
              <a 
                href={SOCIALS.find(s => s.platform === 'LinkedIn')?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-white/10 text-zinc-100 font-medium hover:bg-white/20 transition-colors"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
};

export default BlogPost;

