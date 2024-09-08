const request = require('supertest');
const app = require('./../src/App'); // Adjust the path to your app file
const User = require('./../Models/User'); // Adjust the path to your User model
const Task = require('./../Models/Task'); // Adjust the path to your Task model

describe('Task Routes', () => {
  let token;

  // Before running the tests, create a user and get a token
  beforeAll(async () => {
    const user = await User.create({
      email: 'taskuser@example.com',
      password: await bcrypt.hash('password123', 10), // Ensure the password is hashed
    });

    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'taskuser@example.com',
        password: 'password123'
      });

    token = response.body.token;
  });

  // Test task creation
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'in-progress',
        dueDate: new Date().toISOString(),
      });

    expect(response.statusCode).toBe(201); // Adjust based on your expected status code
    expect(response.body).toHaveProperty('title', 'Test Task');
  });

  // Test fetching tasks
  it('should get tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test task deletion
  it('should delete a task', async () => {
    const task = await Task.create({
      title: 'Task to delete',
      description: 'This task will be deleted',
      status: 'completed',
      dueDate: new Date().toISOString(),
      user: (await User.findOne({ email: 'taskuser@example.com' })).id,
    });

    const response = await request(app)
      .delete(`/api/tasks/${task.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Task deleted successfully');
  });
});
