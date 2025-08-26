import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Pause,
  MessageSquare,
  Plus,
  ArrowRight,
  Zap,
  CheckSquare,
  Sparkles
} from 'lucide-react';

const mockTasks = [
  {
    id: 'task-1',
    title: 'Design landing page hero section',
    description: 'Create a visually appealing and modern hero section for the new website landing page.',
    status: "todo", // must match union
    priority: "high",
    tags: ['design', 'ui/ux'],
    assignee: 'Alice',
    dueDate: '2024-06-25',
    estimate: 5,
    sprint: 'this-week',
    createdAt: '2024-06-20T10:00:00Z',
    updatedAt: '2024-06-24T14:30:00Z',
  },
  {
    id: 'task-2',
    title: 'Develop user authentication module',
    description: 'Implement secure sign-up, login, and password reset functionalities.',
    status: 'todo',
    priority: 'urgent',
    tags: ['development', 'backend'],
    assignee: 'Bob',
    dueDate: '2024-07-01',
    estimate: 12,
    sprint: 'next-week',
    createdAt: '2024-06-21T09:00:00Z',
    updatedAt: '2024-06-21T09:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Write blog post on new feature',
    description: 'Draft a marketing-focused blog post highlighting the benefits of the latest product feature.',
    status: 'done',
    priority: 'medium',
    tags: ['content', 'marketing'],
    assignee: 'Charlie',
    dueDate: '2024-06-24',
    estimate: 3,
    sprint: 'this-week',
    createdAt: '2024-06-22T11:00:00Z',
    updatedAt: '2024-06-24T10:00:00Z',
  },
  {
    id: 'task-4',
    title: 'Review Q3 financial report',
    description: 'Analyze financial data and prepare a summary for the team meeting.',
    status: 'blocked',
    priority: 'high',
    tags: ['finance', 'reporting'],
    assignee: 'Alice',
    dueDate: '2024-06-26',
    estimate: 4,
    sprint: 'this-week',
    createdAt: '2024-06-23T15:00:00Z',
    updatedAt: '2024-06-23T15:00:00Z',
  },
  {
    id: 'task-5',
    title: 'Update project documentation',
    description: 'Ensure all new features are accurately documented in the project wiki.',
    status: 'in-progress',
    priority: 'low',
    tags: ['documentation'],
    assignee: 'Bob',
    dueDate: null,
    estimate: 6,
    sprint: 'this-week',
    createdAt: '2024-06-24T09:30:00Z',
    updatedAt: '2024-06-24T09:30:00Z',
  },
];

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'blocked' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  tags: string[];
  assignee: string | null;
  dueDate: string | null;
  estimate: number;
  sprint: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  compact?: boolean;
  actions?: React.ReactNode;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, compact = false, actions }) => {
  const priorityColors = {
    urgent: 'bg-gradient-to-r from-red-500 to-pink-600',
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="p-5 rounded-2xl shadow-lg bg-white/95 border border-gray-100 backdrop-blur-sm transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2">{task.title}</h3>
        <div className="flex items-center space-x-2">
          {actions}
          <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
      </div>
      {!compact && <p className="text-sm text-gray-600 mb-3">{task.description}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {task.assignee && (
            <div className="flex items-center">
              <span className="text-xs mr-1">Assigned to:</span>
              <span className="font-medium">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center">
              <span className="text-xs mr-1">Due:</span>
              <span className="font-medium">{task.dueDate}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColors[task.status]}`}>
            {statusText[task.status]}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            {task.estimate} hrs
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function Today() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [quickNote, setQuickNote] = useState('');

  const todaysTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter(task => {
      const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === today;
      const isInThisWeekSprint = task.sprint === 'this-week';
      const isRecentlyUpdated = new Date(task.updatedAt).toDateString() === today;
      
      return isDueToday || (isInThisWeekSprint && (task.status === 'in-progress' || isRecentlyUpdated));
    });
  }, [tasks]);

  const tasksByPriority = useMemo(() => {
    const urgent = todaysTasks.filter(task => task.priority === 'urgent');
    const high = todaysTasks.filter(task => task.priority === 'high');
    const other = todaysTasks.filter(task => !['urgent', 'high'].includes(task.priority));
    
    return [...urgent, ...high, ...other];
  }, [todaysTasks]);

  const stats = useMemo(() => {
    const completed = todaysTasks.filter(task => task.status === 'done').length;
    const inProgress = todaysTasks.filter(task => task.status === 'in-progress').length;
    const blocked = todaysTasks.filter(task => task.status === 'blocked').length;
    const overdue = todaysTasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      task.status !== 'done'
    ).length;

    return { completed, inProgress, blocked, overdue };
  }, [todaysTasks]);

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const addQuickNote = () => {
    if (!quickNote.trim()) return;
    
    console.log(`Added note: ${quickNote}`);
    setQuickNote('');
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const statItems = [
    { label: 'Completed', value: stats.completed, color: 'text-green-500', icon: CheckSquare },
    { label: 'In Progress', value: stats.inProgress, color: 'text-blue-500', icon: Clock },
    { label: 'Blocked', value: stats.blocked, color: 'text-red-500', icon: AlertCircle },
    { label: 'Overdue', value: stats.overdue, color: 'text-orange-500', icon: ArrowRight },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen font-sans text-gray-800 bg-gradient-to-br from-indigo-50 to-violet-100"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-r from-purple-700 to-indigo-800 shadow-2xl p-8 text-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-2"
            >
              Today's Focus
              <Sparkles className="inline-block w-8 h-8 ml-2 text-purple-200" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-purple-200"
            >
              {formatDate()}
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0, duration: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 sm:mt-0 inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-base font-semibold rounded-2xl hover:bg-white/30 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Task
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {statItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -3 }}
                  className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                    <item.icon className={`w-6 h-6 ${item.color} opacity-70`} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg"
            >
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                  Today's Tasks ({todaysTasks.length})
                </h2>
              </div>
              
              <div className="p-6">
                {tasksByPriority.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                  >
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      All caught up!
                    </h3>
                    <p className="text-gray-500">
                      No tasks scheduled for today.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {tasksByPriority.map((task, index) => {
                        const actionButtons = (
                          <div className="flex space-x-1">
                            {task.status === 'in-progress' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateTaskStatus(task.id, 'todo')}
                                className="p-1 bg-gray-100 text-gray-600 rounded-full shadow-sm hover:bg-gray-200 transition-colors"
                                title="Pause task"
                              >
                                <Pause className="w-4 h-4" />
                              </motion.button>
                            )}
                            
                            {task.status !== 'done' && task.status !== 'in-progress' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateTaskStatus(task.id, 'in-progress')}
                                className="p-1 bg-blue-100 text-blue-600 rounded-full shadow-sm hover:bg-blue-200 transition-colors"
                                title="Start task"
                              >
                                <Play className="w-4 h-4" />
                              </motion.button>
                            )}
                            
                            {task.status !== 'done' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateTaskStatus(task.id, 'done')}
                                className="p-1 bg-green-100 text-green-600 rounded-full shadow-sm hover:bg-green-200 transition-colors"
                                title="Mark as done"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        );

                        return (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <TaskCard
                              task={task}
                              actions={actionButtons}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-purple-500" />
                Quick Note
              </h3>
              <div className="space-y-4">
                <textarea
                  placeholder="Add a note about your progress..."
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  rows={4}
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addQuickNote}
                  disabled={!quickNote.trim()}
                  className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Note
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-500" />
                Today's Goals
              </h3>
              <ul className="space-y-3">
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-3" />
                  <span className="text-gray-700">Complete 3 high-priority tasks</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <Clock className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-700">Review blocked items</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <Clock className="w-4 h-4 text-gray-500 mr-3" />
                  <span className="text-gray-700">Update task estimates</span>
                </motion.li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}