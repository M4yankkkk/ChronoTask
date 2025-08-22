import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Plus, LogOut, Search, Filter, Calendar, Clock, User } from 'lucide-react';
import WeeklyCalendar from './calendar/WeeklyCalendar';
import AddTodoModal from './todos/AddTodoModal';
import TodoDetailsModal from './todos/TodoDetailsModal';
import ProgressTracker from './dashboard/ProgressTracker';
import { getWeekTodos } from '../services/todoService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    loadWeekTodos();
  }, [currentWeek]);

  const loadWeekTodos = async () => {
    try {
      setLoading(true);
      const weekTodos = await getWeekTodos(currentWeek);
      setTodos(weekTodos);
    } catch (error) {
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = (newTodo) => {
    setTodos(prev => [...prev, newTodo]);
    setShowAddModal(false);
    toast.success('Task created successfully! 🎯');
  };

  const handleUpdateTodo = (updatedTodo) => {
    setTodos(prev => prev.map(todo => 
      todo._id === updatedTodo._id ? updatedTodo : todo
    ));
    setSelectedTodo(null);
    toast.success('Task updated successfully! ✨');
  };

  const handleDeleteTodo = (todoId) => {
    setTodos(prev => prev.filter(todo => todo._id !== todoId));
    setSelectedTodo(null);
    toast.success('Task deleted successfully! 🗑️');
  };

  const handleStatusChange = (todoId, newStatus) => {
    setTodos(prev => prev.map(todo => 
      todo._id === todoId ? { ...todo, status: newStatus } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const completedTodos = todos.filter(todo => todo.status === 'completed').length;
  const totalTodos = todos.length;
  const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark border-b border-dark-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-neon-blue rounded-xl flex items-center justify-center neon-glow">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">ChronoTask</h1>
                <p className="text-xs text-dark-400">Futuristic Productivity</p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-dark-800/50 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 bg-dark-800/50 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="mid">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-dark-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Progress and Stats */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ProgressTracker
                completed={completedTodos}
                total={totalTodos}
                percentage={progressPercentage}
              />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-primary-400" />
                This Week
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Total Tasks</span>
                  <span className="text-white font-semibold">{totalTodos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Completed</span>
                  <span className="text-green-400 font-semibold">{completedTodos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Pending</span>
                  <span className="text-orange-400 font-semibold">{totalTodos - completedTodos}</span>
                </div>
              </div>
            </motion.div>

            {/* Priority Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Priority Breakdown</h3>
              <div className="space-y-3">
                {['high', 'mid', 'low'].map(priority => {
                  const count = todos.filter(todo => todo.priority === priority).length;
                  const percentage = totalTodos > 0 ? (count / totalTodos) * 100 : 0;
                  const colorClass = {
                    high: 'text-red-400',
                    mid: 'text-orange-400',
                    low: 'text-green-400'
                  }[priority];
                  
                  return (
                    <div key={priority} className="flex justify-between items-center">
                      <span className="text-dark-300 capitalize">{priority}</span>
                      <span className={`font-semibold ${colorClass}`}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Main Calendar Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <WeeklyCalendar
                todos={filteredTodos}
                currentWeek={currentWeek}
                onWeekChange={setCurrentWeek}
                onTodoClick={setSelectedTodo}
                onStatusChange={handleStatusChange}
                loading={loading}
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary-500 to-neon-blue rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 neon-glow z-50"
      >
        <Plus size={24} />
      </motion.button>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddTodoModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddTodo}
            currentWeek={currentWeek}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTodo && (
          <TodoDetailsModal
            todo={selectedTodo}
            onClose={() => setSelectedTodo(null)}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
