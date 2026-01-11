-- SQL Seeding Script for PortfolioDB
-- Run this in SQL Server Management Studio or Azure Data Studio

-- 1. Seed Skills (Basic Set)
INSERT INTO SkillDefinitions (SkillName, Category)
VALUES 
('JavaScript', 'Language'), ('Python', 'Language'), ('Java', 'Language'), ('C#', 'Language'), ('C++', 'Language'),
('React', 'Frontend'), ('Angular', 'Frontend'), ('Vue', 'Frontend'), ('Svelte', 'Frontend'), ('Next.js', 'Frontend'),
('Node.js', 'Backend'), ('Django', 'Backend'), ('Spring Boot', 'Backend'), ('Express', 'Backend'), ('ASP.NET', 'Backend'),
('SQL Server', 'Database'), ('PostgreSQL', 'Database'), ('MongoDB', 'Database'), ('Redis', 'Database'), ('MySQL', 'Database'),
('Docker', 'DevOps'), ('Kubernetes', 'DevOps'), ('AWS', 'DevOps'), ('Azure', 'DevOps'), ('Git', 'Tool');

-- 2. Seed Users (Example batch - generating 1000+ requires a loop or external tool, here is a breakdown)
-- Note: Password hash is for 'password123'
DECLARE @i INT = 0;
WHILE @i < 1000
BEGIN
    INSERT INTO Users (FullName, Email, PasswordHash, Bio, JoinDate, Role)
    VALUES (
        'User ' + CAST(@i AS VARCHAR), 
        'user' + CAST(@i AS VARCHAR) + '@example.com', 
        '$2a$10$wI./.w./.w./.w./.w./.w./.w./.w./.w./', -- Placeholder hash
        'Generated user', 
        GETDATE(), 
        'user'
    );
    SET @i = @i + 1;
END

-- 3. Seed Projects
-- Assign projects to random users
INSERT INTO Projects (UserID, Title, Description, ProjectURL, DateCompleted)
SELECT TOP 1000 
    UserID,
    'Project ' + CAST(ABS(CHECKSUM(NEWID())) % 100 AS VARCHAR),
    'A sample project description.',
    'https://github.com/example/project',
    GETDATE()
FROM Users
ORDER BY NEWID();

-- 4. Seed Experience
INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate)
SELECT TOP 1000
    UserID,
    'Software Engineer',
    'Tech Corp',
    DATEADD(year, -2, GETDATE()),
    GETDATE()
FROM Users
ORDER BY NEWID();

-- 5. Seed User Skills
INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel)
SELECT TOP 2000
    u.UserID,
    s.SkillDefID,
    ABS(CHECKSUM(NEWID())) % 80 + 20 -- Random 20-100
FROM Users u
CROSS JOIN SkillDefinitions s
ORDER BY NEWID();
