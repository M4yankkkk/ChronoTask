import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const TodoItem = ({ todo, onClick, onStatusChange, compact = false }) => {
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high border-l-red-500';
      case 'mid':
        return 'priority-mid border-l-orange-500';
      case 'low':
        return 'priority-low border-l-green-500';
      default:
        return 'bg-dark-800/50 border-l-primary-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'in-progress':
        return <Circle size={16} className="text-blue-400" />;
      default:
        return <Circle size={16} className="text-dark-400" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      study: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      personal: 'bg-green-500/20 text-green-300 border-green-500/50',
      health: 'bg-red-500/20 text-red-300 border-red-500/50',
      other: 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    };
    return colors[category] || colors.other;
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(todo._id, newStatus);
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`todo-item ${getPriorityStyles(todo.priority)} cursor-pointer border-l-4`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white text-sm truncate">{todo.title}</h4>
            {todo.description && (
              <p className="text-xs text-dark-300 truncate">{todo.description}</p>
            )}
          </div>
          <button
            onClick={handleStatusClick}
            className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
          >
            {getStatusIcon(todo.status)}
          </button>
        </div>
        
        {todo.category && todo.category !== 'other' && (
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(todo.category)}`}>
              <Tag size={10} className="mr-1" />
              {todo.category}
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`todo-item ${getPriorityStyles(todo.priority)} cursor-pointer border-l-4`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-white">{todo.title}</h4>
            <button
              onClick={handleStatusClick}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              {getStatusIcon(todo.status)}
            </button>
          </div>
          
          {todo.description && (
            <p className="text-sm text-dark-300 mb-3">{todo.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-dark-400">
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>
                {format(parseISO(todo.startTime), 'HH:mm')} - {format(parseISO(todo.endTime), 'HH:mm')}
              </span>
            </div>
            
            {todo.category && todo.category !== 'other' && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(todo.category)}`}>
                <Tag size={10} className="mr-1" />
                {todo.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;
