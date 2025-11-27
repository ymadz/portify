// API Route: /api/stats
// GET: Get dashboard statistics (using view vw_AdminDashboardStats)

import { NextResponse } from 'next/server';
import { query, executeFunction } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await requireAuth();
    
    // Get stats from view
    const statsResult = await query('SELECT * FROM vw_AdminDashboardStats');
    const stats = statsResult.recordset[0];
    
    // Get profile strength using function
    const profileStrength = await executeFunction('fn_CalculateProfileStrength', {
      UserID: user.userId,
    });
    
    // Get user-specific counts
    const userStatsResult = await query(
      `SELECT 
        (SELECT COUNT(*) FROM Projects WHERE UserID = @userId) AS UserProjects,
        (SELECT COUNT(*) FROM Experience WHERE UserID = @userId) AS UserExperience,
        (SELECT COUNT(*) FROM UserSkills WHERE UserID = @userId) AS UserSkills`,
      { userId: user.userId }
    );
    
    const userStats = userStatsResult.recordset[0];
    
    // Get skill distribution for current user
    const skillDistributionResult = await query(
      `SELECT sd.Category, COUNT(*) AS Count
       FROM UserSkills us
       INNER JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID
       WHERE us.UserID = @userId
       GROUP BY sd.Category
       ORDER BY Count DESC`,
      { userId: user.userId }
    );
    
    return NextResponse.json({
      stats: {
        // Global stats from view
        totalUsers: stats.TotalUsers,
        totalProjects: stats.TotalProjects,
        totalExperiences: stats.TotalExperiences,
        totalUserSkills: stats.TotalUserSkills,
        mostPopularSkill: stats.MostPopularSkill,
        mostPopularSkillCount: stats.MostPopularSkillCount,
        avgProjectsPerUser: parseFloat(stats.AvgProjectsPerUser?.toFixed(2) || 0),
        avgSkillsPerUser: parseFloat(stats.AvgSkillsPerUser?.toFixed(2) || 0),
        
        // User-specific stats
        profileStrength,
        userProjects: userStats.UserProjects,
        userExperience: userStats.UserExperience,
        userSkills: userStats.UserSkills,
        skillDistribution: skillDistributionResult.recordset,
      },
    });
    
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
