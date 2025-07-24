import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Calendar, 
  Flag, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Clock,
  CheckCircle 
} from 'lucide-react'
import { Todo, Priority } from '../types/Todo'

interface TodoCardProps {
  todo: Todo
  onUpdate: (id: string, updateData: Partial<Todo>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const TodoCard = ({ todo, onUpdate, onDelete }: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : ''
  })

  // dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Helper pour les priorités
  const getPriorityConfig = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return { color: 'border-red-500 bg-red-50', text: 'text-red-700', label: 'Haute' }
      case Priority.MEDIUM:
        return { color: 'border-yellow-500 bg-yellow-50', text: 'text-yellow-700', label: 'Moyenne' }
      case Priority.LOW:
        return { color: 'border-green-500 bg-green-50', text: 'text-green-700', label: 'Basse' }
    }
  }

  // Helper pour le formatage des dates
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Aujourd\'hui'
    if (diffDays === 1) return 'Demain'
    if (diffDays === -1) return 'Hier'
    if (diffDays < 0) return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`
    if (diffDays <= 7) return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const isOverdue = todo.dueDate && todo.dueDate < new Date() && !todo.completed
  const priorityConfig = getPriorityConfig(todo.priority)

  // Handlers
  const handleSave = async () => {
    try {
      await onUpdate(todo.id, {
        title: editData.title.trim(),
        description: editData.description.trim(),
        priority: editData.priority,
        dueDate: editData.dueDate ? new Date(editData.dueDate) : null
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Erreur mise à jour:', error)
    }
  }

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : ''
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(todo.id)
    } catch (error) {
      console.error('Erreur suppression:', error)
      setIsDeleting(false)
    }
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 transform rotate-2 kanban-card"
      >
        <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-300">
          <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card bg-white rounded-lg shadow-sm border-l-4 ${priorityConfig.color} cursor-grab active:cursor-grabbing ${
        isOverdue ? 'ring-2 ring-red-300' : ''
      }`}
    >
      <div className="p-4">
        {isEditing ? (
          // Mode édition
          <div className="space-y-3">
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            
            <textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
              placeholder="Description..."
            />
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={editData.priority}
                onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as Priority }))}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value={Priority.LOW}>Basse</option>
                <option value={Priority.MEDIUM}>Moyenne</option>
                <option value={Priority.HIGH}>Haute</option>
              </select>
              
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="px-2 py-1 border rounded text-sm"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={handleSave}
                disabled={!editData.title.trim()}
                className="p-1 text-blue-500 hover:text-blue-700 disabled:opacity-50 rounded"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          // Mode affichage
          <div>
            {/* Header avec statut et priorité */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 leading-tight">
                  {todo.title}
                </h4>
                {todo.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {todo.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                {todo.completed && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color} ${priorityConfig.text}`}>
                  <Flag className="h-3 w-3 inline mr-1" />
                  {priorityConfig.label}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
              <div className="flex items-center space-x-3">
                {todo.dueDate && (
                  <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(todo.dueDate)}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(todo.updatedAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-blue-500 rounded transition-colors"
                  title="Modifier"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50 rounded transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Indicateur d'urgence */}
            {isOverdue && (
              <div className="mt-2 px-2 py-1 bg-red-100 border border-red-200 rounded text-xs text-red-700">
                ⚠️ Échéance dépassée
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoCard 