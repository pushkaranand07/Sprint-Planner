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
  Zap,
  LayoutGrid
} from 'lucide-react';
import AddTask from '../components/AddTask';

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

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  subtasks: Subtask[];
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
  compact?: boolean;
  onRemoveFromSprint?: (taskId: string) => void;
}> = ({ task, compact = false, onRemoveFromSprint }) => {
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
      hover:shadow-2xl
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
              <span className="text-xs mr-1">👨‍💻</span>
              <span className="font-medium">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center">
              <span className="text-xs mr-1">📅:</span>
              <span className="font-medium">{task.dueDate}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColors[task.status]}`}>
            {statusText[task.status]}
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

export default function Home() {
  const [pendingTasks, setPendingTasks] = useState<Task[]>(mockTasks);
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
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isSelectingSprint, setIsSelectingSprint] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = pendingTasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.description.toLowerCase().includes(filters.search.toLowerCase())) {
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
  }, [pendingTasks, filters, sort]);

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

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, target: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const updatedTasks = pendingTasks.map(task => {
      if (task.id === draggedTask.id) {
        let updates: Partial<Task> = { sprint: target };
        const today = new Date();

        if (target === 'today') {
          updates = { ...updates, dueDate: today.toISOString().split('T')[0] };
        } else if (target === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          updates = { ...updates, dueDate: tomorrow.toISOString().split('T')[0] };
        } else if (target === 'this-week') {
          const nextSaturday = new Date(today);
          nextSaturday.setDate(today.getDate() + (6 - today.getDay()));
          updates = { ...updates, dueDate: nextSaturday.toISOString().split('T')[0] };
        } else if (target === 'next-week') {
          const nextWeekSaturday = new Date(today);
          nextWeekSaturday.setDate(today.getDate() + (6 - today.getDay()) + 7);
          updates = { ...updates, dueDate: nextWeekSaturday.toISOString().split('T')[0] };
        }
        
        return { ...task, ...updates, updatedAt: new Date().toISOString() };
      }
      return task;
    });

    setPendingTasks(updatedTasks);
    setHasPendingChanges(true);
    setDraggedTask(null);
  };
  
  const handleRemoveFromSprint = (taskId: string) => {
    const updatedTasks = pendingTasks.map(task => 
      task.id === taskId ? { ...task, sprint: undefined, dueDate: undefined } : task
    );
    setPendingTasks(updatedTasks);
    setHasPendingChanges(true);
  };

  const handleSubmitChanges = () => {
    setHasPendingChanges(false);
    setSaveMessage('Changes saved successfully!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleAddTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      status: 'todo',
      priority: taskData.priority === 'high' ? 'high' : 
               taskData.priority === 'medium' ? 'medium' : 'low',
      dueDate: taskData.dueDate,
      tags: taskData.category ? [taskData.category] : [],
      estimate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPendingTasks(prev => [...prev, newTask]);
    setHasPendingChanges(true);
    setShowAddTask(false);
  };

  const uniqueAssignees = [...new Set(pendingTasks.map(task => task.assignee).filter(Boolean))];
  const uniqueTags = [...new Set(pendingTasks.flatMap(task => task.tags))];

  const statusConfig = {
    todo: { title: 'To Do', color: 'bg-gray-500' },
    'in-progress': { title: 'In Progress', color: 'bg-blue-500' },
    blocked: { title: 'Blocked', color: 'bg-red-500' },
    done: { title: 'Done', color: 'bg-green-500' }
  };

  const priorityConfig = {
    urgent: { color: ' bg-gradient-to-r from-red-500 to-pink-600' },
    high: { color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
    medium: { color: 'bg-gradient-to-r from-yellow-400 to-amber-400' },
    low: { color: 'bg-gradient-to-r from-blue-500 to-cyan-500' }
  };

  const sprintOptions = [
    { id: 'today', label: 'Today', icon: Sun },
    { id: 'tomorrow', label: 'Tomorrow', icon: Clock },
    { id: 'this-week', label: 'This Week', icon: Calendar },
    { id: 'next-week', label: 'Next Week', icon: ArrowRight },
  ];

  const renderSprintSection = () => {
    if (selectedSprint) {
      const selectedOption = sprintOptions.find(option => option.id === selectedSprint);
      const tasksToShow = pendingTasks.filter(task => task.sprint === selectedSprint);

      return (
        <div className="space-y-8">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200/50 shadow-2xl p-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 rounded-xl shadow-lg">
                  {selectedOption && React.createElement(selectedOption.icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">{selectedOption?.label}</h2>
                <span className="ml-4 bg-fuchsia-100 text-fuchsia-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-inner">
                  {tasksToShow.length} tasks
                </span>
              </div>
              <button
                onClick={() => setSelectedSprint(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, selectedSprint)}
              className="min-h-[150px] bg-gradient-to-br from-fuchsia-50/80 to-fuchsia-100/50 rounded-2xl p-5 border-2 border-dashed border-fuchsia-300/50 transition-all duration-300"
            >
              {tasksToShow.length === 0 ? (
                <div className="text-center text-fuchsia-500/70 py-8">
                  <p className="text-lg font-medium">Drag & Drop tasks for {selectedOption?.label.toLowerCase()} here</p>
                  <LayoutGrid className="w-8 h-8 mx-auto mt-4 text-fuchsia-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  {tasksToShow.map((task) => (
                    <div key={task.id}>
                      <TaskCard task={task} compact onRemoveFromSprint={handleRemoveFromSprint} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (isSelectingSprint) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Select Sprint Duration</h3>
          <div className="space-y-4 w-full max-w-md">
            {sprintOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedSprint(option.id);
                  setIsSelectingSprint(false);
                }}
                className="w-full flex items-center p-5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all duration-300 shadow-md"
              >
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg">
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <span className="ml-4 text-lg font-medium text-gray-900">{option.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsSelectingSprint(false)}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-all duration-300 rounded-lg"
          >
            Cancel
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <button
            onClick={() => setIsSelectingSprint(true)}
            className={`group relative inline-flex items-center px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
          >
            <span className="absolute inset-0 bg-white/20 group-hover:bg-white/0 transition-all duration-500"></span>
            <Target className="w-5 h-5 mr-2" />
            Create Your First Sprint
            <Zap className="w-4 h-4 ml-2" />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-fuchsia-900 to-violet-500 shadow-2xl shadow-purple-900/20 p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Sprint Planner
              <Sparkles className="inline-block w-8 h-8 ml-2 text-purple-200" />
            </h1>
            <p className="mt-2 text-sm text-purple-100">
              {filteredAndSortedTasks.length} tasks to conquer
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6 sm:mt-0">
            {hasPendingChanges && (
              <button
                onClick={handleSubmitChanges}
                className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white text-white text-base font-semibold rounded-2xl hover:bg-opacity-30 transition-all duration-500 shadow-xl"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            )}
            <button
              onClick={() => setShowAddTask(true)}
              className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white text-white text-base font-semibold rounded-2xl hover:bg-opacity-30 transition-all duration-500 shadow-xl"
              >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {saveMessage}
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-8">
        {/* Controls: Search, Filters, Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-300 text-gray-800 placeholder-gray-400 backdrop-blur-sm transition-all duration-300 shadow-inner"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          <div className="flex gap-4">
            <button
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
            </button>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-6 py-3 border rounded-2xl text-sm font-semibold transition-all duration-100 backdrop-blur-sm bg-white/50 border-gray-200 text-gray-600 hover:bg-white/80"
            >
              <X className="w-5 h-5 mr-2" />
              Clear
            </button>
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
                    {Object.entries(statusConfig).map(([statusKey, config]) => (
                      <label
                        key={statusKey}
                        className="flex items-center group cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={filters.status.includes(statusKey)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, status: [...prev.status, statusKey] }));
                              } else {
                                setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== statusKey) }));
                              }
                            }}
                          />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                            filters.status.includes(statusKey)
                              ? 'bg-purple-500 border-purple-500'
                              : 'bg-gray-200 border-gray-300 group-hover:border-purple-400'
                          }`}>
                            {filters.status.includes(statusKey) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 capitalize">
                          {config.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-4">Priority</label>
                  <div className="space-y-3">
                    {Object.keys(priorityConfig).map(priority => (
                      <label
                        key={priority}
                        className="flex items-center group cursor-pointer"
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
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 capitalize">{priority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Assignee Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-4">Assignee</label>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {uniqueAssignees.map(assignee => (
                      <label
                        key={assignee}
                        className="flex items-center group cursor-pointer"
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
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700">{assignee}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-4">Tags</label>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {uniqueTags.map(tag => (
                      <label
                        key={tag}
                        className="flex items-center group cursor-pointer"
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
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 text-sm text-rose-500 hover:text-rose-700 transition-all duration-300 rounded-lg"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex h-[calc(100vh-200px)] -mx-8">
          {/* Left Panel - All Tasks */}
          <div className="w-1/2 border-r border-gray-200/50 bg-white/80 backdrop-blur-md overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Tasks</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">Sort by:</span>
                {(['priority', 'dueDate', 'updatedAt'] as const).map((field) => (
                  <button
                    key={field}
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
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {filteredAndSortedTasks.filter(task => !task.sprint).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className="transform transition-all duration-300 hover:shadow-xl cursor-grab active:cursor-grabbing rounded-2xl"
                >
                  <TaskCard task={task} compact />
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Sprint Section */}
          <div className="w-1/2 bg-gradient-to-b from-white/50 to-purple-50/50 backdrop-blur-sm p-8 overflow-y-auto">
            {renderSprintSection()}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTask 
          onClose={() => setShowAddTask(false)} 
          onAddTask={handleAddTask} 
        />
      )}
    </div>
  );
}