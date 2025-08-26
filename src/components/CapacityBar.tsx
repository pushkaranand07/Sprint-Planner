import React from 'react';
import { motion } from 'framer-motion';
import { SprintCapacity } from '../types';

interface CapacityBarProps {
  capacity: SprintCapacity;
  title: string;
}

export default function CapacityBar({ capacity, title }: CapacityBarProps) {
  const percentage = Math.min((capacity.committed / capacity.capacity) * 100, 100);
  const overCapacity = capacity.committed > capacity.capacity;
  
  const getBarColor = () => {
    if (overCapacity) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (overCapacity) return 'text-red-700';
    if (percentage >= 80) return 'text-orange-700';
    return 'text-green-700';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {capacity.committed} / {capacity.capacity} {capacity.unit}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${getBarColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {overCapacity ? (
          <span className="text-red-600 font-medium">
            Over capacity by {capacity.committed - capacity.capacity} {capacity.unit}
          </span>
        ) : percentage >= 80 ? (
          <span className="text-orange-600">
            {(100 - percentage).toFixed(0)}% capacity remaining
          </span>
        ) : (
          <span className="text-gray-600">
            {(100 - percentage).toFixed(0)}% capacity available
          </span>
        )}
      </div>
    </div>
  );
}