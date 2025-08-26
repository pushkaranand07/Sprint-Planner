export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimate: number;
  assignee?: string;
  dueDate?: string;
  tags: string[];
  sprint: 'backlog' | 'this-week' | 'next-week';
  createdAt: string;
  updatedAt: string;
  isRepeating?: boolean;
  blockerReason?: string;
}

export interface SprintCapacity {
  committed: number;
  capacity: number;
  unit: 'points' | 'hours';
}

export interface FilterState {
  status: string[];
  priority: string[];
  tags: string[];
  assignee: string[];
  dueDateRange: [string, string] | null;
  search: string;
}

export interface SortState {
  field: 'priority' | 'dueDate' | 'updatedAt' | 'estimate';
  direction: 'asc' | 'desc';
  mockTasks: Task[];
}