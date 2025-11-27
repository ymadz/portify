#!/bin/bash

# Portfolio Generator Platform - Setup Script
# Run this script to initialize the project

set -e

echo "=================================================="
echo "Portfolio Generator Platform - Setup"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Start SQL Server
echo -e "${YELLOW}Step 1: Starting SQL Server with Docker...${NC}"
cd "/Users/madz/Documents/school/ads mini system"
docker-compose up -d

echo "Waiting for SQL Server to be ready (30 seconds)..."
sleep 30

# Step 2: Initialize Database
echo -e "${YELLOW}Step 2: Initializing database...${NC}"

echo "Creating database and schema..."
docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/schema.sql

echo "Creating advanced SQL features..."
docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/advanced_features.sql

echo "Seeding data (this may take a minute)..."
docker exec -i portfolio_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Portfolio2024!Strong" -i /docker-entrypoint-initdb.d/seed_data.sql

# Step 3: Start Next.js
echo -e "${YELLOW}Step 3: Starting Next.js application...${NC}"
cd portfolio-generator

echo ""
echo -e "${GREEN}=================================================="
echo "Setup Complete!"
echo "==================================================${NC}"
echo ""
echo "Your Portfolio Generator Platform is ready!"
echo ""
echo "Next steps:"
echo "1. The application will start on http://localhost:3000"
echo "2. Create an account or use one of the seeded users"
echo "3. Explore the dashboard and features"
echo ""
echo "To stop services:"
echo "  - Press Ctrl+C to stop Next.js"
echo "  - Run 'docker-compose down' to stop SQL Server"
echo ""
echo "Starting development server..."
echo ""

npm run dev
