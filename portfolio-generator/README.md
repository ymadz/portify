# Portfolio Generator Platform

A modern web application for creating and managing professional portfolios, built with Next.js 14 and Microsoft SQL Server. Demonstrates advanced database concepts including triggers, stored procedures, functions, views, and complex queries.

## 🎨 Design System

This project implements a **modern minimal design system** based on the `DESIGN_GUIDE.md` specification:

- **Design tokens**: Colors, spacing, typography, shadows defined in `app/globals.css`
- **9 reusable components**: Button, Card, Input, Textarea, Select, Badge, Modal, Progress, Avatar
- **Consistent styling**: Tailwind v4 with CSS variables for theming
- **Accessible by default**: Focus states, keyboard navigation, ARIA attributes

📚 **Documentation**:
- [DESIGN_GUIDE.md](../DESIGN_GUIDE.md) - Complete design specification
- [DESIGN_IMPLEMENTATION.md](../DESIGN_IMPLEMENTATION.md) - Implementation details and component matrix
- [DESIGN_REFERENCE.md](../DESIGN_REFERENCE.md) - Quick reference with code examples

### Using Components

```javascript
import { Button, Card, Input, Modal } from '@/components';

// Button
<Button variant="primary" size="lg">Get Started</Button>

// Card
<Card>
  <Card.Header><Card.Title>Title</Card.Title></Card.Header>
  <Card.Body>Content</Card.Body>
</Card>

// Input
<Input label="Email" type="email" error={errors.email} />
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (for SQL Server)
- Node.js 18+ and npm

### Installation

1. **Start the database and application**:
```bash
cd /path/to/ads-mini-system
chmod +x setup.sh
./setup.sh
```

This script will:
- Start SQL Server in Docker
- Initialize the database schema
- Load seed data (2,200+ records)
- Start the Next.js development server

2. **Access the application**:
- **Frontend**: http://localhost:3000
- **SQL Server**: localhost:1433 (sa / Portfolio2024!Strong)

### Manual Setup

If you prefer manual setup:

```bash
# Start SQL Server
docker-compose up -d

# Wait 30 seconds for SQL Server to be ready
sleep 30

# Initialize database
docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/schema.sql
docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/advanced_features.sql
docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/seed_data.sql

# Install dependencies and start Next.js
cd portfolio-generator
npm install
npm run dev
```

## 📁 Project Structure

```
portfolio-generator/
├── app/                      # Next.js App Router
│   ├── api/                 # Backend API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── projects/       # Project CRUD
│   │   ├── experience/     # Experience CRUD (with trigger)
│   │   ├── skills/         # Skill management
│   │   ├── portfolio/      # Portfolio JSON (stored procedure)
│   │   └── stats/          # Dashboard stats (view + function)
│   ├── dashboard/          # Protected dashboard pages
│   │   ├── projects/
│   │   ├── experience/
│   │   └── skills/
│   ├── portfolio/[id]/     # Public portfolio view
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── page.js             # Landing page
│   ├── layout.js           # Root layout with Toaster
│   └── globals.css         # Design tokens and Tailwind
├── components/             # Reusable UI components
│   ├── Button.js
│   ├── Card.js
│   ├── Input.js
│   ├── Textarea.js
│   ├── Select.js
│   ├── Badge.js
│   ├── Modal.js
│   ├── Progress.js
│   ├── Avatar.js
│   └── index.js           # Barrel exports
├── lib/
│   ├── db.js              # SQL Server connection
│   └── auth.js            # Authentication logic
└── middleware.js          # Route protection

database/
├── schema.sql             # 5 normalized tables
├── advanced_features.sql  # Triggers, functions, procedures, views
└── seed_data.sql          # 2,200+ test records
```

## 🗄️ Database Features

### 6 Advanced SQL Features (All Implemented)

1. **Trigger**: `trg_ValidateExperienceDates` - Validates EndDate >= StartDate
2. **Function**: `fn_CalculateProfileStrength` - Returns 0-100 score based on profile completeness
3. **Stored Procedure**: `sp_GetFullPortfolioJSON` - Returns complete portfolio as JSON
4. **View**: `vw_AdminDashboardStats` - Aggregates platform statistics
5. **Indexes**: 5 indexes including unique and foreign key indexes for performance
6. **Subquery**: Expert search using nested SELECT with IN clause

### Schema (5 Tables)
- **Users**: UserID, Email, PasswordHash, FullName, Bio
- **SkillDefinitions**: SkillDefID, SkillName, Category (lookup table)
- **UserSkills**: Linking table with ProficiencyLevel (1-10)
- **Projects**: ProjectID, UserID, Title, Description, URL
- **Experience**: ExperienceID, UserID, Company, Role, StartDate, EndDate

## 🔐 Authentication

- **Bcrypt** password hashing (10 rounds)
- **Session-based** authentication with httpOnly cookies
- **In-memory** session storage (suitable for development)
- **Route protection** via middleware

## 🎯 Key Features

- ✅ CRUD operations for projects, experience, and skills
- ✅ Profile strength calculation (SQL function)
- ✅ Dashboard with Recharts visualization
- ✅ Public shareable portfolios (stored procedure)
- ✅ Experience date validation (trigger)
- ✅ Real-time error feedback (toast notifications)
- ✅ Responsive design (mobile-friendly)
- ✅ Accessible UI components

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS v4
- **Backend**: Next.js API Routes, Node.js
- **Database**: Microsoft SQL Server 2019, mssql driver
- **Visualization**: Recharts
- **UI Components**: Custom design system (9 components)
- **Authentication**: bcryptjs, session cookies
- **Notifications**: react-hot-toast
- **Containerization**: Docker Compose

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get single project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Experience
- `GET /api/experience` - List user experience
- `POST /api/experience` - Create experience (trigger validation)
- `GET /api/experience/[id]` - Get single experience
- `PUT /api/experience/[id]` - Update experience
- `DELETE /api/experience/[id]` - Delete experience

### Skills
- `GET /api/skills` - List user skills
- `POST /api/skills` - Add skill
- `PUT /api/skills/[id]` - Update proficiency
- `DELETE /api/skills/[id]` - Remove skill
- `GET /api/skills/definitions` - Get all available skills

### Other
- `GET /api/portfolio/[id]` - Public portfolio (stored procedure)
- `GET /api/stats` - Dashboard statistics (view + function)
- `GET /api/experts` - Find experts by skill (subquery)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## 🧪 Testing the SQL Features

### 1. Trigger (Experience Date Validation)
1. Go to `/dashboard/experience`
2. Try adding experience with EndDate before StartDate
3. Should see error toast: "End Date cannot be before Start Date"

### 2. Function (Profile Strength)
1. Go to `/dashboard`
2. View the profile strength gauge (0-100%)
3. Add bio, skills, projects to increase score

### 3. Stored Procedure (Portfolio JSON)
1. Visit `/portfolio/[user-id]`
2. View source or Network tab
3. Response is JSON from `sp_GetFullPortfolioJSON`

### 4. View (Dashboard Stats)
1. Go to `/dashboard`
2. Scroll to "Platform Statistics"
3. Data comes from `vw_AdminDashboardStats`

### 5. Indexes
Run this query to see indexes:
```sql
SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('UserSkills');
```

### 6. Subquery (Expert Search)
```bash
curl http://localhost:3000/api/experts?skillName=React&minProficiency=8
```

## 📝 Environment Variables

Create `.env.local` in the `portfolio-generator` folder:

```env
DATABASE_URL=Server=localhost,1433;Database=PortfolioDB;User Id=sa;Password=Portfolio2024!Strong;Encrypt=true;TrustServerCertificate=true
SESSION_SECRET=your-secret-key-change-in-production
```

## 🐛 Troubleshooting

### SQL Server not starting
```bash
docker-compose down
docker volume rm ads-mini-system_sqlserver_data
docker-compose up -d
```

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Database connection errors
Check that SQL Server is running:
```bash
docker ps
docker logs portfolio_sqlserver
```

## 📚 Additional Documentation

- [IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md) - Feature completion matrix
- [COMPLETION_SUMMARY.md](../COMPLETION_SUMMARY.md) - Final project summary
- [system_instructions.md](../system_instructions.md) - Original requirements
- [instructions.md](../instructions.md) - Course project guidelines

## 🎓 Academic Context

This project was built for an **Advanced Database Systems** course, demonstrating:
- Normalized database design (3NF)
- T-SQL advanced features
- API architecture
- Full-stack development
- UI/UX best practices

**Course Requirements**: ✅ All met
- Individual unique system
- 4+ related tables (5 implemented)
- 1,000-2,000 records (2,200+ seeded)
- All 6 advanced SQL features functionally integrated
- GUI interface with CRUD operations
- Dashboard visualization

## 📄 License

This project is for educational purposes.

## 🙋 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the documentation files
3. Check the implementation status
