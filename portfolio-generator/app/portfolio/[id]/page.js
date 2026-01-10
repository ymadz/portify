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
    <div className="min-h-screen text-gray-100 selection:bg-rose-500/30">
      {/* Header */}
      <div className="glass-nav sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2 tracking-tight">
                {portfolio.FullName}
              </h1>
              <p className="text-rose-400 font-medium mb-4">{portfolio.Email}</p>

            </div>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* About Me Section */}
        {portfolio.Bio && (
          <section className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <span className="text-9xl">👤</span>
            </div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-green-400">About</span> Me
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {portfolio.Bio}
              </p>
            </div>
          </section>
        )}
        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <span className="text-9xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="text-rose-400">Skills</span> & Expertise
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-bold text-lg text-rose-300 mb-5 uppercase tracking-wide border-b border-white/10 pb-2">{category}</h3>
                  <div className="space-y-4">
                    {categorySkills
                      .sort((a, b) => b.ProficiencyLevel - a.ProficiencyLevel)
                      .map((skill, idx) => (
                        <div key={idx} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{skill.SkillName}</span>
                            <span className="text-xs text-gray-500 font-mono">{skill.ProficiencyLevel * 10}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.6)]"
                              style={{ width: `${skill.ProficiencyLevel * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="glass-card rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="text-indigo-400">Featured</span> Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <div key={idx} className="group glass-panel rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-rose-500/30 hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-rose-300 transition-colors">{project.Title}</h3>
                    {project.DateCompleted && (
                      <span className="text-xs font-mono text-gray-500 bg-black/20 px-2 py-1 rounded">
                        {new Date(project.DateCompleted).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">{project.Description}</p>

                  {project.ProjectURL && (
                    <a
                      href={project.ProjectURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      View Project <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <section className="glass-card rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
              <span className="text-rose-400">Work</span> Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative pl-8 border-l border-white/10 last:border-0 hover:border-l-rose-500 transition-colors duration-300">
                  <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-black" />
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-xl font-bold text-gray-100">{exp.JobTitle}</h3>
                    <span className="text-rose-400 font-medium">{exp.Company}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 font-mono uppercase tracking-wide">
                    {new Date(exp.StartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} —{' '}
                    {exp.EndDate ? new Date(exp.EndDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                  </p>
                  <p className="text-gray-400 max-w-3xl leading-relaxed">{exp.Description || "Contributed to key projects and company goals."}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="text-center py-12 opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-gray-500 mb-6 font-mono text-sm">
            Member since {new Date(portfolio.JoinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-sm text-gray-400 hover:text-white">
            <span>←</span> Create Your Own Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
