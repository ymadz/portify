import Link from 'next/link';

async function getPortfolio(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/portfolio/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.portfolio;
  } catch (error) {
    return null;
  }
}

export default async function PortfolioPage({ params }) {
  const { id } = await params;
  const portfolio = await getPortfolio(id);

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">This portfolio does not exist.</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {portfolio.FullName}
              </h1>
              <p className="text-gray-600 mb-4">{portfolio.Email}</p>
              {portfolio.Bio && (
                <p className="text-gray-700 max-w-2xl">{portfolio.Bio}</p>
              )}
            </div>
            <div className="text-right">
              <div className="inline-block bg-indigo-100 rounded-lg px-4 py-2">
                <div className="text-3xl font-bold text-indigo-600">
                  {portfolio.ProfileStrength}%
                </div>
                <div className="text-sm text-gray-600">Profile Strength</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 Skills & Expertise</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-semibold text-lg text-indigo-600 mb-3">{category}</h3>
                  <div className="space-y-2">
                    {categorySkills
                      .sort((a, b) => b.ProficiencyLevel - a.ProficiencyLevel)
                      .map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="flex-1 text-gray-700">{skill.SkillName}</span>
                          <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < skill.ProficiencyLevel ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                              />
                            ))}
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
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.Title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.Description}</p>
                  <div className="flex justify-between items-center">
                    {project.ProjectURL && (
                      <a
                        href={project.ProjectURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View Project →
                      </a>
                    )}
                    {project.DateCompleted && (
                      <span className="text-gray-500 text-xs">
                        {new Date(project.DateCompleted).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experience.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💼 Work Experience</h2>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.JobTitle}</h3>
                  <p className="text-indigo-600 font-medium mb-1">{exp.Company}</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(exp.StartDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                    {exp.EndDate ? new Date(exp.EndDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Member since {new Date(portfolio.JoinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Create Your Own Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
