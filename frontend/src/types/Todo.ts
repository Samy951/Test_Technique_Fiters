// Types partagés avec le backend - EXACT COPIE
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high'
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
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
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date | null;
  completed?: boolean;
}

// Types spécifiques au frontend Kanban
export type TodoStatus = 'todo' | 'progress' | 'done';

export interface KanbanColumn {
  id: TodoStatus;
  title: string;
  todos: Todo[];
  color: string;
}

// Utilitaire pour convertir completed -> status
export const getStatusFromCompleted = (completed: boolean): TodoStatus => {
  return completed ? 'done' : 'todo';
}

// Utilitaire pour regrouper les todos par statut
export const groupTodosByStatus = (todos: Todo[]): Record<TodoStatus, Todo[]> => {
  return {
    todo: todos.filter(todo => !todo.completed),
    progress: [], // Pour l'instant, pas de statut "en cours" dans l'API
    done: todos.filter(todo => todo.completed)
  };
} 