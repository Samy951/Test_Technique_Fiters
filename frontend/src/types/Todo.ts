// Types partagés avec le backend - EXACT COPIE
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TodoStatus {
  TODO = 'todo',
  PROGRESS = 'progress', 
  DONE = 'done'
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date | null;
  status?: TodoStatus;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date | null;
  status?: TodoStatus;
}

export interface KanbanColumn {
  id: TodoStatus;
  title: string;
  todos: Todo[];
  color: string;
}

// Utilitaire pour regrouper les todos par statut (maintenant simple)
export const groupTodosByStatus = (todos: Todo[]): Record<TodoStatus, Todo[]> => {
  return {
    todo: todos.filter(todo => todo.status === TodoStatus.TODO),
    progress: todos.filter(todo => todo.status === TodoStatus.PROGRESS),
    done: todos.filter(todo => todo.status === TodoStatus.DONE)
  };
} 