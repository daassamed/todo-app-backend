import axios from 'axios';
import { registerUser, loginUser, getTasks, createTask } from './api';

// Mock axios
jest.mock('axios');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('registerUser makes POST request with user data', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
          token: 'fake-token'
        }
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const result = await registerUser(userData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/register'),
      userData
    );
    expect(result.success).toBe(true);
    expect(result.data.email).toBe('test@example.com');
  });

  test('loginUser makes POST request with credentials', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
          token: 'fake-token'
        }
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const result = await loginUser(credentials);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      credentials
    );
    expect(result.success).toBe(true);
  });
});

describe('Task API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'fake-token');
  });

  test('getTasks includes auth header', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: []
      }
    };

    axios.get.mockResolvedValue(mockResponse);

    await getTasks();

    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-token'
        })
      })
    );
  });

  test('createTask sends task data with auth header', async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          _id: '456',
          title: 'Test Task',
          completed: false
        }
      }
    };

    axios.post.mockResolvedValue(mockResponse);

    const taskData = {
      title: 'Test Task',
      description: 'Test Description'
    };

    const result = await createTask(taskData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      taskData,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-token'
        })
      })
    );
    expect(result.data.title).toBe('Test Task');
  });
});