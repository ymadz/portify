-- =============================================
-- Portfolio Generator Platform - Advanced SQL Features
-- Database: PortfolioDB
-- SQL Server 2019+
-- =============================================

USE PortfolioDB;
GO

-- =============================================
-- Clean up existing objects (for re-runs)
-- =============================================
IF OBJECT_ID('trg_ValidateExperienceDates', 'TR') IS NOT NULL 
    DROP TRIGGER trg_ValidateExperienceDates;
GO

IF OBJECT_ID('fn_CalculateProfileStrength', 'FN') IS NOT NULL 
    DROP FUNCTION fn_CalculateProfileStrength;
GO

IF OBJECT_ID('sp_GetFullPortfolioJSON', 'P') IS NOT NULL 
    DROP PROCEDURE sp_GetFullPortfolioJSON;
GO

IF OBJECT_ID('vw_AdminDashboardStats', 'V') IS NOT NULL 
    DROP VIEW vw_AdminDashboardStats;
GO

IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_SkillName')
    DROP INDEX idx_SkillName ON SkillDefinitions;
GO

IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_UserEmail')
    DROP INDEX idx_UserEmail ON Users;
GO

-- =============================================
-- FEATURE A: Trigger - Validate Experience Dates
-- =============================================
-- Purpose: Ensure EndDate is not before StartDate
-- Fires on: INSERT and UPDATE to Experience table
-- =============================================
CREATE TRIGGER trg_ValidateExperienceDates
ON Experience
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if any inserted/updated records have invalid date ranges
    IF EXISTS (
        SELECT 1 
        FROM inserted 
        WHERE EndDate IS NOT NULL 
        AND EndDate < StartDate
    )
    BEGIN
        -- Rollback the transaction
        ROLLBACK TRANSACTION;
        
        -- Throw a custom error
        THROW 50001, 'End Date cannot be before Start Date', 1;
    END
END;
GO

PRINT 'Trigger created: trg_ValidateExperienceDates';
GO

-- =============================================
-- FEATURE B: Stored Function - Calculate Profile Strength
-- =============================================
-- Purpose: Calculate a user's profile completion score (0-100)
-- Logic:
--   Base: 0
--   +20 if Bio is not empty
--   +5 per skill (Max 30 = 6 skills)
--   +10 per project (Max 50 = 5 projects)
-- =============================================
CREATE FUNCTION fn_CalculateProfileStrength(@UserID INT)
RETURNS INT
AS
BEGIN
    DECLARE @Score INT = 0;
    DECLARE @BioLength INT;
    DECLARE @SkillCount INT;
    DECLARE @ProjectCount INT;
    
    -- Check if Bio exists and is not empty
    SELECT @BioLength = LEN(LTRIM(RTRIM(ISNULL(Bio, ''))))
    FROM Users
    WHERE UserID = @UserID;
    
    IF @BioLength > 0
        SET @Score = @Score + 20;
    
    -- Count skills (max 6 skills = 30 points)
    SELECT @SkillCount = COUNT(*)
    FROM UserSkills
    WHERE UserID = @UserID;
    
    SET @Score = @Score + (CASE WHEN @SkillCount * 5 > 30 THEN 30 ELSE @SkillCount * 5 END);
    
    -- Count projects (max 5 projects = 50 points)
    SELECT @ProjectCount = COUNT(*)
    FROM Projects
    WHERE UserID = @UserID;
    
    SET @Score = @Score + (CASE WHEN @ProjectCount * 10 > 50 THEN 50 ELSE @ProjectCount * 10 END);
    
    RETURN @Score;
END;
GO

PRINT 'Function created: fn_CalculateProfileStrength';
GO

-- =============================================
-- FEATURE C: Stored Procedure - Get Full Portfolio as JSON
-- =============================================
-- Purpose: Return complete user portfolio in a single JSON object
-- Usage: EXEC sp_GetFullPortfolioJSON @UserID = 1;
-- =============================================
CREATE PROCEDURE sp_GetFullPortfolioJSON
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Return complete portfolio as JSON
    SELECT 
        u.UserID,
        u.FullName,
        u.Email,
        u.Bio,
        u.JoinDate,
        dbo.fn_CalculateProfileStrength(u.UserID) AS ProfileStrength,
        (
            SELECT 
                p.ProjectID,
                p.Title,
                p.Description,
                p.ProjectURL,
                p.DateCompleted
            FROM Projects p
            WHERE p.UserID = u.UserID
            FOR JSON PATH
        ) AS Projects,
        (
            SELECT 
                e.ExpID,
                e.JobTitle,
                e.Company,
                e.StartDate,
                e.EndDate
            FROM Experience e
            WHERE e.UserID = u.UserID
            ORDER BY e.StartDate DESC
            FOR JSON PATH
        ) AS Experience,
        (
            SELECT 
                us.UserSkillID,
                sd.SkillName,
                sd.Category,
                us.ProficiencyLevel
            FROM UserSkills us
            INNER JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID
            WHERE us.UserID = u.UserID
            ORDER BY us.ProficiencyLevel DESC
            FOR JSON PATH
        ) AS Skills
    FROM Users u
    WHERE u.UserID = @UserID
    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
END;
GO

PRINT 'Stored Procedure created: sp_GetFullPortfolioJSON';
GO

-- =============================================
-- FEATURE D: View - Admin Dashboard Statistics
-- =============================================
-- Purpose: Aggregate statistics for dashboard visualization
-- =============================================
CREATE VIEW vw_AdminDashboardStats
AS
SELECT 
    (SELECT COUNT(*) FROM Users) AS TotalUsers,
    (SELECT COUNT(*) FROM Projects) AS TotalProjects,
    (SELECT COUNT(*) FROM Experience) AS TotalExperiences,
    (SELECT COUNT(*) FROM UserSkills) AS TotalUserSkills,
    (
        SELECT TOP 1 sd.SkillName
        FROM UserSkills us
        INNER JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID
        GROUP BY sd.SkillName
        ORDER BY COUNT(*) DESC
    ) AS MostPopularSkill,
    (
        SELECT TOP 1 COUNT(*)
        FROM UserSkills us
        INNER JOIN SkillDefinitions sd ON us.SkillDefID = sd.SkillDefID
        GROUP BY sd.SkillName
        ORDER BY COUNT(*) DESC
    ) AS MostPopularSkillCount,
    CASE 
        WHEN (SELECT COUNT(*) FROM Users) > 0 
        THEN (SELECT COUNT(*) FROM Projects) * 1.0 / (SELECT COUNT(*) FROM Users)
        ELSE 0
    END AS AvgProjectsPerUser,
    CASE 
        WHEN (SELECT COUNT(*) FROM Users) > 0 
        THEN (SELECT COUNT(*) FROM UserSkills) * 1.0 / (SELECT COUNT(*) FROM Users)
        ELSE 0
    END AS AvgSkillsPerUser;
GO

PRINT 'View created: vw_AdminDashboardStats';
GO

-- =============================================
-- FEATURE E: Indexes - Performance Optimization
-- =============================================

-- Index 1: Non-clustered index on SkillName for autocomplete/search
CREATE NONCLUSTERED INDEX idx_SkillName
ON SkillDefinitions(SkillName);

PRINT 'Index created: idx_SkillName on SkillDefinitions';
GO

-- Index 2: Unique index on Email (already unique constraint, but explicit index)
CREATE UNIQUE NONCLUSTERED INDEX idx_UserEmail
ON Users(Email);

PRINT 'Index created: idx_UserEmail on Users';
GO

-- Additional performance indexes
CREATE NONCLUSTERED INDEX idx_UserSkills_UserID
ON UserSkills(UserID);

CREATE NONCLUSTERED INDEX idx_Projects_UserID
ON Projects(UserID);

CREATE NONCLUSTERED INDEX idx_Experience_UserID
ON Experience(UserID);

PRINT 'Additional indexes created for foreign key performance';
GO

-- =============================================
-- Success Message
-- =============================================
PRINT '==========================================';
PRINT 'All Advanced SQL Features Created Successfully!';
PRINT '==========================================';
PRINT 'Trigger: trg_ValidateExperienceDates';
PRINT 'Function: fn_CalculateProfileStrength';
PRINT 'Procedure: sp_GetFullPortfolioJSON';
PRINT 'View: vw_AdminDashboardStats';
PRINT 'Indexes: idx_SkillName, idx_UserEmail, and FK indexes';
PRINT '==========================================';
GO
