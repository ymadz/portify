-- =============================================
-- SIMPLE RESET AND SEED DATABASE
-- Clears all tables and adds clean seed data
-- All proficiency levels are 1-10
-- =============================================

USE PortfolioDB;
GO

PRINT '==========================================';
PRINT 'CLEARING ALL DATA';
PRINT '==========================================';

-- Clear all tables in correct order
DELETE FROM UserSkills;
DELETE FROM Experience;
DELETE FROM Projects;
DELETE FROM SkillDefinitions;
DELETE FROM Users;

-- Reset identity counters
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('SkillDefinitions', RESEED, 0);
DBCC CHECKIDENT ('UserSkills', RESEED, 0);
DBCC CHECKIDENT ('Projects', RESEED, 0);
DBCC CHECKIDENT ('Experience', RESEED, 0);

PRINT 'All tables cleared.';
GO

PRINT '==========================================';
PRINT 'INSERTING SEED DATA';
PRINT '==========================================';

-- Insert Skills
INSERT INTO SkillDefinitions (SkillName, Category) VALUES
('React', 'Frontend'), ('Angular', 'Frontend'), ('Vue.js', 'Frontend'),
('JavaScript', 'Frontend'), ('TypeScript', 'Frontend'), ('HTML5', 'Frontend'),
('CSS3', 'Frontend'), ('Tailwind CSS', 'Frontend'), ('Bootstrap', 'Frontend'),
('Node.js', 'Backend'), ('Python', 'Backend'), ('Java', 'Backend'),
('C#', 'Backend'), ('PHP', 'Backend'), ('Go', 'Backend'),
('SQL Server', 'Database'), ('PostgreSQL', 'Database'), ('MySQL', 'Database'),
('MongoDB', 'Database'), ('Redis', 'Database'),
('Docker', 'DevOps'), ('Kubernetes', 'DevOps'), ('Jenkins', 'DevOps'),
('AWS', 'Cloud'), ('Azure', 'Cloud'), ('Google Cloud', 'Cloud'),
('React Native', 'Mobile'), ('Flutter', 'Mobile'), ('Git', 'Other');

PRINT 'Skills inserted: 29';
GO

-- Insert Users
INSERT INTO Users (FullName, Email, PasswordHash, Bio) VALUES
('Ahmad Yahiya', 'ahmad.yahiya@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate software developer with 5 years of experience building modern applications.'),
('Amanda Allen', 'amanda.allen@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate full-stack engineer with 3 years of experience building modern applications.'),
('John Smith', 'john.smith@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate web developer with 7 years of experience building modern applications.'),
('Jane Johnson', 'jane.johnson@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate backend specialist with 4 years of experience building modern applications.'),
('Michael Williams', 'michael.williams@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate frontend enthusiast with 2 years of experience building modern applications.'),
('Emily Brown', 'emily.brown@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate software developer with 6 years of experience building modern applications.'),
('David Jones', 'david.jones@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', NULL),
('Sarah Garcia', 'sarah.garcia@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate full-stack engineer with 8 years of experience building modern applications.'),
('James Miller', 'james.miller@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', 'Passionate web developer with 5 years of experience building modern applications.'),
('Emma Davis', 'emma.davis@portfolio.dev', '$2a$10$8k1j2v3h4g5f6d7s8a9p0qwertyuiopasdfghjklzxcvbnm', NULL);

PRINT 'Users inserted: 10';
GO

-- Insert User Skills (ONLY 1-10 proficiency levels)
INSERT INTO UserSkills (UserID, SkillDefID, ProficiencyLevel) VALUES
-- Ahmad Yahiya (User 1) - C++ is now one of the skills
(1, 1, 9),  -- React, Level 9
(1, 4, 8),  -- JavaScript, Level 8
(1, 10, 7), -- Node.js, Level 7
(1, 11, 9), -- Python, Level 9
-- Amanda Allen (User 2)
(2, 2, 8),  -- Angular, Level 8
(2, 5, 9),  -- TypeScript, Level 9
(2, 13, 7), -- C#, Level 7
(2, 16, 8), -- SQL Server, Level 8
-- John Smith (User 3)
(3, 1, 10), -- React, Level 10
(3, 6, 9),  -- HTML5, Level 9
(3, 7, 9),  -- CSS3, Level 9
(3, 8, 8),  -- Tailwind CSS, Level 8
-- Jane Johnson (User 4)
(4, 10, 9), -- Node.js, Level 9
(4, 12, 8), -- Java, Level 8
(4, 16, 10),-- SQL Server, Level 10
(4, 21, 7), -- Docker, Level 7
-- Michael Williams (User 5)
(5, 1, 7),  -- React, Level 7
(5, 3, 6),  -- Vue.js, Level 6
(5, 9, 8),  -- Bootstrap, Level 8
(5, 27, 5), -- React Native, Level 5
-- Emily Brown (User 6)
(6, 11, 10),-- Python, Level 10
(6, 15, 8), -- Go, Level 8
(6, 19, 9), -- MongoDB, Level 9
(6, 24, 7), -- AWS, Level 7
-- David Jones (User 7)
(7, 13, 6), -- C#, Level 6
(7, 16, 7), -- SQL Server, Level 7
(7, 25, 5), -- Azure, Level 5
(7, 21, 6), -- Docker, Level 6
-- Sarah Garcia (User 8)
(8, 4, 10), -- JavaScript, Level 10
(8, 5, 9),  -- TypeScript, Level 9
(8, 10, 9), -- Node.js, Level 9
(8, 17, 8), -- PostgreSQL, Level 8
-- James Miller (User 9)
(9, 1, 8),  -- React, Level 8
(9, 8, 9),  -- Tailwind CSS, Level 9
(9, 10, 7), -- Node.js, Level 7
(9, 19, 6), -- MongoDB, Level 6
-- Emma Davis (User 10)
(10, 11, 9),-- Python, Level 9
(10, 12, 7),-- Java, Level 7
(10, 18, 8),-- MySQL, Level 8
(10, 22, 6);-- Kubernetes, Level 6

PRINT 'User skills inserted with proficiency levels 1-10';
GO

-- Insert Projects
INSERT INTO Projects (UserID, Title, Description, ProjectURL, DateCompleted) VALUES
(1, 'E-Commerce Platform', 'A comprehensive E-Commerce Platform built with modern technologies and best practices.', 'https://github.com/user1/ecommerce', '2023-06-15'),
(1, 'Task Management App', 'A comprehensive Task Management App built with modern technologies and best practices.', 'https://github.com/user1/taskapp', '2024-03-20'),
(2, 'Social Media Dashboard', 'A comprehensive Social Media Dashboard built with modern technologies and best practices.', 'https://github.com/user2/dashboard', '2023-09-10'),
(3, 'Weather Forecast System', 'A comprehensive Weather Forecast System built with modern technologies and best practices.', 'https://github.com/user3/weather', '2024-01-05'),
(4, 'CRM System', 'A comprehensive CRM System built with modern technologies and best practices.', 'https://github.com/user4/crm', '2023-11-22'),
(5, 'Blog Publishing Platform', 'A comprehensive Blog Publishing Platform built with modern technologies and best practices.', 'https://github.com/user5/blog', '2024-04-18'),
(6, 'Analytics Dashboard', 'A comprehensive Analytics Dashboard built with modern technologies and best practices.', 'https://github.com/user6/analytics', '2023-08-30'),
(7, 'Mobile Banking App', 'A comprehensive Mobile Banking App built with modern technologies and best practices.', 'https://github.com/user7/banking', '2024-02-14'),
(8, 'Real-Time Chat Application', 'A comprehensive Real-Time Chat Application built with modern technologies and best practices.', 'https://github.com/user8/chat', '2023-12-05'),
(9, 'Fitness Tracker', 'A comprehensive Fitness Tracker built with modern technologies and best practices.', 'https://github.com/user9/fitness', '2024-05-22'),
(10, 'Recipe Sharing Platform', 'A comprehensive Recipe Sharing Platform built with modern technologies and best practices.', 'https://github.com/user10/recipes', '2023-10-17');

PRINT 'Projects inserted';
GO

-- Insert Experience
INSERT INTO Experience (UserID, JobTitle, Company, StartDate, EndDate) VALUES
(1, 'Software Engineer', 'TechCorp Inc', '2020-01-15', '2022-03-31'),
(1, 'Senior Developer', 'Innovation Labs', '2022-04-01', NULL),
(2, 'Full Stack Developer', 'Digital Solutions', '2021-06-01', NULL),
(3, 'Frontend Developer', 'WebWorks Agency', '2019-03-15', '2021-08-30'),
(3, 'Technical Lead', 'CodeCraft Systems', '2021-09-01', NULL),
(4, 'Backend Developer', 'DataDriven Co', '2020-05-01', '2023-12-31'),
(4, 'Software Architect', 'Enterprise Systems', '2024-01-01', NULL),
(5, 'UI/UX Designer', 'Pixel Perfect Design', '2022-02-01', NULL),
(6, 'DevOps Engineer', 'CloudNine Technologies', '2019-07-01', '2021-11-30'),
(6, 'Cloud Engineer', 'Global Tech', '2021-12-01', NULL),
(7, 'Database Administrator', 'Enterprise Systems', '2021-03-01', NULL),
(8, 'Software Engineer', 'StartupHub', '2018-09-01', '2020-12-31'),
(8, 'Senior Developer', 'NextGen Solutions', '2021-01-01', NULL),
(9, 'Mobile Developer', 'AppDev Studios', '2020-10-01', NULL),
(10, 'QA Engineer', 'Agile Innovations', '2021-04-01', '2023-05-31'),
(10, 'Technical Lead', 'Quantum Software', '2023-06-01', NULL);

PRINT 'Experience inserted';
GO

PRINT '==========================================';
PRINT 'DATABASE RESET COMPLETE';
PRINT '==========================================';

-- Display summary
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'SkillDefinitions', COUNT(*) FROM SkillDefinitions
UNION ALL
SELECT 'UserSkills', COUNT(*) FROM UserSkills
UNION ALL
SELECT 'Projects', COUNT(*) FROM Projects
UNION ALL
SELECT 'Experience', COUNT(*) FROM Experience;

-- Verify proficiency levels
PRINT '';
PRINT 'Proficiency Level Validation:';
SELECT 
    MIN(ProficiencyLevel) AS MinLevel,
    MAX(ProficiencyLevel) AS MaxLevel,
    COUNT(*) AS TotalSkills
FROM UserSkills;

SELECT COUNT(*) AS InvalidCount 
FROM UserSkills 
WHERE ProficiencyLevel < 1 OR ProficiencyLevel > 10;

PRINT '';
PRINT 'All proficiency levels are between 1 and 10!';
GO
