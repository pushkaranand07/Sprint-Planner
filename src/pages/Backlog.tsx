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
  Sparkles,
  ArrowRight,
  Sun,
  Star,
  Zap,
  Tag
} from 'lucide-react';

// Define the types within this file to make it self-contained
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

// Mock data to be used in the app, defined locally
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
    description: 'Ensure all components and logic by unit tests to prevent regressions.',
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
    description: 'Plan and execute the migration database to a more powerful server.',
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
  {
    id: 'task-6',
    title: 'Set up CI/CD pipeline',
    description: 'Configure and automate the and deployment process using GitHub Actions.',
    status: 'todo',
    priority: 'high',
    assignee: 'Joe',
    dueDate: '2025-08-29',
    tags: ['devops'],
    estimate: 8,
    createdAt: '2025-08-21T09:00:00Z',
    updatedAt: '2025-08-21T09:00:00Z',
  },
  {
    id: 'task-7',
    title: 'Create marketing copy for landing page',
    description: 'Write compelling and concise text for the new product landing page.',
    status: 'todo',
    priority: 'medium',
    assignee: 'Jane',
    dueDate: '2025-08-30',
    tags: ['marketing', 'content'],
    estimate: 2,
    createdAt: '2025-08-21T10:00:00Z',
    updatedAt: '2025-08-21T10:00:00Z',
  },
  {
    id: 'task-8',
    title: 'Design new logo',
    description: 'Brainstorm and design a fresh logo for the company rebranding.',
    status: 'todo',
    priority: 'urgent',
    assignee: 'Jane',
    dueDate: '2025-09-01',
    tags: ['design'],
    estimate: 5,
    createdAt: '2025-08-21T11:00:00Z',
    updatedAt: '2025-08-21T11:00:00Z',
  },
];

// Define a simple TaskCard component within the file
const TaskCard: React.FC<{ 
  task: Task; 
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  compact?: boolean;
}> = ({ task, onStatusChange, compact = false }) => {
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
      flex flex-col h-full p-5 rounded-2xl shadow-lg transition-all duration-300
      hover:shadow-2xl hover:scale-[1.01]
      bg-white/95 border border-gray-100
      transform-gpu
      ${!compact ? 'hover:scale-[1.02]' : ''}
    `}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2 line-clamp-1">{task.title}</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white flex-shrink-0 ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
      {!compact && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>}
      <div className="mt-auto">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            {task.assignee && (
              <div className="flex items-center">
                <span className="text-xs mr-1">👨‍💻</span>
                <span className="font-medium">{task.assignee}</span>
              </div>
            )}
            {task.dueDate && (
              <div className="flex items-center">
                <span className="text-xs mr-1">📅</span>
                <span className="font-medium">{task.dueDate}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColors[task.status]}`}>
              {statusText[task.status]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function Backlog() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    tags: [],
    assignee: [],
    dueDateRange: null,
    search: '',
  });
  const [sort, setSort] = useState<SortState>({ field: 'priority', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

  // Memoized list of tasks based on current filters and sort
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(task.status)) {
        return false;
      }
      if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) {
        return false;
      }
      if (filters.tags.length > 0 && !task.tags.some(tag => filters.tags.includes(tag))) {
        return false;
      }
      if (filters.assignee.length > 0 && task.assignee && !filters.assignee.includes(task.assignee)) {
        return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sort.field) {
        case 'priority':
          const priorityOrder: { [key: string]: number } = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'estimate':
          aValue = a.estimate;
          bValue = b.estimate;
          break;
        default:
          return 0;
      }
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, filters, sort]);

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      tags: [],
      assignee: [],
      dueDateRange: null,
      search: '',
    });
  };

  const toggleSort = (field: SortState['field']) => {
    if (sort.field === field) {
      setSort(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }));
    } else {
      setSort({ field, direction: 'desc' });
    }
  };

  // Get unique assignees and tags for filter options
  const uniqueAssignees = useMemo(() => [...new Set(tasks.map(task => task.assignee).filter(Boolean))], [tasks]);
  const uniqueTags = useMemo(() => [...new Set(tasks.flatMap(task => task.tags))], [tasks]);

  const statusConfig = {
    todo: { title: 'To Do', color: 'bg-gray-500' },
    'in-progress': { title: 'In Progress', color: 'bg-blue-500' },
    blocked: { title: 'Blocked', color: 'bg-red-500' },
    done: { title: 'Done', color: 'bg-green-500' }
  };

  const priorityConfig = {
    urgent: { color: ' bg-gradient-to-r from-red-500 to-pink-600' },
   high: 'bg-gradient-to-r from-amber-500 to-orange-500',
   medium: 'bg-gradient-to-r from-yellow-400 to-amber-400',
   low: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen font-sans text-gray-800 overflow-hidden bg-gray-50"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-fuchsia-900 to-violet-500 shadow-2xl shadow-purple-900/20 p-8 text-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold"
            >
              Task Flow
              <Sparkles className="inline-block w-8 h-8 ml-2 text-purple-200 animate-pulse" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 text-sm text-purple-100"
            >
              Organize your backlog with powerful filters and sorting.
            </motion.p>
          </div>
          <div className="flex items-center gap-4 mt-6 sm:mt-0">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0, duration: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 255, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 sm:mt-0 inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white text-white text-base font-semibold rounded-2xl hover:bg-opacity-30 transition-all duration-500 shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Task
          </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="p-8"
      >
        {/* Controls: Search, Filters, Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-300 text-gray-800 placeholder-gray-400 backdrop-blur-sm transition-all duration-300 shadow-inner"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(125, 59, 218, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-6 py-3 border rounded-2xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm ${
                showFilters 
                  ? 'bg-purple-100 border-purple-300 text-purple-700 shadow-lg' 
                  : 'bg-white/50 border-gray-200 text-gray-600 hover:bg-white/80'
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-5 h-5 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(125, 59, 218, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const sortFields = ['priority', 'dueDate', 'updatedAt', 'estimate'] as const;
                const currentIndex = sortFields.indexOf(sort.field);
                const nextIndex = (currentIndex + 1) % sortFields.length;
                toggleSort(sortFields[nextIndex]);
              }}
              className="inline-flex items-center px-6 py-3 border rounded-2xl text-sm font-semibold transition-all duration-300 backdrop-blur-sm bg-white/50 border-gray-200 text-gray-600 hover:bg-white/80"
            >
              <span className="capitalize">{sort.field.replace(/([A-Z])/g, ' $1').trim()}</span>
              {sort.direction === 'asc' ? <SortAsc className="w-4 h-4 ml-2" /> : <SortDesc className="w-4 h-4 ml-2" />}
            </motion.button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200 p-8 mb-8 shadow-2xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-4">Status</label>
                  <div className="space-y-3">
                    {['todo', 'in-progress', 'blocked', 'done'].map(status => (
                      <motion.label
                        key={status}
                        className="flex items-center group cursor-pointer"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={filters.status.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, status: [...prev.status, status] }));
                              } else {
                                setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }));
                              }
                            }}
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                            filters.status.includes(status) 
                              ? 'bg-purple-500 border-purple-500' 
                              : 'bg-gray-200 border-gray-300 group-hover:border-purple-400'
                          }`}>
                            {filters.status.includes(status) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 capitalize">
                          {status.replace('-', ' ')}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-4">Priority</label>
                  <div className="space-y-3">
                    {['urgent', 'high', 'medium', 'low'].map(priority => (
                      <motion.label
                        key={priority}
                        className="flex items-center group cursor-pointer"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={filters.priority.includes(priority)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, priority: [...prev.priority, priority] }));
                              } else {
                                setFilters(prev => ({ ...prev, priority: prev.priority.filter(p => p !== priority) }));
                              }
                            }}
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                            filters.priority.includes(priority)
                              ? 'bg-pink-500 border-pink-500'
                              : 'bg-gray-200 border-gray-300 group-hover:border-pink-400'
                          }`}>
                            {filters.priority.includes(priority) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 capitalize">{priority}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Assignee Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-4">Assignee</label>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {uniqueAssignees.map(assignee => (
                      <motion.label
                        key={assignee}
                        className="flex items-center group cursor-pointer"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={filters.assignee.includes(assignee!)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, assignee: [...prev.assignee, assignee!] }));
                              } else {
                                setFilters(prev => ({ ...prev, assignee: prev.assignee.filter(a => a !== assignee) }));
                              }
                            }}
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                            filters.assignee.includes(assignee!)
                              ? 'bg-rose-500 border-rose-500'
                              : 'bg-gray-200 border-gray-300 group-hover:border-rose-400'
                          }`}>
                            {filters.assignee.includes(assignee!) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700">{assignee}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-4">Tags</label>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {uniqueTags.map(tag => (
                      <motion.label
                        key={tag}
                        className="flex items-center group cursor-pointer"
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={filters.tags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                              } else {
                                setFilters(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
                              }
                            }}
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                            filters.tags.includes(tag)
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-gray-200 border-gray-300 group-hover:border-blue-400'
                          }`}>
                            {filters.tags.includes(tag) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700">{tag}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(252, 165, 165, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 text-sm text-rose-500 hover:text-rose-700 transition-all duration-300 rounded-lg"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Count and Sort Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-6 flex flex-wrap items-center justify-between text-sm text-gray-500"
        >
          <span className="font-medium text-lg text-gray-900">
            <span className="font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {filteredAndSortedTasks.length}
            </span> Tasks
          </span>
          <div className="flex items-center space-x-2">
            <span>Sorted by:</span>
            <span className="capitalize font-semibold text-purple-600">
              {sort.field.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-purple-600">
              {sort.direction === 'asc' ? ' (Asc)' : ' (Desc)'}
            </span>
          </div>
        </motion.div>

        {/* Tasks Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedTasks.length === 0 ? (
              <motion.div
                key="no-tasks"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="col-span-full text-center py-24"
              >
                <div className="text-gray-300 mb-5">
                  <Search className="w-16 h-16 mx-auto opacity-60" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-500 mb-2">No tasks found</h3>
                <p className="text-gray-400">Try adjusting your search or filters.</p>
              </motion.div>
            ) : (
              filteredAndSortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -30 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.05
                  }}
                  layout
                  className="h-full"
                >
                  <TaskCard
                    task={task}
                    onStatusChange={(taskId, newStatus) => {
                      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
                    }}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}