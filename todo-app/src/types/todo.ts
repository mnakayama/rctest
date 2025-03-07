export type Priority = 'low' | 'medium' | 'high';

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  categoryId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type TodoFilter = {
  completed?: boolean;
  priority?: Priority;
  categoryId?: string;
  searchQuery?: string;
};

export type SortOption = 'dueDate' | 'priority' | 'created' | 'title';
export type SortDirection = 'asc' | 'desc';

export type TodoSort = {
  option: SortOption;
  direction: SortDirection;
};
