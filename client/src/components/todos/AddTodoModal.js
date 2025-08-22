import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Tag, AlertCircle, FileText } from 'lucide-react';
import { format, addHours, startOfDay } from 'date-fns';
import { createTodo } from '../../services/todoService';
import toast from 'react-hot-toast';

const AddTodoModal = ({ onClose, onAdd, currentWeek }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: format(addHours(startOfDay(currentWeek), 9), "yyyy-MM-dd'T'HH:mm"), // 9 AM default
    endTime: format(addHours(startOfDay(currentWeek), 10), "yyyy-MM-dd'T'HH:mm"), // 10 AM default
    priority: 'mid',
    category: 'other',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-adjust end time if start time changes
    if (name === 'startTime') {
      const startDate = new Date(value);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour
      setFormData(prev => ({
        ...prev,
        endTime: format(endDate, "yyyy-MM-dd'T'HH:mm")
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast.error('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      const newTodo = await createTodo(formData);
      onAdd(newTodo);
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { value: 'mid', label: 'Medium', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    { value: 'high', label: 'High', color: 'text-red-400', bgColor: 'bg-red-500/20' }
  ];

  const categoryOptions = [
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'study', label: 'Study', icon: '📚' },
    { value: 'personal', label: 'Personal', icon: '👤' },
    { value: 'health', label: 'Health', icon: '🏃' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-dark-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-neon-blue rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add New Task</h2>
                <p className="text-sm text-dark-400">Schedule your next productivity session</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="What needs to be done?"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Add more details about this task..."
              />
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-3">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 ${
                      formData.priority === option.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 hover:border-dark-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      checked={formData.priority === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${option.color}`}>
                        {option.label}
                      </div>
                      <div className={`text-xs ${option.color} mt-1`}>
                        {option.value === 'high' && 'Urgent & Important'}
                        {option.value === 'mid' && 'Important'}
                        {option.value === 'low' && 'Nice to Have'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-3">
                Category
              </label>
              <div className="grid grid-cols-5 gap-3">
                {categoryOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative cursor-pointer rounded-xl p-3 border-2 transition-all duration-200 text-center ${
                      formData.category === option.value
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 hover:border-dark-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={option.value}
                      checked={formData.category === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs text-white font-medium">{option.label}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Any additional information, reminders, or context..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-dark-700">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Clock size={16} />
                    <span>Create Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTodoModal;
