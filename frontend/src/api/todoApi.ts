import axios, { AxiosError } from 'axios';
import { Todo, CreateTodoData, UpdateTodoData, TodoStatus } from '../types/Todo';

// Configuration de base axios
const api = axios.create({
  baseURL: '/api', // Utilise le proxy Vite vers localhost:5000
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 secondes max
});

// Intercepteur (execution auto) pour transformer les dates string → Date objects
api.interceptors.response.use(
  (response) => {
    // Transformer les champs de date en objets Date
    if (Array.isArray(response.data)) {
      response.data = response.data.map(transformDates);
    } else if (response.data && typeof response.data === 'object') {
      response.data = transformDates(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Gestion d'erreur globale
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper pour transformer les dates et eviter de faire new Date() sur chaque composant
function transformDates(obj: any): any {
  if (!obj) return obj; 
  
  const dateFields = ['createdAt', 'updatedAt', 'dueDate'];
  const transformed = { ...obj }; // Copie de l'objet pour ne pas modifier l'original
  
  dateFields.forEach(field => {
    if (transformed[field] && typeof transformed[field] === 'string') {
      transformed[field] = new Date(transformed[field]);
    }
  });
  
  return transformed;
}

// Interface pour les statistiques
export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  inProgress: number;
}

// API functions
export const todoApi = {
  // Récupérer toutes les tâches
  async getAll(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  // Récupérer une tâche par ID
  async getById(id: string): Promise<Todo> {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  // Créer une nouvelle tâche
  async create(todoData: CreateTodoData): Promise<Todo> {
    // Transformer Date → string pour l'API
    const apiData = {
      ...todoData,
      dueDate: todoData.dueDate?.toISOString() || null
    };
    
    const response = await api.post<Todo>('/todos', apiData);
    return response.data;
  },

  // Mettre à jour une tâche
  async update(id: string, updateData: UpdateTodoData): Promise<Todo> {
    // Transformer Date → string pour l'API
    const apiData = {
      ...updateData,
      dueDate: updateData.dueDate?.toISOString() || null
    };
    
    const response = await api.put<Todo>(`/todos/${id}`, apiData);
    return response.data;
  },

  // Changer le statut d'une tâche (pour le Kanban)
  async changeStatus(id: string, status: TodoStatus): Promise<Todo> {
    const response = await api.patch<Todo>(`/todos/${id}/status`, { status });
    return response.data;
  },

  // Supprimer une tâche
  async delete(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  },

  // Récupérer les statistiques
  async getStats(): Promise<TodoStats> {
    const response = await api.get<TodoStats>('/todos/stats');
    return response.data;
  }
};

// Hook d'erreur pour React
export class TodoApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'TodoApiError';
  }
}

// Wrapper avec gestion d'erreur typée
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>
): Promise<{ data?: T; error?: TodoApiError }> => {
  try {
    const data = await apiCall();
    return { data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError = new TodoApiError(
        error.response?.data?.error || error.message,
        error.response?.status,
        error.response?.data?.details
      );
      return { error: apiError };
    }
    return { error: new TodoApiError('Erreur inconnue') };
  }
}; 