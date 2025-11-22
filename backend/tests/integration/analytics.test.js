const request = require('supertest');
const app = require('../../src/index');
const pool = require('../../src/config/database');

// Mock the database
jest.mock('../../src/config/database', () => ({
  query: jest.fn(),
}));

describe('Analytics API', () => {
  const mockUserId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/analytics/prs', () => {
    it('should return all PRs for a user', async () => {
      const mockPRs = [
        {
          id: 1,
          user_id: mockUserId,
          exercise_name: 'Trap Bar Deadlift',
          weight: 100,
          rep_range: 5,
          estimated_1rm: 117,
          achieved_date: '2024-01-15',
        },
        {
          id: 2,
          user_id: mockUserId,
          exercise_name: 'Floor Press',
          weight: 50,
          rep_range: 3,
          estimated_1rm: 55,
          achieved_date: '2024-01-20',
        },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockPRs });

      const response = await request(app)
        .get('/api/analytics/prs')
        .set('x-user-id', mockUserId);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPRs);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT DISTINCT ON'),
        [mockUserId]
      );
    });

    it('should filter PRs by exercise name', async () => {
      const mockPRs = [
        {
          id: 1,
          user_id: mockUserId,
          exercise_name: 'Trap Bar Deadlift',
          weight: 100,
          rep_range: 5,
          estimated_1rm: 117,
          achieved_date: '2024-01-15',
        },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockPRs });

      const response = await request(app)
        .get('/api/analytics/prs?exercise=Trap Bar Deadlift')
        .set('x-user-id', mockUserId);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPRs);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1 AND exercise_name = $2'),
        [mockUserId, 'Trap Bar Deadlift']
      );
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/analytics/prs');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/analytics/exercise-history/:exerciseName', () => {
    it('should return exercise history', async () => {
      const mockLogs = [
        {
          id: 1,
          session_id: 'session-1',
          date: '2024-01-15',
          exercises: JSON.stringify([
            {
              name: 'Trap Bar Deadlift',
              sets: [
                { weight: 100, reps: 5 },
                { weight: 100, reps: 5 },
              ],
            },
          ]),
        },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockLogs });

      const response = await request(app)
        .get('/api/analytics/exercise-history/Trap Bar Deadlift')
        .set('x-user-id', mockUserId);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('date');
      expect(response.body[0]).toHaveProperty('sets');
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, session_id, date, exercises'),
        [mockUserId, '%Trap Bar Deadlift%', 50]
      );
    });

    it('should accept a limit parameter', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/analytics/exercise-history/Bench Press?limit=10')
        .set('x-user-id', mockUserId);

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        [mockUserId, '%Bench Press%', 10]
      );
    });
  });

  describe('GET /api/analytics/progress/:exerciseName', () => {
    it('should return progress analytics', async () => {
      const mockLogs = [
        {
          id: 1,
          session_id: 'session-1',
          date: '2024-01-15',
          exercises: JSON.stringify([
            {
              name: 'Trap Bar Deadlift',
              sets: [{ weight: 100, reps: 5 }],
            },
          ]),
        },
        {
          id: 2,
          session_id: 'session-2',
          date: '2024-01-20',
          exercises: JSON.stringify([
            {
              name: 'Trap Bar Deadlift',
              sets: [{ weight: 105, reps: 5 }],
            },
          ]),
        },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockLogs });

      const response = await request(app)
        .get('/api/analytics/progress/Trap Bar Deadlift')
        .set('x-user-id', mockUserId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('exerciseName', 'Trap Bar Deadlift');
      expect(response.body).toHaveProperty('trend');
      expect(response.body).toHaveProperty('chartData');
    });

    it('should accept a days parameter', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/analytics/progress/Squat?days=30')
        .set('x-user-id', mockUserId);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('period', '30 days');
    });
  });
});
