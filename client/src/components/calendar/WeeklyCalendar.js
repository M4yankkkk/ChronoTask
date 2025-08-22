import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, isToday, parseISO } from 'date-fns';
import TodoItem from '../todos/TodoItem';

const WeeklyCalendar = ({ 
  todos, 
  currentWeek, 
  onWeekChange, 
  onTodoClick, 
  onStatusChange,
  loading 
}) => {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getTodosForTimeSlot = (day, hour) => {
    return todos.filter(todo => {
      const todoDate = parseISO(todo.startTime);
      const todoHour = todoDate.getHours();
      return isSameDay(todoDate, day) && todoHour === hour;
    });
  };

  const navigateWeek = (direction) => {
    const newWeek = addDays(currentWeek, direction * 7);
    onWeekChange(newWeek);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'mid': return 'border-l-orange-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-primary-500';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-primary-400">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="w-6 h-6 text-primary-400" />
          <h2 className="text-2xl font-bold text-white">Weekly Calendar</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="text-white font-medium">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
          
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          
          <button
            onClick={() => onWeekChange(new Date())}
            className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors text-sm"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Time Column Header */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="h-12"></div> {/* Empty corner */}
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">
                <div className={`p-2 rounded-lg ${isToday(day) ? 'bg-primary-500/20 border border-primary-500/50' : ''}`}>
                  <p className="text-sm font-medium text-white">{format(day, 'EEE')}</p>
                  <p className={`text-xs ${isToday(day) ? 'text-primary-400' : 'text-dark-400'}`}>
                    {format(day, 'd')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
              {/* Time Label */}
              <div className="h-16 flex items-center justify-end pr-3">
                <span className="text-xs text-dark-400 font-mono">
                  {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                </span>
              </div>

              {/* Day Columns */}
              {weekDays.map((day, dayIndex) => {
                const dayTodos = getTodosForTimeSlot(day, hour);
                
                return (
                  <div key={dayIndex} className="calendar-cell relative">
                    {dayTodos.map((todo, todoIndex) => (
                      <motion.div
                        key={todo._id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: todoIndex * 0.1 }}
                        className="mb-1"
                      >
                        <TodoItem
                          todo={todo}
                          onClick={() => onTodoClick(todo)}
                          onStatusChange={onStatusChange}
                          compact={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Day View */}
      <div className="md:hidden mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {todos
            .filter(todo => isToday(parseISO(todo.startTime)))
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
            .map((todo) => (
              <motion.div
                key={todo._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 glass rounded-xl cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onTodoClick(todo)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{todo.title}</h4>
                    <p className="text-sm text-dark-300 mb-2">{todo.description}</p>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-primary-400">
                        {format(parseISO(todo.startTime), 'HH:mm')} - {format(parseISO(todo.endTime), 'HH:mm')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        todo.priority === 'high' ? 'priority-high' :
                        todo.priority === 'mid' ? 'priority-mid' : 'priority-low'
                      }`}>
                        {todo.priority}
                      </span>
                    </div>
                  </div>
                  <div className={`w-1 h-full rounded-full ${getPriorityColor(todo.priority)}`}></div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
