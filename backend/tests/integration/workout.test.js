const request = require('supertest');
const app = require('../../src/index');
const { createWorkoutLog } = require('../../src/models/WorkoutLog');

jest.mock('../../src/models/WorkoutLog');

describe('Workout Routes', () => {
  it('should fetch today\'s workout', async () => {
    const res = await request(app)
      .get('/api/workouts/today')
      .set('x-user-id', '1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should log a workout session', async () => {
    const workoutData = {
      sessionId: 'some-session-id',
      exercises: [
        { name: 'Bench Press', sets: [{ reps: 5, sets: 5, weight: 80 }] },
      ],
    };
    createWorkoutLog.mockResolvedValue({ id: 1, user_id: '1', ...workoutData });

    const res = await request(app)
      .post('/api/workouts/log')
      .set('x-user-id', '1')
      .send(workoutData);

    expect(res.statusCode).toEqual(201);
    expect(createWorkoutLog).toHaveBeenCalledWith('1', workoutData);
    expect(res.body).toHaveProperty('id');
  });
});

