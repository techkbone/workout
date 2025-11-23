#!/bin/bash

# Script to initialize the workout tracker database

# Database configuration
DB_NAME="${DB_NAME:-workout_tracker}"
DB_USER="${DB_USER:-postgres}"

echo "===== Workout Tracker Database Initialization ====="
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    exit 1
fi

echo "✓ PostgreSQL found"

# Create database if it doesn't exist
echo ""
echo "Creating database '$DB_NAME'..."
psql -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME"

echo "✓ Database '$DB_NAME' ready"

# Run schema
echo ""
echo "Applying schema..."
psql -U "$DB_USER" -d "$DB_NAME" -f "$(dirname "$0")/schema.sql"

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "Next steps:"
echo "1. Copy backend/.env.example to backend/.env"
echo "2. Update database credentials in backend/.env"
echo "3. Start the backend: cd backend && npm start"
