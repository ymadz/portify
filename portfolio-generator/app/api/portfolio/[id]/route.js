// API Route: /api/portfolio/[id]
// GET: Get full portfolio for a user (using stored procedure sp_GetFullPortfolioJSON)

import { NextResponse } from 'next/server';
import { executeProc } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    // Execute stored procedure to get full portfolio as JSON
    const result = await executeProc('sp_GetFullPortfolioJSON', { UserID: userId });
    
    if (!result.recordset || result.recordset.length === 0) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }
    
    // The stored procedure returns JSON string, parse it
    const portfolioJSON = result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'];
    
    if (!portfolioJSON) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }
    
    const portfolio = JSON.parse(portfolioJSON);
    
    // Parse nested JSON strings
    if (portfolio.Projects && typeof portfolio.Projects === 'string') {
      portfolio.Projects = JSON.parse(portfolio.Projects);
    }
    if (portfolio.Experience && typeof portfolio.Experience === 'string') {
      portfolio.Experience = JSON.parse(portfolio.Experience);
    }
    if (portfolio.Skills && typeof portfolio.Skills === 'string') {
      portfolio.Skills = JSON.parse(portfolio.Skills);
    }
    
    return NextResponse.json({ portfolio });
    
  } catch (error) {
    console.error('Get portfolio error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}
