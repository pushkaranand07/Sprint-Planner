import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Sparkles, Search } from 'lucide-react';

// Utility functions to replace date-fns
const format = (date: Date, formatStr: string) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (formatStr === 'MMMM yyyy') return `${months[date.getMonth()]} ${date.getFullYear()}`;
  if (formatStr === 'MMM dd') return `${shortMonths[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`;
  if (formatStr === 'EEE') return shortDays[date.getDay()];
  if (formatStr === 'dd') return date.getDate().toString().padStart(2, '0');
  if (formatStr === 'd') return date.getDate().toString();
  if (formatStr === 'yyyy') return date.getFullYear().toString();
  return date.toLocaleDateString();
};

const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const subMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() - months);
  return result;
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const eachDayOfInterval = ({ start, end }: { start: Date, end: Date }) => {
  const days = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.toDateString() === date2.toDateString();
};

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  estimate: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user flow for checkout',
    description: 'Create a comprehensive user flow diagram for the e-commerce checkout process, including edge cases and error states.',
    status: 'in-progress',
    estimate: 8,
    dueDate: '2025-08-20T12:00:00Z',
    createdAt: '2025-08-15T09:00:00Z',
    updatedAt: '2025-08-18T10:30:00Z'
  },
  {
    id: '2',
    title: 'Implement authentication API',
    description: 'Develop and test the RESTful API endpoints for user login, registration, and password reset. Use JWT for token management.',
    status: 'in-progress',
    estimate: 13,
    dueDate: '2025-08-21T17:00:00Z',
    createdAt: '2025-08-16T14:00:00Z',
    updatedAt: '2025-08-20T11:00:00Z'
  },
  {
    id: '3',
    title: 'Write blog post on React hooks',
    description: 'Draft a 1500-word blog post explaining the useEffect and useState hooks with practical code examples for new developers.',
    status: 'done',
    estimate: 5,
    dueDate: '2025-08-20T09:00:00Z',
    createdAt: '2025-08-17T11:00:00Z',
    updatedAt: '2025-08-20T08:00:00Z'
  },
  {
    id: '4',
    title: 'Review PR for frontend components',
    description: 'Code review a pull request that adds new UI components to the dashboard. Check for code quality, responsiveness, and accessibility.',
    status: 'todo',
    estimate: 3,
    dueDate: '2025-08-22T10:00:00Z',
    createdAt: '2025-08-18T16:00:00Z',
    updatedAt: '2025-08-18T16:00:00Z'
  },
  {
    id: '5',
    title: 'Migrate database to new server',
    description: 'Plan and execute the migration of the production database to a new, more powerful server. Minimize downtime during the process.',
    status: 'todo',
    estimate: 21,
    dueDate: '2025-08-25T14:00:00Z',
    createdAt: '2025-08-19T09:00:00Z',
    updatedAt: '2025-08-19T09:00:00Z'
  },
  {
    id: '6',
    title: 'Set up CI/CD pipeline',
    description: 'Configure a continuous integration and continuous deployment pipeline using GitHub Actions to automate testing and deployment.',
    status: 'in-progress',
    estimate: 8,
    dueDate: '2025-08-23T11:00:00Z',
    createdAt: '2025-08-18T10:00:00Z',
    updatedAt: '2025-08-20T12:00:00Z'
  },
  {
    id: '7',
    title: 'Create marketing campaign assets',
    description: 'Design visual assets (banners, social media graphics) for the new product launch marketing campaign.',
    status: 'in-progress',
    estimate: 5,
    dueDate: '2025-08-21T10:00:00Z',
    createdAt: '2025-08-19T13:00:00Z',
    updatedAt: '2025-08-20T15:00:00Z'
  },
  {
    id: '8',
    title: 'Refactor old codebase module',
    description: 'Refactor the legacy user profile module to follow modern best practices and improve readability and maintainability.',
    status: 'todo',
    estimate: 13,
    dueDate: '2025-08-24T16:00:00Z',
    createdAt: '2025-08-20T09:00:00Z',
    updatedAt: '2025-08-20T09:00:00Z'
  },
  {
    id: '9',
    title: 'User interviews for feedback',
    description: 'Schedule and conduct 5 user interviews to gather feedback on the new dashboard features and identify pain points.',
    status: 'todo',
    estimate: 3,
    dueDate: '2025-08-26T12:00:00Z',
    createdAt: '2025-08-20T10:00:00Z',
    updatedAt: '2025-08-20T10:00:00Z'
  },
  {
    id: '10',
    title: 'Launch a new feature',
    description: 'Launch the new chat feature for our mobile app after it is tested properly.',
    status: 'todo',
    estimate: 21,
    dueDate: '2025-08-28T12:00:00Z',
    createdAt: '2025-08-20T10:00:00Z',
    updatedAt: '2025-08-20T10:00:00Z'
  }
];

const TaskCard = ({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, newStatus: Task['status']) => void; }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-200 text-gray-700';
      case 'in-progress': return 'bg-yellow-200 text-yellow-800';
      case 'done': return 'bg-green-200 text-green-800';
    }
  };

  const statusEmojis = {
    'todo': '⚪️',
    'in-progress': '🟡',
    'done': '🟢'
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  return (
    <div
      className="p-4 bg-white rounded-xl shadow-md border border-gray-100 cursor-grab active:cursor-grabbing transition-all hover:shadow-lg hover:-translate-y-1"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-800 truncate">{task.title}</h4>
      </div>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const CustomDatePicker = ({ selectedDate, onDateChange, onCancel }: { selectedDate: Date, onDateChange: (date: Date) => void, onCancel: () => void }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth(currentMonth);
  const firstDay = days[0];
  const paddingDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl shadow-2xl bg-white text-gray-800 border border-gray-200 w-64 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <span className="font-semibold text-lg">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={nextMonth} className="p-1 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <span key={day} className="font-medium text-gray-500">{day}</span>
        ))}
        {Array.from({ length: paddingDays }).map((_, i) => (
          <div key={`pad-${i}`} className="w-8 h-8"></div>
        ))}
        {days.map((day) => (
          <button 
            key={day.toISOString()}
            onClick={() => onDateChange(day)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200
              ${isSameDay(day, selectedDate) ? 'bg-purple-600 text-white font-bold' : ''}
              ${isSameDay(day, new Date()) ? 'ring-2 ring-purple-400 ring-offset-1' : ''}
              hover:bg-gray-100
            `}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function Timeline() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getWeekDays = useMemo(() => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  }, [selectedDate]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  const tasksForWeek = useMemo(() => {
    return getWeekDays.map(date => {
      const dayTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });
      return { date, tasks: dayTasks };
    });
  }, [getWeekDays, filteredTasks]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const newDueDate = targetDate.toISOString();
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, dueDate: newDueDate, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const getTotalEstimate = (dayTasks: Task[]) => {
    return dayTasks.reduce((sum, task) => sum + task.estimate, 0);
  };

  const getWorkloadColor = (estimate: number) => {
    if (estimate === 0) return 'bg-white/50 border-gray-200';
    if (estimate <= 5) return 'bg-green-500/10 border-green-300';
    if (estimate <= 10) return 'bg-yellow-500/10 border-yellow-300';
    return 'bg-red-500/10 border-red-300';
  };

  const formatDateHeader = () => {
    const start = getWeekDays[0];
    const end = getWeekDays[6];
    
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMMM yyyy')} | ${format(start, 'dd')} - ${format(end, 'dd')}`;
    } else {
      return `${format(start, 'MMM dd')} - ${format(end, 'MMM dd')} ${format(end, 'yyyy')}`;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 overflow-hidden bg-gray-50 relative">
      <header className="bg-gradient-to-r from-fuchsia-900 to-violet-500 shadow-xl p-8 md:p-12 text-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Timeline
            <Sparkles className="inline-block w-8 h-8 md:w-12 md:h-12 ml-2 text-purple-200 animate-pulse" />
          </h1>
          <p className="mt-2 text-sm md:text-base text-purple-100 opacity-80 max-w-2xl">
            Visualize and manage your tasks. Drag and drop to reschedule, or click on a task to change its status.
          </p>
        </div>
      </header>

      <div className="p-4 md:p-8 -mt-20 relative z-20 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between p-4 md:p-6 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-purple-600 hover:bg-purple-50 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="text-center w-48">
              <h2 className="text-lg md:text-xl font-semibold">
                {formatDateHeader()}
              </h2>
              <p className="text-xs md:text-sm opacity-75">
                {filteredTasks.filter(task => task.dueDate && getWeekDays.some(day => 
                  new Date(task.dueDate!).toDateString() === day.toDateString()
                )).length} tasks
              </p>
            </div>
            
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-purple-600 hover:bg-purple-50 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full md:w-48 pl-10 pr-4 py-2 rounded-full shadow-inner bg-gray-100 text-gray-800 border-gray-300 transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>

            <div className="relative w-full md:w-auto">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-full shadow-inner bg-gray-100 text-gray-800 border-gray-300 transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <Calendar className="w-4 h-4" />
                <span>Jump to Date</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {tasksForWeek.map(({ date, tasks: dayTasks }, index) => {
            const totalEstimate = getTotalEstimate(dayTasks);
            const workloadColor = getWorkloadColor(totalEstimate);
            
            return (
              <div
                key={date.toISOString()}
                className={`rounded-2xl shadow-lg border backdrop-blur-sm transform origin-top transition-all duration-300 ${workloadColor} border-gray-200 ${
                  isToday(date) ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-white/50' : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, date)}
              >
                <div className={`p-4 border-b border-gray-200 transition-colors duration-500 ${isToday(date) ? 'bg-purple-50' : 'bg-white/50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold text-sm ${isToday(date) ? 'text-purple-900' : 'text-gray-900'} transition-colors duration-300`}>
                        {format(date, 'EEE')}
                      </h3>
                      <p className={`text-xl font-bold ${isToday(date) ? 'text-purple-700' : 'text-gray-700'} transition-colors duration-300`}>
                        {format(date, 'dd')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="p-3 space-y-3 min-h-64 transition-all duration-300">
                  {dayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={(taskId, newStatus) => {
                        setTasks(prev => prev.map(t => 
                          t.id === taskId 
                            ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
                            : t
                        ));
                      }}
                    />
                  ))}
                  
                  {dayTasks.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tasks</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl p-5 shadow-lg bg-white/80 backdrop-blur-md border border-gray-200">
          <h3 className="text-sm font-semibold mb-3">Workload Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded mr-2 bg-white/50 border-gray-200"></div>
              <span className="text-gray-600">No tasks</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500/10 border border-green-300 rounded mr-2"></div>
              <span className="text-gray-600">Light (1-5 pts)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500/10 border border-yellow-300 rounded mr-2"></div>
              <span className="text-gray-600">Medium (6-10 pts)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500/10 border border-red-300 rounded mr-2"></div>
              <span className="text-gray-600">Heavy (11+ pts)</span>
            </div>
          </div>
        </div>
      </div>

      {showDatePicker && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDatePicker(false)}
          />
          <CustomDatePicker
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onCancel={() => setShowDatePicker(false)}
          />
        </>
      )}
    </div>
  );
}