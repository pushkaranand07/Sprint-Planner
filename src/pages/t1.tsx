import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Plus,
  X,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Target,
  Sun,
  Star,
  Zap,
  LayoutGrid
} from 'lucide-react';
// ... other imports remain the same
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'blocked' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  tags: string[];
  estimate: number;
  sprint?: string;
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  status: string[];
  priority: string[];
  tags: string[];
  assignee: string[];
  dueDateRange: [string, string] | null;
  search: string;
}

interface SortState {
  field: 'priority' | 'dueDate' | 'updatedAt' | 'estimate';
  direction: 'asc' | 'desc';
}

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design user onboarding flow',
    description: 'Create wireframes and mockups for the new user registration and onboarding process.',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'Jane',
    dueDate: '2025-08-25',
    tags: ['design', 'frontend'],
    estimate: 5,
    createdAt: '2025-08-20T10:00:00Z',
    updatedAt: '2025-08-21T10:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Implement API for user authentication',
    description: 'Develop the backend endpoints for user login, registration, and password reset functionality.',
    status: 'todo',
    priority: 'high',
    assignee: 'Joe',
    dueDate: '2025-08-28',
    tags: ['backend', 'api'],
    estimate: 8,
    createdAt: '2025-08-19T14:30:00Z',
    updatedAt: '2025-08-20T09:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Write unit tests for checkout page',
    description: 'Ensure all components and logic on the checkout page are covered by unit tests to prevent regressions.',
    status: 'done',
    priority: 'medium',
    assignee: 'Jane',
    dueDate: '2025-08-22',
    tags: ['testing', 'frontend'],
    estimate: 3,
    createdAt: '2025-08-18T08:00:00Z',
    updatedAt: '2025-08-21T11:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Migrate database to new server',
    description: 'Plan and execute the migration of the production database to a more powerful server.',
    status: 'blocked',
    priority: 'urgent',
    assignee: 'Joe',
    dueDate: '2025-09-01',
    tags: ['backend', 'devops'],
    estimate: 13,
    createdAt: '2025-08-17T16:00:00Z',
    updatedAt: '2025-08-20T12:00:00Z',
  },
  {
    id: 'task-5',
    title: 'Refactor old legacy code',
    description: 'Review and improve the performance and readability of existing codebase.',
    status: 'todo',
    priority: 'low',
    assignee: 'Jane',
    dueDate: '2025-09-05',
    tags: ['refactoring'],
    estimate: 21,
    createdAt: '2025-08-15T09:00:00Z',
    updatedAt: '2025-08-16T15:00:00Z',
  },
];

const TaskCard: React.FC<{
  task: Task;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  compact?: boolean;
  onRemoveFromSprint?: (taskId: string) => void;
}> = ({ task, onStatusChange, compact = false, onRemoveFromSprint }) => {
  const priorityColors = {
    urgent: ' bg-gradient-to-r from-red-500 to-pink-600',
    high: 'bg-gradient-to-r from-amber-500 to-orange-500',
                    medium: 'bg-gradient-to-r from-yellow-400 to-amber-400',
                    low: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  };

  const statusColors = {
    todo: 'bg-gray-400',
    'in-progress': 'bg-blue-500',
    blocked: 'bg-red-500',
    done: 'bg-green-500',
  };

  const statusText = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    blocked: 'Blocked',
    done: 'Done',
  };

  return (
    <div className={`
      p-5 rounded-2xl shadow-lg transition-all duration-300
      hover:shadow-2xl hover:scale-[1.01]
      bg-white/95 border border-gray-100
      transform-gpu
      ${!compact ? 'hover:scale-[1.02]' : ''}
    `}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
      {!compact && <p className="text-sm text-gray-600 mb-3">{task.description}</p>}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          {task.assignee && (
            <div className="flex items-center">
              <span className="text-xs mr-1">捉窶昨汳ｻ</span>
              <span className="font-medium">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center">
              <span className="text-xs mr-1">套:</span>
              <span className="font-medium">{task.dueDate}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColors[task.status]}`}>
            {statusText[task.status]}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            {task.estimate} pts
          </span>
          {onRemoveFromSprint && (
            <button
              onClick={() => onRemoveFromSprint(task.id)}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
// ... TaskCard component remains the same

export default function Home() {
  // ... state declarations remain the same

  // ... other functions remain the same

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen font-sans text-gray-800 overflow-hidden bg-gray-50"
    >
      {/* Header - remains the same */}

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="p-8"
      >
        {/* Controls - remain the same */}

        {/* Filter Panel - remains the same */}

        <div className="flex h-[calc(100vh-200px)] -mx-8">
          {/* Left Panel - All Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-1/2 border-r border-gray-200/50 bg-white/80 backdrop-blur-md overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Tasks</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                {(['priority', 'dueDate', 'updatedAt'] as const).map((field) => (
                  <motion.button
                    key={field}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSort(field)}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                      sort.field === field
                        ? 'bg-purple-100 text-purple-700 shadow-inner'
                        : 'bg-white/50 text-gray-700 hover:bg-white/80'
                    }`}
                  >
                    {field === 'updatedAt' ? 'Updated' :
                     field === 'dueDate' ? 'Due Date' :
                     field.charAt(0).toUpperCase() + field.slice(1)}
                    {sort.field === field && (
                      sort.direction === 'asc' ? <SortAsc className="w-3 h-3 ml-1" /> : <SortDesc className="w-3 h-3 ml-1" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* REMOVED ANIMATIONS FROM TASK LIST */}
              {filteredAndSortedTasks.filter(task => !task.sprint).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-grab active:cursor-grabbing rounded-2xl"
                >
                  <TaskCard task={task} compact />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Panel - Sprint Section - remains the same */}
        </div>
      </motion.div>
    </motion.div>
  );
}