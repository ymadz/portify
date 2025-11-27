# Portfolio Generator Platform

Advanced Database Systems project - A Next.js + SQL Server portfolio management system demonstrating T-SQL mastery.

## Prerequisites

- Docker Desktop installed
- Node.js 18+ installed
- Azure Data Studio or SQL Server Management Studio (optional, for database management)

## Quick Start

### 1. Start SQL Server with Docker

```bash
docker-compose up -d
```

Wait 30 seconds for SQL Server to initialize, then verify it's running:

```bash
docker ps
```

### 2. Initialize Database

Execute the database scripts in order:

```bash
# Using Docker exec
docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/schema.sql

docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/advanced_features.sql

docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/seed_data.sql
```

Or use Azure Data Studio/SSMS to execute:
1. `database/schema.sql`
2. `database/advanced_features.sql`
3. `database/seed_data.sql`

### 3. Install Dependencies & Run Application

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Technology Stack

- **Database**: Microsoft SQL Server 2019
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: bcryptjs + sessions
- **Database Driver**: mssql (raw SQL, no ORM)

## Features

- User authentication & authorization
- Profile management with skills, projects, and experience
- Profile strength calculation (T-SQL function)
- Dashboard with data visualizations
- Public shareable portfolio pages
- Advanced SQL features:
  - Trigger for date validation
  - Stored function for profile strength
  - Stored procedure for portfolio JSON
  - View for dashboard statistics
  - Optimized indexes
  - Complex subqueries

## Project Structure

```
/database          - SQL scripts
/app              - Next.js App Router pages & API
/lib              - Database connection & utilities
/components       - React components
```

## Database Management

Stop SQL Server:
```bash
docker-compose down
```

Reset database (WARNING: deletes all data):
```bash
docker-compose down -v
docker-compose up -d
# Re-run database initialization scripts
```

View logs:
```bash
docker logs portfolio_sqlserver
```

## Connection String

```
Server=localhost,1433;Database=PortfolioDB;User Id=sa;Password=Portfolio2024!Strong;TrustServerCertificate=true;Encrypt=true
```
