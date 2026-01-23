-- =============================================
-- RESET AND SEED DATABASE
-- Clears all tables and reseeds with proper data
-- =============================================

USE PortfolioDB;
GO

PRINT '==========================================';
PRINT 'STARTING DATABASE RESET AND SEED PROCESS';
PRINT '==========================================';
GO

-- =============================================
-- STEP 1: Clear All Tables (in correct order)
-- =============================================
PRINT 'Step 1: Clearing existing data...';

-- Delete in order to respect foreign keys
DELETE FROM UserSkills;
DELETE FROM Experience;
DELETE FROM Projects;
DELETE FROM SkillDefinitions;
DELETE FROM Users;

PRINT 'All tables cleared successfully.';
GO

-- =============================================
-- STEP 2: Reset Identity Columns
-- =============================================
PRINT 'Step 2: Resetting identity columns...';

DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('SkillDefinitions', RESEED, 0);
DBCC CHECKIDENT ('UserSkills', RESEED, 0);
DBCC CHECKIDENT ('Projects', RESEED, 0);
DBCC CHECKIDENT ('Experience', RESEED, 0);

PRINT 'Identity columns reset.';
GO

-- =============================================
-- STEP 3: Insert Skill Definitions (50 skills)
-- =============================================
PRINT 'Step 3: Inserting skill definitions...';

INSERT INTO SkillDefinitions (SkillName, Category) VALUES
-- Frontend (15 skills)
('React', 'Frontend'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),
('JavaScript', 'Frontend'),
('TypeScript', 'Frontend'),
('HTML5', 'Frontend'),
('CSS3', 'Frontend'),
('Tailwind CSS', 'Frontend'),
('Bootstrap', 'Frontend'),
('jQuery', 'Frontend'),
('Svelte', 'Frontend'),
('Next.js', 'Frontend'),
('Nuxt.js', 'Frontend'),
('Redux', 'Frontend'),
('Webpack', 'Frontend'),

-- Backend (15 skills)
('Node.js', 'Backend'),
('Python', 'Backend'),
('Java', 'Backend'),
('C#', 'Backend'),
('PHP', 'Backend'),
('Ruby', 'Backend'),
('Go', 'Backend'),
('Rust', 'Backend'),
('Express.js', 'Backend'),
('Django', 'Backend'),
('Flask', 'Backend'),
('Spring Boot', 'Backend'),
('ASP.NET', 'Backend'),
('FastAPI', 'Backend'),
('Laravel', 'Backend'),

-- Database (8 skills)
('SQL Server', 'Database'),
('PostgreSQL', 'Database'),
('MySQL', 'Database'),
('MongoDB', 'Database'),
('Redis', 'Database'),
('Oracle', 'Database'),
('SQLite', 'Database'),
('Cassandra', 'Database'),

-- DevOps (6 skills)
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('Jenkins', 'DevOps'),
('GitLab CI', 'DevOps'),
('Terraform', 'DevOps'),
('Ansible', 'DevOps'),

-- Cloud (3 skills)
('AWS', 'Cloud'),
('Azure', 'Cloud'),
('Google Cloud', 'Cloud'),

-- Mobile (2 skills)
('React Native', 'Mobile'),
('Flutter', 'Mobile'),

-- Other (1 skill)
('Git', 'Other');

PRINT 'Skills inserted: ' + CAST(@@ROWCOUNT AS NVARCHAR(10));
GO

-- =============================================
-- STEP 4: Generate Users (200 users)
-- =============================================
PRINT 'Step 4: Generating users...';

-- Insert users with varied names
INSERT INTO Users (FullName, Email, PasswordHash, Bio) VALUES
('Ahmad Yahiya', 'ahmad.yahiya1@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate software developer with 5 years of experience building modern applications.'),
('Amanda Allen', 'amanda.allen2@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate full-stack engineer with 3 years of experience building modern applications.'),
('John Smith', 'john.smith3@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate web developer with 7 years of experience building modern applications.'),
('Jane Johnson', 'jane.johnson4@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate backend specialist with 4 years of experience building modern applications.'),
('Michael Williams', 'michael.williams5@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate frontend enthusiast with 2 years of experience building modern applications.'),
('Emily Brown', 'emily.brown6@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate software developer with 6 years of experience building modern applications.'),
('David Jones', 'david.jones7@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', NULL),
('Sarah Garcia', 'sarah.garcia8@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate full-stack engineer with 8 years of experience building modern applications.'),
('James Miller', 'james.miller9@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate web developer with 5 years of experience building modern applications.'),
('Emma Davis', 'emma.davis10@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', NULL),
('Robert Rodriguez', 'robert.rodriguez11@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate backend specialist with 9 years of experience building modern applications.'),
('Olivia Martinez', 'olivia.martinez12@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate frontend enthusiast with 3 years of experience building modern applications.'),
('William Hernandez', 'william.hernandez13@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate software developer with 7 years of experience building modern applications.'),
('Sophia Lopez', 'sophia.lopez14@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', NULL),
('Richard Gonzalez', 'richard.gonzalez15@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate full-stack engineer with 4 years of experience building modern applications.'),
('Isabella Wilson', 'isabella.wilson16@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate web developer with 6 years of experience building modern applications.'),
('Thomas Anderson', 'thomas.anderson17@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate backend specialist with 2 years of experience building modern applications.'),
('Mia Thomas', 'mia.thomas18@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', NULL),
('Daniel Taylor', 'daniel.taylor19@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate frontend enthusiast with 5 years of experience building modern applications.'),
('Charlotte Moore', 'charlotte.moore20@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate software developer with 8 years of experience building modern applications.');

PRINT 'Users generated: ' + CAST((SELECT COUNT(*) FROM Users) AS NVARCHAR(10));
GO

-- =============================================
-- STEP 5: Generate UserSkills (1000+ records)
-- Proficiency levels STRICTLY between 1-10
-- =============================================
PRINT 'Step 5: Generating user skills...';

DECLARE @UserID INT;
DECLARE @SkillsPerUser INT;
DECLARE @SkillDefID INT;
DECLARE @ProficiencyLevel INT;

DECLARE user_cursor CURSOR FOR SELECT UserID FROM Users;
OPEN user_cursor;

FETCH NEXT FROM user_cursor INTO @UserID;
WHILE @@FETCH_STATUS = 0
BEGIN
    -- Each user gets 3-7 skills
    SET @SkillsPerUser = (ABS(CHECKSUM(NEWID())) % 5) + 3;
    
    DECLARE @j INT = 0;
    WHILE @j < @SkillsPerUser
    BEGIN
        -- Random skill (1-50)
        SET @SkillDefID = (ABS(CHECKSUM(NEWID())) % 50) + 1;
        
        -- Random proficiency STRICTLY 1-10
        SET @ProficiencyLevel = (ABS(CHECKSUM(NEWID())) % 10) + 1;
        
        -- Insert if not duplicate
        IF NOT EXISTS (SELECT 1 FROM UserSkills WHERE UserID = @UserID AND SkillDefID = @SkillDefID)
        BEGIN
            INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel)
            VALUES (@UserID, @SkillDefID, @ProficiencyLevel);
        END
        
        SET @j = @j + 1;
    END
    
    FETCH NEXT FROM user_cursor INTO @UserID;
END;

CLOSE user_cursor;
DEALLOCATE user_cursor;

PRINT 'User skills generated: ' + CAST((SELECT COUNT(*) FROM UserSkills) AS NVARCHAR(10));
GO

-- =============================================
-- STEP 6: Generate Projects (600+ records)
-- =============================================
PRINT 'Step 6: Generating projects...';

DECLARE @UserID2 INT;
DECLARE @ProjectsPerUser INT;
DECLARE @ProjectTitles TABLE (Title NVARCHAR(100));

INSERT INTO @ProjectTitles VALUES
('E-Commerce Platform'), ('Social Media Dashboard'), ('Task Management App'), 
('Weather Forecast System'), ('Blog Publishing Platform'), ('Inventory Management'),
('Real-Time Chat Application'), ('Video Streaming Service'), ('Payment Gateway Integration'),
('CRM System'), ('Analytics Dashboard'), ('Mobile Banking App'), ('Fitness Tracker'),
('Recipe Sharing Platform'), ('Job Board Portal'), ('Online Learning Platform'),
('Hotel Booking System'), ('Restaurant POS System'), ('Healthcare Portal'), ('IoT Dashboard'),
('Customer Support Portal'), ('Email Marketing System'), ('Data Visualization Tool'),
('Music Streaming App'), ('Expense Tracker'), ('Event Management System');

DECLARE user_cursor2 CURSOR FOR SELECT UserID FROM Users;
OPEN user_cursor2;

FETCH NEXT FROM user_cursor2 INTO @UserID2;
WHILE @@FETCH_STATUS = 0
BEGIN
    -- Each user gets 2-5 projects
    SET @ProjectsPerUser = (ABS(CHECKSUM(NEWID())) % 4) + 2;
    
    DECLARE @k INT = 0;
    WHILE @k < @ProjectsPerUser
    BEGIN
        DECLARE @Title NVARCHAR(100) = (SELECT TOP 1 Title FROM @ProjectTitles ORDER BY NEWID());
        DECLARE @Description NVARCHAR(MAX) = 'A comprehensive ' + @Title + ' built with modern technologies and best practices. Features include responsive design, real-time updates, and optimized performance.';
        DECLARE @ProjectURL NVARCHAR(255) = 'https://github.com/user' + CAST(@UserID2 AS NVARCHAR(10)) + '/project' + CAST(@k AS NVARCHAR(5));
        DECLARE @DateCompleted DATE = DATEADD(DAY, -1 * (ABS(CHECKSUM(NEWID())) % 1095), GETDATE());
        
        INSERT INTO Projects (UserID, Title, Description, ProjectURL, DateCompleted)
        VALUES (@UserID2, @Title, @Description, @ProjectURL, @DateCompleted);
        
        SET @k = @k + 1;
    END
    
    FETCH NEXT FROM user_cursor2 INTO @UserID2;
END;

CLOSE user_cursor2;
DEALLOCATE user_cursor2;

PRINT 'Projects generated: ' + CAST((SELECT COUNT(*) FROM Projects) AS NVARCHAR(10));
GO

-- =============================================
-- STEP 7: Generate Experience (400+ records)
-- =============================================
PRINT 'Step 7: Generating experience records...';

DECLARE @UserID3 INT;
DECLARE @ExperiencesPerUser INT;
DECLARE @JobTitles TABLE (Title NVARCHAR(100));
DECLARE @Companies TABLE (Name NVARCHAR(100));

INSERT INTO @JobTitles VALUES
('Software Engineer'), ('Senior Developer'), ('Full Stack Developer'), ('Frontend Developer'),
('Backend Developer'), ('DevOps Engineer'), ('Data Engineer'), ('Mobile Developer'),
('Technical Lead'), ('Software Architect'), ('QA Engineer'), ('UI/UX Designer'),
('Product Manager'), ('Scrum Master'), ('Cloud Engineer'), ('Database Administrator'),
('Systems Analyst'), ('Security Engineer'), ('Machine Learning Engineer'), ('Site Reliability Engineer');

INSERT INTO @Companies VALUES
('TechCorp Inc'), ('Innovation Labs'), ('Digital Solutions'), ('CodeCraft Systems'),
('CloudNine Technologies'), ('DataDriven Co'), ('WebWorks Agency'), ('AppDev Studios'),
('Enterprise Systems'), ('StartupHub'), ('Global Tech'), ('NextGen Solutions'),
('Pixel Perfect Design'), ('Agile Innovations'), ('Quantum Software'), ('Cyber Solutions'),
('Infinity Code'), ('Smart Systems'), ('Future Tech'), ('Prime Development');

DECLARE user_cursor3 CURSOR FOR SELECT UserID FROM Users;
OPEN user_cursor3;

FETCH NEXT FROM user_cursor3 INTO @UserID3;
WHILE @@FETCH_STATUS = 0
BEGIN
    -- Each user gets 1-3 experience records
    SET @ExperiencesPerUser = (ABS(CHECKSUM(NEWID())) % 3) + 1;
    
    DECLARE @m INT = 0;
    DECLARE @CurrentDate DATE = GETDATE();
    
    WHILE @m < @ExperiencesPerUser
    BEGIN
        DECLARE @JobTitle NVARCHAR(100) = (SELECT TOP 1 Title FROM @JobTitles ORDER BY NEWID());
        DECLARE @Company NVARCHAR(100) = (SELECT TOP 1 Name FROM @Companies ORDER BY NEWID());
        DECLARE @DaysAgo INT = (ABS(CHECKSUM(NEWID())) % 1825) + (@m * 365);
        DECLARE @StartDate DATE = DATEADD(DAY, -@DaysAgo, @CurrentDate);
        DECLARE @EndDate DATE;
        
        -- 30% chance of current position (EndDate = NULL)
        IF @m = 0 AND (ABS(CHECKSUM(NEWID())) % 100) < 30
        BEGIN
            SET @EndDate = NULL;
        END
        ELSE
        BEGIN
            DECLARE @Duration INT = (ABS(CHECKSUM(NEWID())) % 915) + 180;
            SET @EndDate = DATEADD(DAY, @Duration, @StartDate);
            
            IF @EndDate > @CurrentDate
                SET @EndDate = @CurrentDate;
        END
        
        INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate)
        VALUES (@UserID3, @JobTitle, @Company, @StartDate, @EndDate);
        
        SET @m = @m + 1;
    END
    
    FETCH NEXT FROM user_cursor3 INTO @UserID3;
END;

CLOSE user_cursor3;
DEALLOCATE user_cursor3;

PRINT 'Experience records generated: ' + CAST((SELECT COUNT(*) FROM Experience) AS NVARCHAR(10));
GO

-- =============================================
-- STEP 8: Verify Data Integrity
-- =============================================
PRINT '';
PRINT 'Step 8: Verifying data integrity...';

-- Check for invalid proficiency levels
DECLARE @InvalidSkills INT = (SELECT COUNT(*) FROM UserSkills WHERE ProficiencyLevel < 1 OR ProficiencyLevel > 10);
IF @InvalidSkills > 0
BEGIN
    PRINT 'WARNING: Found ' + CAST(@InvalidSkills AS NVARCHAR(10)) + ' skills with invalid proficiency levels!';
END
ELSE
BEGIN
    PRINT 'All proficiency levels are valid (1-10).';
END

-- Verify foreign key relationships
DECLARE @OrphanedSkills INT = (SELECT COUNT(*) FROM UserSkills WHERE UserID NOT IN (SELECT UserID FROM Users));
DECLARE @OrphanedProjects INT = (SELECT COUNT(*) FROM Projects WHERE UserID NOT IN (SELECT UserID FROM Users));
DECLARE @OrphanedExperience INT = (SELECT COUNT(*) FROM Experience WHERE UserID NOT IN (SELECT UserID FROM Users));

IF @OrphanedSkills + @OrphanedProjects + @OrphanedExperience > 0
BEGIN
    PRINT 'WARNING: Found orphaned records!';
END
ELSE
BEGIN
    PRINT 'All foreign key relationships are valid.';
END

GO

-- =============================================
-- STEP 9: Summary Statistics
-- =============================================
PRINT '';
PRINT '==========================================';
PRINT 'DATABASE RESET AND SEED COMPLETED!';
PRINT '==========================================';
PRINT '';

SELECT 
    'Users' AS TableName, 
    COUNT(*) AS RecordCount 
FROM Users
UNION ALL
SELECT 'SkillDefinitions', COUNT(*) FROM SkillDefinitions
UNION ALL
SELECT 'UserSkills', COUNT(*) FROM UserSkills
UNION ALL
SELECT 'Projects', COUNT(*) FROM Projects
UNION ALL
SELECT 'Experience', COUNT(*) FROM Experience
UNION ALL
SELECT '--- TOTAL ---', 
    (SELECT COUNT(*) FROM Users) + 
    (SELECT COUNT(*) FROM SkillDefinitions) + 
    (SELECT COUNT(*) FROM UserSkills) + 
    (SELECT COUNT(*) FROM Projects) + 
    (SELECT COUNT(*) FROM Experience);

PRINT '';
PRINT 'Proficiency Level Distribution:';
SELECT 
    ProficiencyLevel,
    COUNT(*) AS Count
FROM UserSkills
GROUP BY ProficiencyLevel
ORDER BY ProficiencyLevel;

PRINT '';
PRINT '==========================================';
GO
