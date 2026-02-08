import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HERO, PAIN_POINTS, SOLUTION, SERVICES, PROCESS_STEPS,
  TESTIMONIALS, CASE_STUDIES, ABOUT, SOCIALS, NAV_LINKS, BIO, SOCIAL_PROOF_LOGOS,
} from '@/constants';
import { BLOG_POSTS } from '@/blogData';

// Helper to get social URL by platform
const getSocialUrl = (platform: string): string => {
  const social = SOCIALS.find(s => s.platform.toLowerCase().includes(platform.toLowerCase()));
  return social?.url || '';
};

// Icon class map for Flaticon UIcons
const iconClassMap: Record<string, string> = {
  rocket: 'fi-rr-rocket',
  bot: 'fi-rr-artificial-intelligence',
  banknote: 'fi-rr-bank',
  wrench: 'fi-rr-tools',
  clock: 'fi-rr-alarm-clock',
  brain: 'fi-rr-brain',
  unplug: 'fi-rr-plug',
  'file-spreadsheet': 'fi-rr-file',
};

type FlaticonIconProps = {
  name: string;
  size?: number;
  className?: string;
  label?: string;
};

const FlaticonIcon: React.FC<FlaticonIconProps> = ({ name, size = 16, className = '', label }) => (
  <span
    className={`fi ${name} leading-none align-middle ${className}`}
    style={{ fontSize: `${size}px` }}
    aria-hidden={label ? undefined : true}
    aria-label={label}
  />
);

const normalizeTag = (tag: string): string => tag.trim().toLowerCase();

const getRelatedBlogPost = (tags: string[]) => {
  const normalizedTags = tags.map(normalizeTag);
  return BLOG_POSTS.find((post) =>
    post.tags.some((tag) => normalizedTags.includes(normalizeTag(tag)))
  );
};

// Intersection Observer hook for scroll animations
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// Smooth scroll to section
function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/70'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('#hero')}
            className="text-lg font-semibold tracking-tight text-slate-900 hover:text-slate-700 transition-colors"
          >
            JJ<span className="text-slate-400">.</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href={HERO.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2.5 rounded-full transition-colors text-sm"
            >
              <FlaticonIcon name="fi-rr-calendar" size={16} />
              <span className="hidden sm:inline">Book a Call</span>
              <span className="sm:hidden">Book</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <FlaticonIcon name="fi-rr-xmark" size={22} />
              ) : (
                <FlaticonIcon name="fi-rr-bars-staggered" size={22} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => { scrollToSection(link.href); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 flex items-center gap-3 px-4">
              <Link to="/blog" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
                <FlaticonIcon name="fi-rr-book-open-reader" size={14} /> Blog
              </Link>
              <Link to="/desktop" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
                <FlaticonIcon name="fi-rr-monitor" size={14} /> Desktop
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const { ref, inView } = useInView();

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 pb-16">

      <div ref={ref} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <FlaticonIcon name="fi-rr-bolt" size={14} />
            MVP Delivery &middot; Legacy Rescue &middot; Production AI
          </div>

          {/* Headline */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-semibold tracking-tight text-slate-900 leading-[1.08] mb-6 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {HERO.headline}
          </h1>

          {/* Subheadline */}
          <p className={`text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {HERO.subheadline}
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16 transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <a
              href={HERO.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-full transition-colors text-base"
            >
              <FlaticonIcon name="fi-rr-calendar" size={18} />
              {HERO.primaryCta}
            </a>
            <button
              onClick={() => scrollToSection('#services')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-2 py-3 transition-colors text-base group"
            >
              {HERO.secondaryCta}
              <FlaticonIcon name="fi-rr-arrow-right" size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className={`flex flex-wrap gap-8 sm:gap-12 transition-all duration-700 delay-[400ms] ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {HERO.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl sm:text-4xl font-semibold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof Logos ────────────────────────────────────────────────────────

function SocialProofSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-10 sm:py-12">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-[0.25em] mb-6">
            Helping Teams Win Enterprise Clients Like
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {SOCIAL_PROOF_LOGOS.map((logo) => (
              <div key={logo.name} className="group flex items-center justify-center h-12 sm:h-14">
                <img
                  src={logo.logoUrl}
                  alt={`${logo.name} logo`}
                  className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[160px] object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem Section ──────────────────────────────────────────────────────────

function ProblemSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-20 sm:py-28 bg-[#F6F7F9]">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight mb-4">
            Sound Familiar?
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            If you're a founder or CTO dealing with any of these, you're losing momentum and burning expensive time.
          </p>
        </div>

        {/* Pain points grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {PAIN_POINTS.map((pain, index) => {
            const iconClass = iconClassMap[pain.icon] || 'fi-rr-file';
            return (
              <div
                key={pain.id}
                className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 hover:border-slate-300/80 hover:shadow-md transition-all duration-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: inView ? `${index * 100 + 200}ms` : '0ms' }}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                  <FlaticonIcon name={iconClass} size={22} className="text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{pain.title}</h3>
                <p className="text-slate-600 leading-relaxed">{pain.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Solution Section ─────────────────────────────────────────────────────────

function SolutionSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-20 sm:py-28">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">The Solution</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight mb-4">
            {SOLUTION.title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {SOLUTION.subtitle}
          </p>
        </div>

        {/* Solution points */}
        <div className="grid lg:grid-cols-3 gap-8">
          {SOLUTION.points.map((point, index) => (
            <div
              key={point.title}
              className={`relative transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: inView ? `${index * 150 + 200}ms` : '0ms' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{point.title}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed pl-11">{point.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-12 transition-all duration-700 delay-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <a
            href={HERO.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
          >
            <FlaticonIcon name="fi-rr-calendar" size={16} />
            Let's Talk About Your Project
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ─────────────────────────────────────────────────────────

function ServicesSection() {
  const { ref, inView } = useInView();
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#F6F7F9]">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Services</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight mb-4">
            What I Build For You
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Each engagement is scoped around your business outcomes, not a tech stack wishlist.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {SERVICES.map((service, index) => {
            const iconClass = iconClassMap[service.icon] || 'fi-rr-tools';
            const isExpanded = expandedService === service.id;

            return (
              <div
                key={service.id}
                className={`bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300/80 transition-all duration-500 overflow-hidden ${
                  isExpanded ? 'shadow-md border-slate-300/80' : 'hover:shadow-sm'
                } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: inView ? `${index * 100 + 200}ms` : '0ms' }}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FlaticonIcon name={iconClass} size={22} className="text-slate-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">{service.title}</h3>
                      <p className="text-slate-600 font-semibold text-sm">{service.outcome}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed mb-4">{service.description}</p>

                  <div className="bg-slate-50 rounded-lg px-4 py-3 mb-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-700">Who it's for: </span>
                      {service.forWhom}
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    {isExpanded ? 'Hide' : 'See'} deliverables
                    <FlaticonIcon name="fi-rr-angle-right" size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {/* Expandable deliverables */}
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                    <ul className="space-y-2">
                      {service.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <FlaticonIcon name="fi-rr-badge-check" size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-12 text-center transition-all duration-700 delay-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-slate-600 mb-4">Not sure which service fits? Let's figure it out together.</p>
          <a
            href={HERO.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
          >
            <FlaticonIcon name="fi-rr-calendar" size={16} />
            Book a Free Discovery Call
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Process Section ──────────────────────────────────────────────────────────

function ProcessSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-20 sm:py-28">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight mb-4">
            Simple Process. Real Results.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            No bureaucracy. No 47-page proposals. Just clear steps from first call to working product.
          </p>
        </div>

        {/* Process steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`relative text-center transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: inView ? `${index * 150 + 200}ms` : '0ms' }}
            >
              {/* Step number */}
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-semibold mx-auto mb-5">
                {step.id}
              </div>

              {/* Connector line (hidden on last item and mobile) */}
              {index < PROCESS_STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-[2px] bg-slate-200" />
              )}

              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#F6F7F9]">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: About content */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">About</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight mb-6">
              {ABOUT.headline}
            </h2>

            <div className="space-y-4 mb-8">
              {ABOUT.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <FlaticonIcon name="fi-rr-badge-check" size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-600 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <a
              href={HERO.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
            >
              <FlaticonIcon name="fi-rr-calendar" size={16} />
              Work With Me
            </a>
          </div>

          {/* Right: Industries & companies */}
          <div className={`space-y-8 transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Industries */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-4">
                <FlaticonIcon name="fi-rr-bullseye" size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-900">Industries</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ABOUT.industries.map((industry) => (
                  <span key={industry} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200">
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            {/* Types of companies */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-4">
                <FlaticonIcon name="fi-rr-users" size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-900">Who I Work With</h3>
              </div>
              <ul className="space-y-3">
                {ABOUT.companies.map((company) => (
                  <li key={company} className="flex items-center gap-2.5">
                    <FlaticonIcon name="fi-rr-angle-right" size={14} className="text-slate-500 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{company}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Credibility badges */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-4">
                <FlaticonIcon name="fi-rr-shield" size={18} className="text-slate-700" />
                <h3 className="font-semibold text-slate-900">Track Record</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-semibold text-slate-900">100k+</div>
                  <div className="text-xs text-slate-400">Users on platforms I've built</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900">12+</div>
                  <div className="text-xs text-slate-400">Years shipping products</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900">10+</div>
                  <div className="text-xs text-slate-400">Engineers managed as CTO</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900">99.9%</div>
                  <div className="text-xs text-slate-400">SLA on enterprise infra</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Case Studies Section ─────────────────────────────────────────────────────

function CaseStudiesSection() {
  const { ref, inView } = useInView();

  return (
    <section id="case-studies" className="py-20 sm:py-28">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Case Studies</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight mb-4">
            Results, Not Promises
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Real outcomes from real engagements. Here's what happens when you bring a senior operator into the build.
          </p>
        </div>

        {/* Case study cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {CASE_STUDIES.map((cs, index) => {
            const relatedPost = getRelatedBlogPost(cs.tags);
            const fallbackTag = cs.tags[0] || 'Insights';
            const blogLink = relatedPost ? `/blog/${relatedPost.slug}` : `/blog?tag=${encodeURIComponent(fallbackTag)}`;
            const blogLabel = relatedPost ? `Read: ${relatedPost.title}` : `Explore ${fallbackTag} insights`;

            return (
            <div
              key={cs.id}
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 hover:border-slate-300/80 hover:shadow-md transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: inView ? `${index * 100 + 200}ms` : '0ms' }}
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cs.tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">{cs.title}</h3>
              <p className="text-sm text-slate-400 font-medium mb-3">{cs.client}</p>

              <div className="space-y-3 mb-5">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Challenge</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{cs.challenge}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Outcome</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{cs.outcome}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Results</p>
                <ul className="space-y-1.5">
                  {cs.metrics.map((metric, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FlaticonIcon name="fi-rr-arrow-up-right" size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <a
                  href={blogLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <FlaticonIcon name="fi-rr-book-open-reader" size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="leading-snug text-left">{blogLabel}</span>
                </a>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

function TestimonialsSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 tracking-tight mb-4">
            What Clients Say
          </h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: inView ? `${index * 150 + 200}ms` : '0ms' }}
            >
              <FlaticonIcon name="fi-rr-quote-right" size={24} className="text-slate-400 mb-4" />
              <p className="text-slate-600 leading-relaxed mb-6 text-[15px]">{t.quote}</p>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-slate-700">
                      {t.author.split(' ').map(w => w[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.role}</p>
                    <p className="text-xs text-slate-500">{t.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA Section ────────────────────────────────────────────────────────

function FinalCTASection() {
  const { ref, inView } = useInView();

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <FlaticonIcon name="fi-rr-bolt" size={28} className="text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-slate-900 tracking-tight mb-6">
            Ready to Stop Firefighting<br className="hidden sm:block" /> and Start Shipping?
          </h2>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Book a free 30-minute discovery call. I'll learn about your business, your pain points, and tell you honestly whether I can help and how.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href={HERO.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-full transition-colors text-lg"
            >
              <FlaticonIcon name="fi-rr-calendar" size={20} />
              Book a Discovery Call
            </a>
            <a
              href={getSocialUrl('Email')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4 py-3 transition-colors text-base"
            >
              <FlaticonIcon name="fi-rr-envelope" size={18} />
              Or send me an email
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-4">
            <a href={getSocialUrl('LinkedIn')} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors" aria-label="LinkedIn">
              <FlaticonIcon name="fi-brands-linkedin" size={20} />
            </a>
            <a href={getSocialUrl('GitHub')} target="_blank" rel="noopener noreferrer" className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors" aria-label="GitHub">
              <FlaticonIcon name="fi-brands-github" size={20} />
            </a>
            <a href={getSocialUrl('Email')} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors" aria-label="Email">
              <FlaticonIcon name="fi-rr-envelope" size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-10 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Company info */}
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-slate-900">Joanis Innovative Ventures B.V.</p>
            <p className="text-xs text-slate-400 mt-1">Amsterdam, Netherlands &middot; VAT NL866400485B01</p>
          </div>

          {/* Footer links */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <Link to="/blog" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <FlaticonIcon name="fi-rr-book-open-reader" size={14} /> Blog
            </Link>
            <span className="text-slate-200">&middot;</span>
            <Link to="/desktop" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
              <FlaticonIcon name="fi-rr-monitor" size={14} /> Interactive Portfolio
            </Link>
            <span className="text-slate-200">&middot;</span>
            <a href={getSocialUrl('LinkedIn')} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
              LinkedIn
            </a>
            <span className="text-slate-200">&middot;</span>
            <a href={getSocialUrl('GitHub')} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Consultancy Component ───────────────────────────────────────────────

function Consultancy() {
  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-900 selection:bg-slate-200 font-sans antialiased relative overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(148,163,184,0.22),transparent_55%),repeating-linear-gradient(0deg,rgba(148,163,184,0.08)_0,rgba(148,163,184,0.08)_1px,transparent_1px,transparent_36px),repeating-linear-gradient(90deg,rgba(148,163,184,0.08)_0,rgba(148,163,184,0.08)_1px,transparent_1px,transparent_36px),repeating-linear-gradient(0deg,rgba(148,163,184,0.14)_0,rgba(148,163,184,0.14)_1px,transparent_1px,transparent_180px),repeating-linear-gradient(90deg,rgba(148,163,184,0.14)_0,rgba(148,163,184,0.14)_1px,transparent_1px,transparent_180px)]">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(148,163,184,0.18),transparent_70%)]" />
        <div className="absolute -bottom-48 -left-40 w-[560px] h-[560px] bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)]" />
      </div>
      <Navbar />
      <HeroSection />
      <SocialProofSection />
      <ProblemSection />
      <SolutionSection />
      <ServicesSection />
      <ProcessSection />
      <CaseStudiesSection />
      <AboutSection />
      <TestimonialsSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}

export default Consultancy;
