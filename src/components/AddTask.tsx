import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Tag, Plus, CheckCircle, Trash2 } from 'lucide-react';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  subtasks: Subtask[];
}

interface AddTaskProps {
  onClose: () => void;
  onAddTask: (taskData: TaskFormData) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onClose, onAddTask }) => {
  const [taskData, setTaskData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    category: '',
    subtasks: [],
  });
  const [newSubtask, setNewSubtask] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtask,
        completed: false,
      };
      setTaskData(prev => ({ ...prev, subtasks: [...prev.subtasks, subtask] }));
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setTaskData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskData.title.trim()) {
      onAddTask(taskData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Create a New Task</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              required
              placeholder="What needs to be done?"
              className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe your task in detail..."
              className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            <div>
              <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
                Due Time
              </label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={taskData.dueTime}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={taskData.priority}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={taskData.category}
              onChange={handleInputChange}
              placeholder="e.g., Work, Personal, Shopping"
              className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <ul className="mt-4 space-y-2">
              {taskData.subtasks.map((subtask) => (
                <motion.li
                  key={subtask.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between bg-gray-200 py-2 px-4 rounded-xl text-sm"
                >
                  <span className="text-gray-700">{subtask.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 text-base font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-xl"
            >
              Add Task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTask;