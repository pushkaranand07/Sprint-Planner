import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Clock, Sparkles, Target, Zap, Lightbulb, TrendingUp, Sun, ChevronRight, BarChart3 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  estimate: number;
  sprint: 'next-week' | 'backlog';
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  updatedAt: string;
}

interface SprintCapacity {
  committed: number;
  capacity: number;
  unit: string;
}

const mockTasks: Task[] = [
  { id: '1', title: 'Design homepage wireframes', estimate: 8, sprint: 'next-week', status: 'todo', priority: 'high', updatedAt: new Date().toISOString() },
  { id: '2', title: 'Develop user authentication module', estimate: 13, sprint: 'next-week', status: 'in-progress', priority: 'urgent', updatedAt: new Date().toISOString() },
  { id: '3', title: 'Write API documentation', estimate: 5, sprint: 'backlog', status: 'todo', priority: 'medium', updatedAt: new Date().toISOString() },
  { id: '4', title: 'Implement search functionality', estimate: 8, sprint: 'backlog', status: 'todo', priority: 'high', updatedAt: new Date().toISOString() },
  { id: '5', title: 'Fix critical bug in payment gateway', estimate: 3, sprint: 'backlog', status: 'todo', priority: 'urgent', updatedAt: new Date().toISOString() },
  { id: '6', title: 'Refactor old codebase', estimate: 21, sprint: 'backlog', status: 'todo', priority: 'low', updatedAt: new Date().toISOString() },
  { id: '7', title: 'Setup CI/CD pipeline', estimate: 5, sprint: 'backlog', status: 'todo', priority: 'high', updatedAt: new Date().toISOString() },
];

const TaskCard = ({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, status: 'todo' | 'in-progress' | 'done') => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const priorityColors = {
    urgent: 'bg-gradient-to-r from-red-500 to-pink-600',
    high: 'bg-gradient-to-r from-amber-500 to-orange-500',
    medium: 'bg-gradient-to-r from-yellow-400 to-amber-400',
    low: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  };

  const statusColors = {
    todo: 'bg-gray-400',
    'in-progress': 'bg-blue-500',
    done: 'bg-green-500',
  };

  return (
    <motion.div
      layout
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.5}
      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white/95 border border-gray-100 transform-gpu cursor-grab active:cursor-grabbing"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <motion.h4
            layout="position"
            className="text-lg font-semibold text-gray-900 mb-2 truncate"
          >
            {task.title}
          </motion.h4>
          <motion.p
            layout="position"
            className="text-sm text-gray-600"
          >
          </motion.p>
        </div>
        <div className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${priorityColors[task.priority]} uppercase ml-4`}>
          <motion.div
            layout="position"
            className="px-2 py-0.5"
          >
            {task.priority}
          </motion.div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <AnimatePresence mode="wait">
          {isHovered ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2 overflow-hidden"
            >
              <button
                onClick={() => onStatusChange(task.id, 'todo')}
                className="flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Clock className="w-4 h-4 mr-1" /> To Do
              </button>
              <button
                onClick={() => onStatusChange(task.id, 'in-progress')}
                className="flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                <Zap className="w-4 h-4 mr-1" /> In Progress
              </button>
              <button
                onClick={() => onStatusChange(task.id, 'done')}
                className="flex items-center text-xs font-medium px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              >
                <Target className="w-4 h-4 mr-1" /> Done
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center text-sm text-gray-500"
            >
              <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColors[task.status]}`}>
                {task.status.replace('-', ' ')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const SprintProgress = ({ capacity }: { capacity: SprintCapacity }) => {
  const percentage = (capacity.committed / capacity.capacity) * 100;
  
  return (
    <motion.div 
      className="rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200 p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl mr-4">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Sprint Progress</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700"></span>
          <span className="text-sm font-medium text-gray-700">{Math.min(100, Math.round(percentage))}%</span>
        </div>
        <div className="relative w-full h-3 rounded-full bg-gray-200 overflow-hidden">
          <motion.div 
            className="absolute h-full rounded-full bg-gradient-to-r from-fuchsia-900 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function NextWeek() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [capacity, setCapacity] = useState<SprintCapacity>({
    committed: 0,
    capacity: 24,
    unit: 'points'
  });

  const nextWeekTasks = useMemo(() => {
    return tasks.filter(task => task.sprint === 'next-week');
  }, [tasks]);

  const updateCapacity = () => {
    const committed = nextWeekTasks.reduce((sum, task) => sum + task.estimate, 0);
    setCapacity(prev => ({ ...prev, committed }));
  };

  useEffect(() => {
    updateCapacity();
  }, [nextWeekTasks]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-violet-400', 'shadow-inner');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-violet-400', 'shadow-inner');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-violet-400', 'shadow-inner');
    const taskId = e.dataTransfer.getData('text/plain');

    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, sprint: 'next-week', updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const suggestedTasks = useMemo(() => {
    return tasks
      .filter(task =>
        task.sprint === 'backlog' &&
        task.status === 'todo' &&
        (task.priority === 'urgent' || task.priority === 'high')
      )
      .slice(0, 3);
  }, [tasks]);

  const moveTaskToNextWeek = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, sprint: 'next-week', updatedAt: new Date().toISOString() }
        : task
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen font-sans text-gray-800 overflow-hidden bg-gradient-to-br from-fuchsia-50/50 to-violet-50/50"
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
              Next Week Planning
              <Sparkles className="inline-block w-8 h-8 ml-2 text-purple-200 animate-pulse" />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 text-sm text-purple-100 flex items-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium text-white">
                {nextWeekTasks.length} tasks planned for Jan 22–28, 2025
              </span>
            </motion.p>
          </div>
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* Main Tasks Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Bar */}
          <SprintProgress capacity={capacity} />

          {/* Tasks Drop Zone */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 shadow-2xl overflow-hidden min-h-[36rem] p-8 transition-colors duration-300"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50/50 to-violet-50/50 opacity-50"></div>
            <div className="relative z-10 text-center mb-10">
              <motion.div 
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl shadow-inner mb-4"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Sun className="w-10 h-10 text-violet-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Next Week Sprint</h3>
              <p className="text-md text-gray-600 max-w-lg mx-auto">
                Drag and drop tasks here to start planning or pick from the suggested tasks on the right.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {nextWeekTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -30 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: index * 0.05
                    }}
                    layout
                  >
                    <TaskCard
                      task={task}
                      onStatusChange={(taskId, newStatus) => {
                        setTasks(prev => prev.map(t =>
                          t.id === taskId
                            ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
                            : t
                        ));
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {nextWeekTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center py-24"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl shadow-inner mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Target className="w-12 h-12 text-violet-600" />
                </motion.div>
                <p className="text-xl text-gray-600 mb-8">No tasks planned for next week yet</p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(125, 59, 218, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-fuchsia-900 to-violet-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add First Task
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="space-y-8">
          {/* Auto-planning Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6"
          >
            <div className="flex items-center mb-5">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Suggested Tasks</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              High-priority tasks from your backlog that fit well in next week's capacity
            </p>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {suggestedTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: index * 0.05
                    }}
                    whileHover={{ y: -4, boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}
                    className="border border-gray-200/60 rounded-xl p-4 bg-white/60 hover:bg-white transition-all duration-300 cursor-pointer"
                    onClick={() => moveTaskToNextWeek(task.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-md font-semibold text-gray-900 truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                            }`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                          </span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
                        whileTap={{ scale: 0.9 }}
                        className="ml-4 p-2 text-violet-600 hover:text-violet-700 hover:bg-violet-100 rounded-lg transition-all duration-200"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {suggestedTasks.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-6">
                  No suggestions available
                </p>
              )}
            </div>

            {suggestedTasks.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(125, 59, 218, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-fuchsia-900 to-violet-500 text-white text-md font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                onClick={() => {
                  suggestedTasks.forEach(task => moveTaskToNextWeek(task.id));
                }}
              >
                <Zap className="w-5 h-5 mr-2" />
                Add All Suggestions
              </motion.button>
            )}
          </motion.div>

          {/* Sprint Planning Tips */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6"
          >
            <div className="flex items-center mb-5">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-cyan-100 rounded-xl mr-4">
                <Lightbulb className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Planning Tips</h3>
            </div>
            <ul className="space-y-4 text-sm text-gray-700">
              <motion.li
                className="flex items-start p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-emerald-500 mr-2 text-lg">•</span>
                Keep capacity under 80% for buffer time
              </motion.li>
              <motion.li
                className="flex items-start p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-emerald-500 mr-2 text-lg">•</span>
                Balance high and low priority tasks
              </motion.li>
              <motion.li
                className="flex items-start p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-emerald-500 mr-2 text-lg">•</span>
                Consider dependencies and blockers
              </motion.li>
              <motion.li
                className="flex items-start p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-emerald-500 mr-2 text-lg">•</span>
                Leave time for unexpected urgent work
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}