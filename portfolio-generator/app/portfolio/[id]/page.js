import Link from 'next/link';

async function getPortfolio(id) {
  try {
    // Use relative URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/portfolio/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Portfolio fetch failed:', res.status);
      return null;
    }

    const data = await res.json();
    return data.portfolio;
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return null;
  }
}

export default async function PortfolioPage({ params }) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-12 text-center max-w-lg w-full">
          <div className="text-7xl mb-6 animate-pulse">❌</div>
          <h1 className="text-3xl font-bold text-white mb-3">Portfolio Not Found</h1>
          <p className="text-gray-400 mb-8 text-lg">This portfolio does not exist or has been removed.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full font-semibold hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-105 transition-all">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const projects = portfolio.Projects || [];
  const experience = portfolio.Experience || [];
  const skills = portfolio.Skills || [];

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.Category]) acc[skill.Category] = [];
    acc[skill.Category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 selection:bg-white/20 font-sans">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] max-w-4xl bg-gradient-to-b from-rose-500/10 via-purple-500/5 to-transparent blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 shadow-[0_0_40px_rgba(244,63,94,0.3)] text-4xl font-bold text-white">
            {portfolio.FullName?.charAt(0)}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            {portfolio.FullName}
          </h1>
          <a
            href={`mailto:${portfolio.Email}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-gray-300 hover:text-white"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Available for work
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-24 pb-32">
        {/* About Section */}
        {portfolio.Bio && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-8">01. About</h2>
            <div className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
              {portfolio.Bio}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest">02. Selected Works</h2>
            </div>

            <div className="grid gap-12">
              {projects.map((project, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute -inset-4 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-2xl font-bold group-hover:text-rose-400 transition-colors">{project.Title}</h3>
                    {project.ProjectURL && (
                      <a
                        href={project.ProjectURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all transform hover:rotate-45"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-4 max-w-2xl">{project.Description}</p>
                  {project.DateCompleted && (
                    <div className="text-xs font-mono text-gray-600">
                      {new Date(project.DateCompleted).getFullYear()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-12">03. Experience</h2>
            <div className="space-y-12">
              {experience.map((exp, idx) => (
                <div key={idx} className="group grid md:grid-cols-[1fr_3fr] gap-4 md:gap-8 transition-all">
                  <div className="text-sm font-mono text-gray-500 py-1">
                    {new Date(exp.StartDate).getFullYear()} — {exp.EndDate ? new Date(exp.EndDate).getFullYear() : 'Present'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 mb-1 group-hover:text-white transition-colors">{exp.JobTitle}</h3>
                    <div className="text-rose-400 mb-4 font-medium">{exp.Company}</div>
                    <p className="text-gray-400 leading-relaxed text-sm">{exp.Description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-10">04. Expertise</h2>
            <div className="grid gap-8">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-gray-400 font-medium mb-4 text-sm">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill, idx) => (
                      <div key={idx} className="px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 transition-colors cursor-default">
                        <span className="text-gray-300 text-sm">{skill.SkillName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="pt-20 border-t border-white/5 text-center">
          <p className="text-gray-600 text-sm font-mono mb-6">
            © {new Date().getFullYear()} {portfolio.FullName}. All rights reserved.
          </p>
          <Link href="/" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">
            Built with Portify
          </Link>
        </div>
      </div>
    </div>
  );
}
