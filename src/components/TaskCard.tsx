import React, { useState } from 'react';
import { Task } from '../types';
import { 
  AlertCircle, 
  Clock, 
  User, 
  Calendar,
  Tag,
  CheckCircle,
  ArrowRight,
  MoreVertical
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onPriorityChange?: (taskId: string, newPriority: Task['priority']) => void;
  draggable?: boolean;
  onClick?: () => void;
}

const priorityConfig = {
  urgent: { color: 'bg-gradient-to-r from-red-500 to-pink-600 text-white', icon: AlertCircle },
  high: { color: 'bg-gradient-to-r from-orange-500 to-red-500 text-white', icon: AlertCircle },
  medium: { color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white', icon: Clock },
  low: { color: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white', icon: Clock },
};

const statusConfig = {
  'todo': { color: 'bg-gradient-to-r from-gray-600 to-gray-800 text-white', label: 'To Do' },
  'in-progress': { color: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white', label: 'In Progress' },
  'done': { color: 'bg-gradient-to-r from-green-600 to-emerald-700 text-white', label: 'Done' },
  'blocked': { color: 'bg-gradient-to-r from-rose-600 to-red-700 text-white', label: 'Blocked' },
};

export default function TaskCard({ task, onStatusChange, draggable = true, onClick }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const priorityInfo = priorityConfig[task.priority];
  const statusInfo = statusConfig[task.status];
  const PriorityIcon = priorityInfo.icon;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 p-4 mb-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
      draggable={draggable}
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${priorityInfo.color} shadow-md`}>
            <PriorityIcon className="w-3 h-3 mr-1" />
            {task.priority}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} shadow-md`}>
            {statusInfo.label}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200/50">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 text-lg tracking-tight">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'} transition-colors duration-200`}>
          <Calendar className="w-4 h-4 mr-1" />
          <span className={isOverdue ? 'animate-pulse' : ''}>
            {formatDate(task.dueDate)}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500 bg-gray-100/70 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-gray-200/60">
          <Clock className="w-4 h-4 mr-1" />
          {task.estimate}h
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center bg-gray-100/70 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-gray-200/60">
          <User className="w-4 h-4 text-gray-600 mr-1" />
          <span className="text-xs text-gray-600 font-medium">{task.assignee}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {task.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200/50 transition-all duration-200 hover:from-purple-200 hover:to-indigo-200 hover:scale-105">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between pt-3 border-t border-gray-200/50">
        <button
          onClick={() => onStatusChange && onStatusChange(task.id, 'done')}
          className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Mark Done
        </button>
        <button
          onClick={() => {
            // Logic to move to next sprint would go here
          }}
          className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <ArrowRight className="w-4 h-4 mr-1" />
          Next Sprint
        </button>
      </div>
    </div>
  );
}