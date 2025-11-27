Here is the complete, comprehensive system specification tailored for the **Next.js + SQL Server** stack. You can copy this entire block, save it as `system_instructions.md`, and upload it to your AI coding assistant (Cursor, Windsurf, Replit, etc.).

***

# System Specification: Portfolio Generator Platform

## 1. Project Context & Objective
**Role:** Senior Full Stack Engineer & Database Architect.
**Goal:** Build a "Portfolio Generator Platform" where users manage professional profiles (Skills, Projects, Experience) and generate a shareable portfolio.
**Primary Constraint:** This is an **Advanced Database Systems** project. The priority is demonstrating mastery of **Microsoft SQL Server (T-SQL)** features. The application code (Next.js) must serve as a wrapper to showcase the database logic.

## 2. Technology Stack
* **Database:** Microsoft SQL Server 2019 (or latest).
* **Frontend framework:** Next.js 14+ (App Router).
* **Styling:** Tailwind CSS.
* **Database Driver:** `mssql` (Node.js package).
    * *Important:* Do **NOT** use an ORM like Prisma or Drizzle for data logic. Use raw SQL execution (`pool.request().execute(...)` or `query(...)`) to ensure Stored Procedures and Views are utilized explicitly.
* **Charts:** Recharts (for the Dashboard).

## 3. Database Schema (Normalized 3NF)
The database must be named `PortfolioDB`. Create the following 5 tables:

### 1. `Users` (Identity)
* `UserID` (INT, PK, Identity)
* `FullName` (NVARCHAR(100))
* `Email` (NVARCHAR(100), Unique)
* `PasswordHash` (NVARCHAR(255))
* `Bio` (NVARCHAR(MAX))
* `JoinDate` (DATETIME, Default GETDATE())

### 2. `SkillDefinitions` (Lookup)
* `SkillDefID` (INT, PK, Identity)
* `SkillName` (NVARCHAR(50)) -- *e.g., 'React', 'Python'*
* `Category` (NVARCHAR(50)) -- *e.g., 'Frontend', 'Backend'*

### 3. `UserSkills` (Linking Table)
* `UserSkillID` (INT, PK, Identity)
* `UserID` (INT, FK -> Users.UserID)
* `SkillDefID` (INT, FK -> SkillDefinitions.SkillDefID)
* `ProficiencyLevel` (INT) -- *Range 1-10*

### 4. `Projects` (One-to-Many)
* `ProjectID` (INT, PK, Identity)
* `UserID` (INT, FK -> Users.UserID)
* `Title` (NVARCHAR(100))
* `Description` (NVARCHAR(MAX))
* `ProjectURL` (NVARCHAR(255))
* `DateCompleted` (DATE)

### 5. `Experience` (One-to-Many)
* `ExpID` (INT, PK, Identity)
* `UserID` (INT, FK -> Users.UserID)
* `JobTitle` (NVARCHAR(100))
* `Company` (NVARCHAR(100))
* `StartDate` (DATE)
* `EndDate` (DATE, Nullable) -- *Null = 'Present'*

## 4. Mandatory Advanced SQL Features
**Strict Requirement:** The application must rely on these database objects for logic, not JavaScript arrays.

### A. Trigger: `trg_ValidateExperienceDates`
* **Logic:** On `INSERT` or `UPDATE` to the `Experience` table, check if `EndDate` is not null. If `EndDate` < `StartDate`, `ROLLBACK TRANSACTION` and `THROW` an error ("End Date cannot be before Start Date").

### B. Stored Function: `fn_CalculateProfileStrength(@UserID)`
* **Logic:** Returns an INT (0-100).
    * Base 0.
    * +20 if `Bio` is not empty.
    * +5 per skill (Max 30).
    * +10 per project (Max 50).
* **Usage:** Call this function when loading the Dashboard to show a "Profile Completion" gauge.

### C. Stored Procedure: `sp_GetFullPortfolioJSON(@UserID)`
* **Logic:**
    * Select User details.
    * Sub-select Projects (`FOR JSON PATH`).
    * Sub-select Experience (`FOR JSON PATH`).
    * Sub-select Skills + Definitions (`FOR JSON PATH`).
    * Return a single JSON string.
* **Why:** Allows the Next.js API to fetch the entire portfolio in one round-trip.

### D. View: `vw_AdminDashboardStats`
* **Logic:** Aggregates data for the dashboard.
    * Columns: `TotalUsers`, `TotalProjects`, `MostPopularSkill`, `AvgProjectsPerUser`.

### E. Indexing Strategy
* `idx_SkillName` on `SkillDefinitions(SkillName)` (Non-clustered) -> Optimizes autocomplete.
* `idx_UserEmail` on `Users(Email)` (Unique) -> Optimizes login.

### F. Complex Query (Subquery)
* **Feature:** "Find Experts" Search.
* **Query Logic:** Select Users who have a specific skill (by name) with `ProficiencyLevel > 8` using a subquery structure.

## 5. Functional Requirements (Next.js)

### Routes & Pages
1.  **`/login` & `/register`**: Simple auth forms.
2.  **`/dashboard` (Protected)**:
    * **Visuals:** Display "Profile Strength" (using `fn_CalculateProfileStrength`) and a Bar Chart of "Top Skills" (using `vw_AdminDashboardStats`).
    * **Quick Actions:** Buttons to Add Project, Add Skill.
3.  **`/dashboard/projects`**: Grid view of projects. Forms to Create/Edit/Delete.
4.  **`/dashboard/experience`**: Timeline view of jobs.
5.  **`/portfolio/[id]` (Public)**:
    * Fetches data via `sp_GetFullPortfolioJSON`.
    * Renders a clean, professional read-only portfolio page.

### Backend API Structure (`app/api/...`)
* **`/api/portfolio/[id]`**: GET request executes `sp_GetFullPortfolioJSON`.
* **`/api/stats`**: GET request selects from `vw_AdminDashboardStats`.
* **`/api/experience`**: POST request inserts into `Experience`. (Must handle the SQL Trigger error 500 response if dates are invalid).

## 6. Data Seeding (Mock Data)
**Requirement:** 1,000+ Total Records.
Create a T-SQL Script (`seed_data.sql`) that:
1.  Inserts 50 standard IT skills into `SkillDefinitions`.
2.  Loops to create 200 dummy `Users`.
3.  For each user, inserts random `UserSkills` (approx 5/user = 1,000 records).
4.  For each user, inserts random `Projects` (approx 3/user = 600 records).
5.  For each user, inserts random `Experience` (approx 2/user = 400 records).

## 7. Execution Plan for AI Builder
1.  **Step 1 (SQL):** Generate the `schema.sql` (Tables + Constraints) and `seed_data.sql`.
2.  **Step 2 (Advanced SQL):** Generate the T-SQL scripts for the Trigger, Function, Procedure, View, and Indexes.
3.  **Step 3 (Setup):** Create the `db.js` utility file for Next.js to connect to SQL Server.
4.  **Step 4 (API):** Create the Next.js API Routes that call the Stored Procedures.
5.  **Step 5 (UI):** Build the Dashboard and Forms using Tailwind CSS.