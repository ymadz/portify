import Link from 'next/link';
import { Button, Card } from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Portfolio Generator Platform
          </h1>
          <p className="text-xl text-[var(--muted)] mb-8 leading-relaxed">
            Build, manage, and share your professional portfolio with ease.
            Showcase your skills, projects, and experience to the world.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <div className="text-4xl mb-4">🎯</div>
            <Card.Title>Manage Skills</Card.Title>
            <Card.Body>
              <p className="mt-2">
                Track your technical skills with proficiency levels
              </p>
            </Card.Body>
          </Card>
          
          <Card>
            <div className="text-4xl mb-4">🚀</div>
            <Card.Title>Showcase Projects</Card.Title>
            <Card.Body>
              <p className="mt-2">
                Highlight your best work with descriptions and links
              </p>
            </Card.Body>
          </Card>
          
          <Card>
            <div className="text-4xl mb-4">💼</div>
            <Card.Title>Track Experience</Card.Title>
            <Card.Body>
              <p className="mt-2">
                Document your professional journey and achievements
              </p>
            </Card.Body>
          </Card>
        </div>
        
        {/* Technical Features */}
        <Card className="p-8">
          <Card.Header>
            <Card.Title className="text-2xl text-center">
              Advanced Database Systems Project
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p className="text-center mb-6">
              This platform demonstrates mastery of Microsoft SQL Server features including:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Triggers for data validation',
                'Stored procedures for complex queries',
                'Functions for calculations',
                'Views for aggregated statistics',
                'Optimized indexes for performance',
                'Complex subqueries for search'
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-[var(--success)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
