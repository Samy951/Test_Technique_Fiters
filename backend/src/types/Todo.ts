// Énumération des priorités
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Énumération des statuts Kanban
export enum TodoStatus {
  TODO = 'todo',
  PROGRESS = 'progress', 
  DONE = 'done'
}

// Interface pour une tâche complète
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

// Interface pour créer une nouvelle tâche (sans les champs auto-générés)
export interface CreateTodoData {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date | null;
  status?: TodoStatus;
}

// Interface pour mettre à jour une tâche (tous les champs optionnels)
export interface UpdateTodoData {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date | null;
  status?: TodoStatus;
}

// Interface pour les réponses d'erreur
export interface ErrorResponse {
  error: string;
  details?: string;
} 