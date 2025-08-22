import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Tag, Edit3, Trash2, CheckCircle, Circle, Play } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { updateTodo, deleteTodo } from '../../services/todoService';
import toast from 'react-hot-toast';

const TodoDetailsModal = ({ todo, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: todo.title,
    description: todo.description || '',
    startTime: format(parseISO(todo.startTime), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(parseISO(todo.endTime), "yyyy-MM-dd'T'HH:mm"),
    priority: todo.priority,
    category: todo.category,
    notes: todo.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
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
      const updatedTodo = await updateTodo(todo._id, formData);
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await deleteTodo(todo._id);
        onDelete(todo._id);
      } catch (error) {
        toast.error('Failed to delete task');
      } finally {
        setLoading(false);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'mid': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-primary-400 bg-primary-500/20 border-primary-500/50';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      work: '💼',
      study: '📚',
      personal: '👤',
      health: '🏃',
      other: '📝'
    };
    return icons[category] || icons.other;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'in-progress':
        return <Play size={20} className="text-blue-400" />;
      default:
        return <Circle size={20} className="text-dark-400" />;
    }
  };

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
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Task' : 'Task Details'}
                </h2>
                <p className="text-sm text-dark-400">
                  {isEditing ? 'Update your task information' : 'View and manage your task'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                  title="Edit Task"
                >
                  <Edit3 size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isEditing ? (
              /* Edit Form */
              <form className="space-y-6">
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
                  />
                </div>

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
                  />
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="mid">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="work">Work</option>
                      <option value="study">Study</option>
                      <option value="personal">Personal</option>
                      <option value="health">Health</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                {/* Task Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{todo.title}</h3>
                  {todo.description && (
                    <p className="text-dark-300">{todo.description}</p>
                  )}
                </div>

                {/* Status and Priority */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(todo.status)}
                    <span className="text-dark-300 capitalize">{todo.status}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(todo.priority)}`}>
                    {todo.priority} Priority
                  </span>
                  <span className="flex items-center space-x-1 px-3 py-1 bg-dark-800/50 rounded-full text-sm">
                    <span>{getCategoryIcon(todo.category)}</span>
                    <span className="text-dark-300 capitalize">{todo.category}</span>
                  </span>
                </div>

                {/* Time Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 glass rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-primary-400" />
                      <span className="text-sm font-medium text-dark-200">Start Time</span>
                    </div>
                    <p className="text-white font-mono">
                      {format(parseISO(todo.startTime), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="p-4 glass rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-primary-400" />
                      <span className="text-sm font-medium text-dark-200">End Time</span>
                    </div>
                    <p className="text-white font-mono">
                      {format(parseISO(todo.endTime), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {todo.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-dark-200 mb-2">Notes</h4>
                    <div className="p-4 glass rounded-xl">
                      <p className="text-white">{todo.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-dark-700">
                  <button
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center space-x-2"
                  >
                    <Trash2 size={16} />
                    <span>Delete Task</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Edit3 size={16} />
                    <span>Edit Task</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoDetailsModal;
