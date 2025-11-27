-- =============================================
-- Portfolio Generator Platform - Database Schema
-- Database: PortfolioDB
-- SQL Server 2019+
-- =============================================

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PortfolioDB')
BEGIN
    CREATE DATABASE PortfolioDB;
END
GO

USE PortfolioDB;
GO

-- =============================================
-- Drop existing tables (for clean re-runs)
-- =============================================
IF OBJECT_ID('UserSkills', 'U') IS NOT NULL DROP TABLE UserSkills;
IF OBJECT_ID('Experience', 'U') IS NOT NULL DROP TABLE Experience;
IF OBJECT_ID('Projects', 'U') IS NOT NULL DROP TABLE Projects;
IF OBJECT_ID('SkillDefinitions', 'U') IS NOT NULL DROP TABLE SkillDefinitions;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- =============================================
-- Table 1: Users (Identity)
-- =============================================
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Bio NVARCHAR(MAX) NULL,
    JoinDate DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CHK_Email CHECK (Email LIKE '%@%.%')
);
GO

-- =============================================
-- Table 2: SkillDefinitions (Lookup)
-- =============================================
CREATE TABLE SkillDefinitions (
    SkillDefID INT PRIMARY KEY IDENTITY(1,1),
    SkillName NVARCHAR(50) NOT NULL UNIQUE,
    Category NVARCHAR(50) NOT NULL,
    CONSTRAINT CHK_Category CHECK (Category IN ('Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Data Science', 'Cloud', 'Other'))
);
GO

-- =============================================
-- Table 3: UserSkills (Linking Table - Many-to-Many)
-- =============================================
CREATE TABLE UserSkills (
    UserSkillID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    SkillDefID INT NOT NULL,
    ProficiencyLevel INT NOT NULL,
    CONSTRAINT FK_UserSkills_Users FOREIGN KEY (UserID) 
        REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_UserSkills_SkillDefinitions FOREIGN KEY (SkillDefID) 
        REFERENCES SkillDefinitions(SkillDefID) ON DELETE CASCADE,
    CONSTRAINT CHK_ProficiencyLevel CHECK (ProficiencyLevel BETWEEN 1 AND 10),
    CONSTRAINT UQ_UserSkill UNIQUE (UserID, SkillDefID)
);
GO

-- =============================================
-- Table 4: Projects (One-to-Many)
-- =============================================
CREATE TABLE Projects (
    ProjectID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    ProjectURL NVARCHAR(255) NULL,
    DateCompleted DATE NULL,
    CONSTRAINT FK_Projects_Users FOREIGN KEY (UserID) 
        REFERENCES Users(UserID) ON DELETE CASCADE
);
GO

-- =============================================
-- Table 5: Experience (One-to-Many)
-- =============================================
CREATE TABLE Experience (
    ExpID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL,
    JobTitle NVARCHAR(100) NOT NULL,
    Company NVARCHAR(100) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NULL, -- NULL means 'Present'
    CONSTRAINT FK_Experience_Users FOREIGN KEY (UserID) 
        REFERENCES Users(UserID) ON DELETE CASCADE
);
GO

-- =============================================
-- Success Message
-- =============================================
PRINT 'Database schema created successfully!';
PRINT 'Tables created: Users, SkillDefinitions, UserSkills, Projects, Experience';
GO
