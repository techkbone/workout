# Database Setup

## Initial Setup

1. Create a PostgreSQL database:
```bash
createdb workout_tracker
```

2. Run the schema to create tables and indexes:
```bash
psql -d workout_tracker -f schema.sql
```

## Performance Optimizations

The schema includes several indexes for optimal query performance:

### Workout Logs
- `idx_workout_logs_user_id`: Fast user filtering
- `idx_workout_logs_date`: Fast date-based queries
- `idx_workout_logs_user_date`: Composite index for user+date range queries
- `idx_workout_logs_exercises_gin`: GIN index for fast JSON queries

### Personal Records
- `idx_personal_records_user_id`: Fast user filtering
- `idx_personal_records_exercise`: Fast exercise name lookups
- `idx_personal_records_user_exercise`: Composite index for user+exercise queries
- `idx_personal_records_user_date`: Fast chronological sorting per user

## Maintenance

To check index usage:
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public';
```

To analyze table statistics:
```sql
ANALYZE workout_logs;
ANALYZE personal_records;
```
