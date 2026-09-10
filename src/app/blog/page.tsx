'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Calendar, User, MessageCircle, Tag, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function BlogPage() {
  const router = useRouter();
  const switchDemoRole = useStore((state) => state.switchDemoRole);
  const triggerConfetti = useStore((state) => state.triggerConfetti);

  const [searchTerm, setSearchTerm] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  const blogPosts = [
    {
      id: 'post-1',
      title: 'How to create the perfect resume',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&q=80',
      author: 'James Smith',
      category: 'Development',
      date: 'June 12, 2026',
      comments: 2,
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus. Morbi eget urna sit amet ligula lacinia mollis.',
    },
    {
      id: 'post-2',
      title: '5 Tips to make money from home',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop&q=80',
      author: 'James Smith',
      category: 'Development',
      date: 'June 12, 2026',
      comments: 2,
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec malesuada lorem maximus mauris scelerisque, at rutrum nulla dictum. Ut ac ligula sapien. Suspendisse cursus faucibus finibus. Morbi eget urna sit amet ligula lacinia mollis.',
    },
    {
      id: 'post-3',
      title: 'Adaptive AI in Modern High School Classrooms',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&q=80',
      author: 'Dr. Sarah Jenkins',
      category: 'Education & AI',
      date: 'June 10, 2026',
      comments: 5,
      excerpt:
        'Explore how automated diagnostic tests and difficulty recalibration provide immediate scaffolding for students while delivering actionable mistake classifications to educators.',
    },
  ];

  const categories = [
    { name: 'Development', count: 18 },
    { name: 'Social Media', count: 12 },
    { name: 'Press & Media', count: 8 },
    { name: 'Events & Lifestyle', count: 15 },
    { name: 'Uncategorized', count: 4 },
  ];

  const archives = [
    'February 2026',
    'March 2026',
    'April 2026',
    'May 2026',
    'June 2026',
  ];

  const tags = [
    'education',
    'courses',
    'development',
    'design',
    'on line courses',
    'wp',
    'html5',
    'music',
  ];

  const handleCourseSearch = (e: React.FormEvent) => {
    e.preventDefault();
    switchDemoRole('STUDENT');
    router.push(`/student/courses?q=${encodeURIComponent(courseSearch)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#121519] text-slate-900 dark:text-slate-100">
      {/* ========================================================================= */}
      {/* 1. BREADCRUMB HERO BANNER (matching video 00:17 - 00:20)                  */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-webuni-hero py-14 px-4 sm:px-8 text-white border-b border-[#283038]">
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Link href="/" className="text-white hover:text-[#d82a4e] transition-colors">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-[#d82a4e]">Blog</span>
          </div>
          <span className="text-xs text-slate-300 italic hidden sm:inline">
            WebUni Knowledge Hub &amp; Academic News
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SEARCH YOUR COURSE CRIMSON BANNER (matching video 00:20 - 00:23)       */}
      {/* ========================================================================= */}
      <section className="bg-[#d82a4e] text-white py-12 px-4 sm:px-8 shadow-md">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Search your course</h2>

          <form
            onSubmit={handleCourseSearch}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3 max-w-4xl mx-auto"
          >
            <div className="sm:col-span-5">
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Course"
                className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none font-medium shadow-inner italic"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Category"
                className="w-full px-4 py-3 rounded-sm text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none font-medium shadow-inner italic"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-sm bg-[#1a1e24] hover:bg-black text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-md transition-all cursor-pointer"
              >
                Search Course
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BLOG POSTS & SIDEBAR (matching video 00:23 - 00:29)                    */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Blog Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-[#1a1e24] rounded-sm overflow-hidden border border-slate-200 dark:border-[#283038] shadow-sm hover:shadow-xl transition-all"
              >
                {/* Featured Post Image */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight hover:text-[#d82a4e] transition-colors cursor-pointer">
                    {post.title}
                  </h2>

                  {/* Metadata Row matching video */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-[#283038]">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-[#d82a4e]" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#d82a4e]" />
                      <span>{post.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{post.comments} Comments</span>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    {post.excerpt}
                  </p>

                  {/* Read More Crimson Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        triggerConfetti();
                        switchDemoRole('STUDENT');
                        router.push('/student/courses');
                      }}
                      className="btn-crimson px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md inline-flex items-center gap-1.5"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Column: Widgets Sidebar (4 cols) matching video */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Widget 1: Search */}
            <div className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-4 pr-10 py-3 rounded-sm text-xs text-slate-900 bg-slate-50 dark:bg-[#20252b] dark:text-white placeholder-slate-400 border border-slate-200 dark:border-[#283038] focus:outline-none focus:ring-2 focus:ring-[#d82a4e] italic"
                />
                <button
                  type="button"
                  className="absolute right-3 text-slate-400 hover:text-[#d82a4e] cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Widget 2: Categories */}
            <div className="p-6 rounded-sm bg-slate-50/70 dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-[#283038] pb-2">
                Categories
              </h3>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {categories.map((cat) => (
                  <li key={cat.name} className="flex items-center justify-between hover:text-[#d82a4e] cursor-pointer transition-colors">
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">({cat.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget 3: Archives */}
            <div className="p-6 rounded-sm bg-slate-50/70 dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-[#283038] pb-2">
                Archives
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {archives.map((arch) => (
                  <li key={arch} className="hover:text-[#d82a4e] cursor-pointer transition-colors">
                    {arch}
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget 4: Archives Tag Cloud */}
            <div className="p-6 rounded-sm bg-slate-50/70 dark:bg-[#1a1e24] border border-slate-200 dark:border-[#283038] space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-[#283038] pb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      switchDemoRole('STUDENT');
                      router.push(`/student/courses?tag=${tag}`);
                    }}
                    className="px-3 py-1.5 rounded-sm bg-[#d82a4e] hover:bg-[#c32646] text-white text-[11px] font-bold uppercase transition-all shadow-xs cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 5: WebUni Discount Promo Card (matching video 00:27) */}
            <div className="relative rounded-sm overflow-hidden p-8 text-center text-white bg-gradient-to-br from-[#d82a4e] to-[#a81c39] shadow-xl space-y-3">
              <div className="text-xl font-black">
                Web<span className="text-white">Uni</span>
              </div>
              <p className="text-xs text-white/90 font-medium">Learn From the Best</p>
              <div className="py-2">
                <span className="inline-block px-4 py-1.5 rounded-sm bg-white text-[#d82a4e] font-extrabold text-lg shadow-md">
                  20% Discount
                </span>
              </div>
              <button
                onClick={() => {
                  switchDemoRole('STUDENT');
                  router.push('/student/courses');
                }}
                className="w-full py-2.5 rounded-sm bg-[#1a1e24] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Enroll Today
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer matching video */}
      <footer className="mt-auto border-t border-slate-200 dark:border-[#283038] bg-white dark:bg-[#13171b] pt-16 pb-10 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>Copyright ©2026 All rights reserved | This template is made with ❤️ by Colorlib &amp; SmartLearn</p>
          <div className="flex items-center gap-5 font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-[#d82a4e]">Terms &amp; Conditions</Link>
            <Link href="/" className="hover:text-[#d82a4e]">Register</Link>
            <Link href="/" className="hover:text-[#d82a4e]">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
