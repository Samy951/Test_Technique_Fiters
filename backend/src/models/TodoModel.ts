import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoData, UpdateTodoData, Priority, TodoStatus } from '../types/Todo';

export class TodoModel {
  private todos: Todo[] = [];

  // Créer une nouvelle tâche (Pattern singleton)
  create(todoData: CreateTodoData): Todo {
    const now = new Date();
    
    const todo: Todo = {
      id: uuidv4(),
      title: todoData.title.trim(),
      description: todoData.description?.trim() || '',
      status: todoData.status || TodoStatus.TODO,
      priority: todoData.priority || Priority.MEDIUM,
      dueDate: todoData.dueDate || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.todos.unshift(todo); // Ajoute au début (plus récent en premier)
    return todo;
  }

  // Récupérer toutes les tâches
  getAll(): Todo[] {
    return [...this.todos]; // Copie pour éviter les mutations externes
  }

  // Récupérer une tâche par ID
  getById(id: string): Todo | null {
    return this.todos.find(todo => todo.id === id) || null;
  }

  // Mettre à jour une tâche
  update(id: string, updateData: UpdateTodoData): Todo | null {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) return null;

    const existingTodo = this.todos[todoIndex];
    const updatedTodo: Todo = {
      ...existingTodo,
      ...(updateData.title !== undefined && { title: updateData.title.trim() }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() }),
      ...(updateData.priority !== undefined && { priority: updateData.priority }),
      ...(updateData.dueDate !== undefined && { dueDate: updateData.dueDate }),
      ...(updateData.status !== undefined && { status: updateData.status }),
      updatedAt: new Date()
    };

    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  // Supprimer une tâche
  delete(id: string): boolean {
    const todoIndex = this.todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) return false;

    this.todos.splice(todoIndex, 1);
    return true;
  }

  // Changer le statut d'une tâche
  changeStatus(id: string, newStatus: TodoStatus): Todo | null {
    return this.update(id, { status: newStatus });
  }

    // Statistiques (bonus pour la démo)
  getStats(): { total: number; completed: number; active: number; inProgress: number } {
    const total = this.todos.length;
    const completed = this.todos.filter(todo => todo.status === TodoStatus.DONE).length;
    const inProgress = this.todos.filter(todo => todo.status === TodoStatus.PROGRESS).length;
    const active = this.todos.filter(todo => todo.status === TodoStatus.TODO).length;

    return { total, completed, active, inProgress };
  }
}

// Instance singleton
export const todoModel = new TodoModel(); 