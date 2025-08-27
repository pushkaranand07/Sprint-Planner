import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTasks } from './data/mockTasks';
import { Task } from './types';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Users,
  Download,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const mockData = {
  tasks: [
    { id: '1', title: 'Design landing page hero section', status: 'done', dueDate: '2023-08-15', assignee: 'John Doe', estimate: 8, priority: 'high', sprint: 'this-week', updatedAt: '2023-08-15' },
    { id: '2', title: 'Implement user authentication flow', status: 'in-progress', dueDate: '2023-08-20', assignee: 'Jane Smith', estimate: 12, priority: 'urgent', sprint: 'this-week', updatedAt: '2023-08-10' },
    { id: '3', title: 'Write API documentation', status: 'done', dueDate: '2023-08-16', assignee: 'John Doe', estimate: 5, priority: 'medium', sprint: 'this-week', updatedAt: '2023-08-16' },
    { id: '4', title: 'Set up database schema', status: 'blocked', dueDate: '2023-08-22', assignee: 'Jane Smith', estimate: 10, priority: 'urgent', sprint: 'this-week', updatedAt: '2023-08-11' },
    { id: '5', title: 'Review marketing copy', status: 'done', dueDate: '2023-08-17', assignee: 'Peter Jones', estimate: 3, priority: 'low', sprint: 'this-week', updatedAt: '2023-08-17' },
    { id: '6', title: 'Optimize image assets', status: 'in-progress', dueDate: '2023-08-25', assignee: 'John Doe', estimate: 6, priority: 'medium', sprint: 'next-week', updatedAt: '2023-08-14' },
    { id: '7', title: 'Prepare Q3 financial report', status: 'done', dueDate: '2023-08-18', assignee: 'Peter Jones', estimate: 15, priority: 'high', sprint: 'this-week', updatedAt: '2023-08-18' },
    { id: '8', title: 'Integrate payment gateway', status: 'in-progress', dueDate: '2023-08-30', assignee: 'Jane Smith', estimate: 20, priority: 'urgent', sprint: 'next-week', updatedAt: '2023-08-12' },
    { id: '9', title: 'Debug login form issue', status: 'done', dueDate: '2023-08-19', assignee: 'John Doe', estimate: 4, priority: 'high', sprint: 'this-week', updatedAt: '2023-08-19' },
    { id: '10', title: 'Update documentation for new API endpoints', status: 'in-progress', dueDate: '2023-08-28', assignee: 'Peter Jones', estimate: 7, priority: 'medium', sprint: 'next-week', updatedAt: '2023-08-13' },
    { id: '11', title: 'Create user dashboard wireframes', status: 'done', dueDate: '2023-08-20', assignee: 'Jane Smith', estimate: 9, priority: 'high', sprint: 'this-week', updatedAt: '2023-08-20' },
  ],
};

export default function Reports() {
  const [tasks] = useState<Task[]>(mockData.tasks);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const blockedTasks = tasks.filter(task => task.status === 'blocked').length;
    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const thisWeekTasks = tasks.filter(task => task.sprint === 'this-week');
    const thisWeekCompleted = thisWeekTasks.filter(task => task.status === 'done').length;
    const thisWeekPlanned = thisWeekTasks.length;
    const sprintProgress = thisWeekPlanned > 0 ? (thisWeekCompleted / thisWeekPlanned) * 100 : 0;

    const completedPoints = tasks
      .filter(task => task.status === 'done')
      .reduce((sum, task) => sum + task.estimate, 0);
    const velocity = completedPoints;

    const priorityStats = {
      urgent: tasks.filter(task => task.priority === 'urgent').length,
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
    };

    const assigneeStats = tasks.reduce((acc, task) => {
      if (task.assignee) {
        acc[task.assignee] = (acc[task.assignee] || 0) + task.estimate;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      blockedTasks,
      overdueTasks,
      completionRate,
      sprintProgress,
      velocity,
      priorityStats,
      assigneeStats,
    };
  }, [tasks, timeframe]);

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  const handlePriorityClick = (priority: string) => {
    setSelectedPriority(priority);
    setSelectedStatus(null);
    setIsModalOpen(true);
  };

  const filteredTasks = useMemo(() => {
    if (selectedStatus) {
      let statusKey = '';
      if (selectedStatus === 'Completed') statusKey = 'done';
      else if (selectedStatus === 'In Progress') statusKey = 'in-progress';
      else if (selectedStatus === 'Blocked') statusKey = 'blocked';
      else if (selectedStatus === 'Overdue') {
        return tasks.filter(
          task => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
        );
      }
      return tasks.filter(task => task.status === statusKey);
    }
    if (selectedPriority) {
      return tasks.filter(task => task.priority === selectedPriority.toLowerCase());
    }
    return [];
  }, [selectedStatus, selectedPriority, tasks]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend,
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    trend?: string;
    subtitle?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.03, rotate: 0.5 }}
      whileTap={{ scale: 0.98 }}
      className="p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] bg-white/95 border border-gray-100 transform-gpu"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
            )}
          </div>
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.1 }}
            className={`p-3 rounded-xl ${color} shadow-md group-hover:shadow-lg transition-shadow`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        {trend && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center text-sm"
          >
            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-medium">{trend}</span>
            <span className="text-gray-400 ml-1">vs last period</span>
          </motion.div>
        )}
      </div>
      <Sparkles className="absolute top-4 right-4 w-5 h-5 text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen font-sans text-gray-800 overflow-hidden bg-gray-50"
    >
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
              className="text-4xl md:text-5xl font-extrabold flex items-center"
            >
              <motion.div 
                className="p-2 bg-white/20 border border-white rounded-xl mr-4"
                whileHover={{ rotate: 5 }}
              >
                <BarChart3 className="w-7 h-7 text-white" />
              </motion.div>
              Reports & Analytics
              <Sparkles className="inline-block w-8 h-8 ml-2 text-purple-200 animate-pulse" />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 text-sm text-purple-100"
            >
              Insights into your team's performance and progress
            </motion.p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="flex bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-gray-200 shadow-inner">
              {(['week', 'month', 'quarter'] as const).map((period) => (
                <motion.button
                  key={period}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 capitalize ${
                    timeframe === period
                      ? 'bg-white text-gray-800 shadow-md'
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {period}
                </motion.button>
              ))}
            </div>
            
            <motion.div className="relative">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 255, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white text-white text-base font-semibold rounded-2xl hover:bg-opacity-30 transition-all duration-500 shadow-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
                <ChevronDown className={`w-5 h-5 ml-2 transform transition-transform ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <AnimatePresence>
                {isExportDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                  >
                    <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      Export as PDF
                    </button>
                    <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      Export as CSV
                    </button>
                    <button className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                      Export as Image
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          <StatCard
            title="Total Tasks"
            value={analytics.totalTasks}
            icon={Target}
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
            trend="+12%"
          />
          <StatCard
            title="Completion Rate"
            value={`${Math.round(analytics.completionRate)}%`}
            icon={CheckCircle2}
            color="bg-gradient-to-r from-emerald-500 to-green-500"
            trend="+5%"
          />
          <StatCard
            title="Sprint Progress"
            value={`${Math.round(analytics.sprintProgress)}%`}
            icon={Calendar}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            subtitle="This week"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="p-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg mr-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                Task Status Distribution
              </h3>
              <div className="space-y-4">
                {[
                  { status: 'Completed', count: analytics.completedTasks, color: 'bg-gradient-to-r from-emerald-500 to-green-500' },
                  { status: 'In Progress', count: analytics.inProgressTasks, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
                  { status: 'Blocked', count: analytics.blockedTasks, color: 'bg-gradient-to-r from-rose-500 to-red-500' },
                  { status: 'Overdue', count: analytics.overdueTasks, color: 'bg-gradient-to-r from-amber-500 to-orange-500' }
                ].map((item, index) => (
                  <motion.div 
                    key={item.status}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow backdrop-blur-sm cursor-pointer"
                    onClick={() => handleStatusClick(item.status)}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 ${item.color} rounded-full mr-3 shadow-sm`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.status}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="p-1.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg mr-3">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                Priority Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(analytics.priorityStats).map(([priority, count], index) => {
                  const colors = {
                    urgent: 'bg-gradient-to-r from-rose-500 to-red-500',
                    high: 'bg-gradient-to-r from-amber-500 to-orange-500',
                    medium: 'bg-gradient-to-r from-yellow-400 to-amber-400',
                    low: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                  };
                  
                  return (
                    <motion.div 
                      key={priority}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow backdrop-blur-sm cursor-pointer"
                      onClick={() => handlePriorityClick(priority.charAt(0).toUpperCase() + priority.slice(1))}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${colors[priority as keyof typeof colors]} rounded-full mr-3 shadow-sm`}></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="p-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mr-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              Team Workload
            </h3>
            <div className="space-y-5">
              {Object.entries(analytics?.assigneeStats || {}).map(([assignee, points], index) => {
                const maxPoints = Math.max(...Object.values(analytics?.assigneeStats || {}));
                const progressPercentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
                return (
                  <motion.div 
                    key={assignee}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center w-full"
                  >
                    <span className="text-sm font-medium text-gray-700 min-w-[100px] max-w-[100px] truncate">{assignee}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2, type: "spring" }}
                          className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md" 
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 min-w-[50px] text-right">{Math.round(progressPercentage)}%</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="p-1.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg mr-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {tasks
                .filter(task => task.status === 'done')
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 5)
                .map((task, index) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 rounded-xl border border-green-100 hover:shadow-md transition-all backdrop-blur-sm"
                  >
                    <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Completed by {task.assignee} • {new Date(task.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                {selectedStatus
                  ? `${selectedStatus} Tasks`
                  : selectedPriority
                    ? `${selectedPriority} Priority Tasks`
                    : 'Tasks'}
              </h2>
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStatus(null);
                  setSelectedPriority(null);
                }}
              >
                ×
              </button>
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {filteredTasks.length === 0 && (
                  <li className="text-gray-500 text-sm">No tasks found.</li>
                )}
                {filteredTasks.map(task => (
                  <li key={task.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-gray-500">
                      Assignee: {task.assignee} | Due: {task.dueDate}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}