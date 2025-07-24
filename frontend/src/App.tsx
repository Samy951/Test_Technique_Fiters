import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Todo, TodoStatus, groupTodosByStatus, Priority } from './types/Todo'
import { todoApi, safeApiCall } from './api/todoApi'
import KanbanBoard from './components/KanbanBoard'
import TodoForm from './components/TodoForm'
import Header from './components/Header'

function App() {
  // État principal
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // État du drag & drop
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)

  // Charger les todos au démarrage
  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await safeApiCall(() => todoApi.getAll())
    
    if (error) {
      setError('Impossible de charger les tâches')
      console.error('Load todos error:', error)
    } else if (data) {
      setTodos(data)
    }
    
    setLoading(false)
  }

  // Créer une nouvelle tâche
  const handleCreateTodo = async (todoData: {
    title: string
    description?: string
    priority?: Priority
    dueDate?: Date | null
  }) => {
    const { data, error } = await safeApiCall(() => todoApi.create(todoData))
    
    if (error) {
      setError('Impossible de créer la tâche')
      console.error('Create todo error:', error)
    } else if (data) {
      setTodos(prev => [data, ...prev])
      setError(null)
    }
  }

  // Mettre à jour une tâche
  const handleUpdateTodo = async (id: string, updateData: Partial<Todo>) => {
    const { data, error } = await safeApiCall(() => todoApi.update(id, updateData))
    
    if (error) {
      setError('Impossible de modifier la tâche')
      console.error('Update todo error:', error)
    } else if (data) {
      setTodos(prev => prev.map(todo => todo.id === id ? data : todo))
      setError(null)
    }
  }

  // Supprimer une tâche
  const handleDeleteTodo = async (id: string) => {
    const { error } = await safeApiCall(() => todoApi.delete(id))
    
    if (error) {
      setError('Impossible de supprimer la tâche')
      console.error('Delete todo error:', error)
    } else {
      setTodos(prev => prev.filter(todo => todo.id !== id))
      setError(null)
    }
  }

  // Toggle completed (pour drag entre colonnes)
  const handleToggleCompleted = async (id: string) => {
    const { data, error } = await safeApiCall(() => todoApi.toggleCompleted(id))
    
    if (error) {
      setError('Impossible de changer le statut')
      console.error('Toggle completed error:', error)
    } else if (data) {
      setTodos(prev => prev.map(todo => todo.id === id ? data : todo))
      setError(null)
    }
  }

  // Gestion du drag & drop
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    
    const todo = todos.find(t => t.id === active.id)
    setDraggedTodo(todo || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Pour l'instant, pas de logique spéciale pendant le survol
    // On pourrait ajouter des animations ici
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    setActiveId(null)
    setDraggedTodo(null)
    
    if (!over) return
    
    const todoId = active.id as string
    const newStatus = over.id as TodoStatus
    
    // Trouver la tâche déplacée
    const todo = todos.find(t => t.id === todoId)
    if (!todo) return
    
    // Déterminer si on doit changer le statut completed
    const shouldBeCompleted = newStatus === 'done'
    
    if (todo.completed !== shouldBeCompleted) {
      // Mise à jour optimiste d'abord
      setTodos(prev => prev.map(t => 
        t.id === todoId 
          ? { ...t, completed: shouldBeCompleted, updatedAt: new Date() }
          : t
      ))
      
      // Puis mise à jour serveur
      await handleToggleCompleted(todoId)
    }
  }

  // Grouper les todos par statut pour le Kanban
  const groupedTodos = groupTodosByStatus(todos)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des tâches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        totalTodos={todos.length}
        completedTodos={todos.filter(t => t.completed).length}
      />
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm underline ml-2"
            >
              Ignorer
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <TodoForm onSubmit={handleCreateTodo} />
          
          <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <KanbanBoard
              groupedTodos={groupedTodos}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
              draggedTodo={draggedTodo}
            />
          </DndContext>
        </div>
      </main>
    </div>
  )
}

export default App 