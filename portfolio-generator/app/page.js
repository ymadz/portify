'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, Navbar } from '@/components';

export default function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalSkills: 0,
    totalExperience: 0,
  });

  useEffect(() => {
    fetch('/api/public-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] left-[30%] w-[30%] h-[30%] bg-blue-900/20 rounded-full blur-[100px] animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-900/30 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Floating Navbar */}
      <Navbar showAuthButtons={true} />

      {/* Hero Section */}
      <div className="pt-52 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-8 px-6 py-2 rounded-full glass border border-white/10">
            <span className="bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent font-semibold tracking-wide uppercase text-xs">
              Advanced Database Systems Project
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-none drop-shadow-2xl">
            Build Your
            <br />
            <span className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-[pulse_4s_ease-in-out_infinite] text-glow">
              Legacy
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Craft a stunning professional portfolio powered by enterprise-grade
            <span className="text-white font-medium"> SQL Server</span> architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
            <Link href="/register">
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-lg px-10 py-4 shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:shadow-[0_0_60px_rgba(244,63,94,0.6)]">
                Start Building Now
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-4 border-white/20 hover:bg-white/5">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats Glass Strip */}
          <div className="max-w-3xl mx-auto">
            <div className="glass-panel rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {stats.totalUsers.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Users</div>
              </div>
              <div className="text-center border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0">
                <div className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {stats.totalProjects.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Projects</div>
              </div>
              <div className="text-center border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0">
                <div className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {stats.totalSkills.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">Skills Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Crystal Clear Architecture
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Sleek design meets powerful backend engineering.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-purple-500/50 transition-colors">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <Card.Title className="mb-3 group-hover:text-purple-400 transition-colors">Skill Matrix</Card.Title>
              <Card.Body>
                Visualize your technical proficiency with comprehensive data mapping and categorization.
              </Card.Body>
            </Card>

            <Card className="hover:transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-rose-500/50 transition-colors">
                <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <Card.Title className="mb-3 group-hover:text-rose-400 transition-colors">Project Portfolio</Card.Title>
              <Card.Body>
                Dynamic project showcases with rich metadata, tech stacks, and deep links.
              </Card.Body>
            </Card>

            <Card className="hover:transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <Card.Title className="mb-3 group-hover:text-blue-400 transition-colors">Experience Timeline</Card.Title>
              <Card.Body>
                Chronological career tracking with validation logic and milestone achievements.
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Technical Features */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl p-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 opacity-30 blur-xl"></div>
            <div className="relative bg-[#0F1014] rounded-[22px] p-12 overflow-hidden items-center text-center border border-white/5">

              <div className="relative z-10">
                <div className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mastering SQL Server</h2>
                  <p className="text-gray-400">
                    Engineered with advanced database features for maximum performance.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
                  {[
                    { icon: '⚡', title: 'Triggers', desc: 'Auto-validation' },
                    { icon: '🔧', title: 'Stored Procs', desc: 'JSON Generation' },
                    { icon: '📊', title: 'SQL Functions', desc: 'Calculations' },
                    { icon: '👁️', title: 'Views', desc: 'Analytics' },
                    { icon: '🚀', title: 'Indexes', desc: 'performance' },
                    { icon: '🔍', title: 'Subqueries', desc: 'Discovery' }
                  ].map((feature, i) => (
                    <div key={i} className="glass p-6 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                      <h3 className="font-bold text-white text-lg mb-1">{feature.title}</h3>
                      <p className="text-gray-500 text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 mb-4">© 2026 Portify</p>
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Github</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
