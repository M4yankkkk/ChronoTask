import axios from 'axios';
import { API_URLS } from '../config/api';

// Get all todos for the current user
export const getAllTodos = async () => {
  try {
    const response = await axios.get(API_URLS.TODOS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todos');
  }
};

// Get todos for a specific week
export const getWeekTodos = async (date) => {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await axios.get(`${API_URLS.TODOS}/week/${formattedDate}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch week todos');
  }
};

// Create a new todo
export const createTodo = async (todoData) => {
  try {
    const response = await axios.post(API_URLS.TODOS, todoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create todo');
  }
};

// Update an existing todo
export const updateTodo = async (todoId, updateData) => {
  try {
    const response = await axios.put(`${API_URLS.TODOS}/${todoId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update todo');
  }
};

// Delete a todo
export const deleteTodo = async (todoId) => {
  try {
    const response = await axios.delete(`${API_URLS.TODOS}/${todoId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete todo');
  }
};

// Update todo status
export const updateTodoStatus = async (todoId, status) => {
  try {
    const response = await axios.patch(`${API_URLS.TODOS}/${todoId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update todo status');
  }
};

// Get todos by priority
export const getTodosByPriority = async (priority) => {
  try {
    const response = await axios.get(API_URLS.TODOS);
    const todos = response.data;
    if (priority === 'all') return todos;
    return todos.filter(todo => todo.priority === priority);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todos by priority');
  }
};

// Get todos by category
export const getTodosByCategory = async (category) => {
  try {
    const response = await axios.get(API_URLS.TODOS);
    const todos = response.data;
    if (category === 'all') return todos;
    return todos.filter(todo => todo.category === category);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todos by category');
  }
};

// Search todos by title or description
export const searchTodos = async (searchTerm) => {
  try {
    const response = await axios.get(API_URLS.TODOS);
    const todos = response.data;
    if (!searchTerm) return todos;
    
    const searchLower = searchTerm.toLowerCase();
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(searchLower) ||
      (todo.description && todo.description.toLowerCase().includes(searchLower))
    );
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search todos');
  }
};

// Get todos for today
export const getTodayTodos = async () => {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const response = await axios.get(`${API_URLS.TODOS}/week/${formattedDate}`);
    const todos = response.data;
    
    return todos.filter(todo => {
      const todoDate = new Date(todo.startTime);
      return todoDate.toDateString() === today.toDateString();
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch today\'s todos');
  }
};

// Get upcoming todos (next 7 days)
export const getUpcomingTodos = async () => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formattedDate = today.toISOString().split('T')[0];
    const response = await axios.get(`${API_URLS.TODOS}/week/${formattedDate}`);
    const todos = response.data;
    
    return todos.filter(todo => {
      const todoDate = new Date(todo.startTime);
      return todoDate >= today && todoDate <= nextWeek;
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch upcoming todos');
  }
};
