import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, CheckCircle } from 'lucide-react';

const ProgressTracker = ({ completed, total, percentage }) => {
  const getProgressColor = (percent) => {
    if (percent >= 80) return 'text-green-400';
    if (percent >= 60) return 'text-yellow-400';
    if (percent >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressBgColor = (percent) => {
    if (percent >= 80) return 'bg-green-500/20';
    if (percent >= 60) return 'bg-yellow-500/20';
    if (percent >= 40) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  const getMotivationalMessage = (percent) => {
    if (percent === 100) return "Perfect! You're unstoppable! 🚀";
    if (percent >= 80) return "Amazing progress! Keep it up! 💪";
    if (percent >= 60) return "Great work! You're on fire! 🔥";
    if (percent >= 40) return "Good progress! Keep pushing! 💫";
    if (percent >= 20) return "Getting started! Every step counts! 🌱";
    return "New week, new opportunities! Let's begin! ✨";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-neon-blue rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
            <p className="text-sm text-dark-400">Track your achievements</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getProgressColor(percentage)}`}>
            {Math.round(percentage)}%
          </div>
          <div className="text-xs text-dark-400">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-dark-300">Progress</span>
          <span className="text-sm text-white font-medium">
            {completed} of {total} tasks
          </span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full transition-all duration-300 ${
              percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
              percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
              percentage >= 40 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
              'bg-gradient-to-r from-red-500 to-red-400'
            }`}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 glass rounded-xl text-center"
        >
          <div className="text-2xl font-bold text-green-400 mb-1">{completed}</div>
          <div className="text-xs text-dark-300">Completed</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 glass rounded-xl text-center"
        >
          <div className="text-2xl font-bold text-orange-400 mb-1">{total - completed}</div>
          <div className="text-xs text-dark-300">Remaining</div>
        </motion.div>
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-4 rounded-xl border ${getProgressBgColor(percentage)} border-current/20`}
      >
        <div className="flex items-center space-x-2">
          <TrendingUp className={`w-4 h-4 ${getProgressColor(percentage)}`} />
          <p className={`text-sm font-medium ${getProgressColor(percentage)}`}>
            {getMotivationalMessage(percentage)}
          </p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      {total === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl text-center"
        >
          <CheckCircle className="w-8 h-8 text-primary-400 mx-auto mb-2" />
          <p className="text-primary-300 text-sm font-medium">
            Ready to get started? Create your first task!
          </p>
        </motion.div>
      )}

      {/* Progress Insights */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 space-y-2"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-dark-400">Daily average</span>
            <span className="text-white font-medium">
              {total > 0 ? Math.ceil(total / 7) : 0} tasks/day
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-dark-400">Completion rate</span>
            <span className="text-white font-medium">
              {total > 0 ? Math.round((completed / total) * 100) : 0}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-dark-400">Efficiency</span>
            <span className={`font-medium ${getProgressColor(percentage)}`}>
              {percentage >= 80 ? 'Excellent' :
               percentage >= 60 ? 'Good' :
               percentage >= 40 ? 'Fair' :
               percentage >= 20 ? 'Needs Work' : 'Getting Started'}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressTracker;
