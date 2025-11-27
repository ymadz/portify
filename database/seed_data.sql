-- =============================================
-- Portfolio Generator Platform - Seed Data
-- Database: PortfolioDB
-- Target: 1,000+ Total Records
-- =============================================

USE PortfolioDB;
GO

PRINT 'Starting data seeding process...';
GO

-- =============================================
-- STEP 1: Insert 50 Standard IT Skills
-- =============================================
PRINT 'Inserting 50 skills...';

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

PRINT 'Skills inserted: 50';
GO

-- =============================================
-- STEP 2: Generate 200 Users
-- =============================================
PRINT 'Generating 200 users...';

DECLARE @i INT = 1;
DECLARE @FirstNames TABLE (Name NVARCHAR(50));
DECLARE @LastNames TABLE (Name NVARCHAR(50));

-- Sample first names
INSERT INTO @FirstNames VALUES 
('John'), ('Jane'), ('Michael'), ('Emily'), ('David'), ('Sarah'), ('James'), ('Emma'),
('Robert'), ('Olivia'), ('William'), ('Sophia'), ('Richard'), ('Isabella'), ('Thomas'), ('Mia'),
('Daniel'), ('Charlotte'), ('Matthew'), ('Amelia'), ('Christopher'), ('Harper'), ('Andrew'), ('Evelyn'),
('Joshua'), ('Abigail'), ('Ryan'), ('Elizabeth'), ('Nicholas'), ('Sofia'), ('Alexander'), ('Avery'),
('Kevin'), ('Ella'), ('Brian'), ('Scarlett'), ('Steven'), ('Grace'), ('Timothy'), ('Chloe');

-- Sample last names
INSERT INTO @LastNames VALUES 
('Smith'), ('Johnson'), ('Williams'), ('Brown'), ('Jones'), ('Garcia'), ('Miller'), ('Davis'),
('Rodriguez'), ('Martinez'), ('Hernandez'), ('Lopez'), ('Gonzalez'), ('Wilson'), ('Anderson'), ('Thomas'),
('Taylor'), ('Moore'), ('Jackson'), ('Martin'), ('Lee'), ('Perez'), ('Thompson'), ('White'),
('Harris'), ('Sanchez'), ('Clark'), ('Ramirez'), ('Lewis'), ('Robinson'), ('Walker'), ('Young'),
('Allen'), ('King'), ('Wright'), ('Scott'), ('Torres'), ('Nguyen'), ('Hill'), ('Flores');

-- Generate users with random names
WHILE @i <= 200
BEGIN
    DECLARE @FirstName NVARCHAR(50) = (SELECT TOP 1 Name FROM @FirstNames ORDER BY NEWID());
    DECLARE @LastName NVARCHAR(50) = (SELECT TOP 1 Name FROM @LastNames ORDER BY NEWID());
    DECLARE @Email NVARCHAR(100) = LOWER(@FirstName + '.' + @LastName + CAST(@i AS NVARCHAR(10)) + '@portfolio.dev');
    DECLARE @Bio NVARCHAR(MAX);
    
    -- 70% chance of having a bio
    IF (ABS(CHECKSUM(NEWID())) % 100) < 70
    BEGIN
        SET @Bio = 'Passionate ' + 
            CASE (ABS(CHECKSUM(NEWID())) % 5)
                WHEN 0 THEN 'software developer'
                WHEN 1 THEN 'full-stack engineer'
                WHEN 2 THEN 'web developer'
                WHEN 3 THEN 'backend specialist'
                ELSE 'frontend enthusiast'
            END + 
            ' with ' + CAST((ABS(CHECKSUM(NEWID())) % 10) + 1 AS NVARCHAR(5)) + 
            ' years of experience building modern applications.';
    END
    ELSE
    BEGIN
        SET @Bio = NULL;
    END
    
    INSERT INTO Users (FullName, Email, PasswordHash, Bio)
    VALUES (
        @FirstName + ' ' + @LastName,
        @Email,
        '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', -- Dummy bcrypt hash
        @Bio
    );
    
    SET @i = @i + 1;
END;

PRINT 'Users generated: 200';
GO

-- =============================================
-- STEP 3: Generate UserSkills (approx 5 per user = 1,000 records)
-- =============================================
PRINT 'Generating user skills (1000+ records)...';

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
        -- Random skill
        SET @SkillDefID = (ABS(CHECKSUM(NEWID())) % 50) + 1;
        
        -- Random proficiency (1-10)
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

DECLARE @UserSkillCount INT = (SELECT COUNT(*) FROM UserSkills);
PRINT 'UserSkills generated: ' + CAST(@UserSkillCount AS NVARCHAR(10));
GO

-- =============================================
-- STEP 4: Generate Projects (approx 3 per user = 600 records)
-- =============================================
PRINT 'Generating projects (600+ records)...';

DECLARE @UserID2 INT;
DECLARE @ProjectsPerUser INT;
DECLARE @ProjectTitles TABLE (Title NVARCHAR(100));

INSERT INTO @ProjectTitles VALUES
('E-Commerce Platform'), ('Social Media Dashboard'), ('Task Management App'), 
('Weather Forecast System'), ('Blog Publishing Platform'), ('Inventory Management'),
('Real-Time Chat Application'), ('Video Streaming Service'), ('Payment Gateway Integration'),
('CRM System'), ('Analytics Dashboard'), ('Mobile Banking App'), ('Fitness Tracker'),
('Recipe Sharing Platform'), ('Job Board Portal'), ('Online Learning Platform'),
('Hotel Booking System'), ('Restaurant POS System'), ('Healthcare Portal'), ('IoT Dashboard');

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
        DECLARE @Description NVARCHAR(MAX) = 'A comprehensive ' + @Title + ' built with modern technologies and best practices.';
        DECLARE @ProjectURL NVARCHAR(255) = 'https://github.com/user' + CAST(@UserID2 AS NVARCHAR(10)) + '/project' + CAST(@k AS NVARCHAR(5));
        DECLARE @DateCompleted DATE = DATEADD(DAY, -1 * (ABS(CHECKSUM(NEWID())) % 1095), GETDATE()); -- Random date within last 3 years
        
        INSERT INTO Projects (UserID, Title, Description, ProjectURL, DateCompleted)
        VALUES (@UserID2, @Title, @Description, @ProjectURL, @DateCompleted);
        
        SET @k = @k + 1;
    END
    
    FETCH NEXT FROM user_cursor2 INTO @UserID2;
END;

CLOSE user_cursor2;
DEALLOCATE user_cursor2;

DECLARE @ProjectCount INT = (SELECT COUNT(*) FROM Projects);
PRINT 'Projects generated: ' + CAST(@ProjectCount AS NVARCHAR(10));
GO

-- =============================================
-- STEP 5: Generate Experience (approx 2 per user = 400 records)
-- =============================================
PRINT 'Generating experience records (400+ records)...';

DECLARE @UserID3 INT;
DECLARE @ExperiencesPerUser INT;
DECLARE @JobTitles TABLE (Title NVARCHAR(100));
DECLARE @Companies TABLE (Name NVARCHAR(100));

INSERT INTO @JobTitles VALUES
('Software Engineer'), ('Senior Developer'), ('Full Stack Developer'), ('Frontend Developer'),
('Backend Developer'), ('DevOps Engineer'), ('Data Engineer'), ('Mobile Developer'),
('Technical Lead'), ('Software Architect'), ('QA Engineer'), ('UI/UX Designer'),
('Product Manager'), ('Scrum Master'), ('Cloud Engineer'), ('Database Administrator');

INSERT INTO @Companies VALUES
('TechCorp Inc'), ('Innovation Labs'), ('Digital Solutions'), ('CodeCraft Systems'),
('CloudNine Technologies'), ('DataDriven Co'), ('WebWorks Agency'), ('AppDev Studios'),
('Enterprise Systems'), ('StartupHub'), ('Global Tech'), ('NextGen Solutions'),
('Pixel Perfect Design'), ('Agile Innovations'), ('Quantum Software'), ('Cyber Solutions');

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
        DECLARE @DaysAgo INT = (ABS(CHECKSUM(NEWID())) % 1825) + (@m * 365); -- Stagger dates
        DECLARE @StartDate DATE = DATEADD(DAY, -@DaysAgo, @CurrentDate);
        DECLARE @EndDate DATE;
        
        -- 30% chance of current position (EndDate = NULL)
        IF @m = 0 AND (ABS(CHECKSUM(NEWID())) % 100) < 30
        BEGIN
            SET @EndDate = NULL;
        END
        ELSE
        BEGIN
            -- Random duration between 180 days to 1095 days (6 months to 3 years)
            DECLARE @Duration INT = (ABS(CHECKSUM(NEWID())) % 915) + 180;
            SET @EndDate = DATEADD(DAY, @Duration, @StartDate);
            
            -- Make sure EndDate is not in the future
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

DECLARE @ExperienceCount INT = (SELECT COUNT(*) FROM Experience);
PRINT 'Experience records generated: ' + CAST(@ExperienceCount AS NVARCHAR(10));
GO

-- =============================================
-- Summary Statistics
-- =============================================
PRINT '==========================================';
PRINT 'DATA SEEDING COMPLETED SUCCESSFULLY!';
PRINT '==========================================';

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
SELECT 'TOTAL', 
    (SELECT COUNT(*) FROM Users) + 
    (SELECT COUNT(*) FROM SkillDefinitions) + 
    (SELECT COUNT(*) FROM UserSkills) + 
    (SELECT COUNT(*) FROM Projects) + 
    (SELECT COUNT(*) FROM Experience);

PRINT '==========================================';
GO
